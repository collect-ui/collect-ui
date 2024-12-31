import React, {useState, useEffect, useRef, useCallback, useMemo, useContext} from 'react';
import {App, Input, Popover, Tag} from 'antd';
import { DownOutlined,CloseCircleOutlined  } from '@ant-design/icons';
import transferProp from "../../utils/transferProp";
import {ajaxAction} from "../../register_utils/actionUtils";
import { AgGridReact } from "ag-grid-react"
import FormContext from '../../provider/formProvider';
import ScopedRender from "../../utils/scopedRender"
import RenderTags from "./RenderTags.jsx"
import debounce from 'lodash/debounce.js';


export default function PullDown(props) {
    const {multiple,pullDownId,pullDownConfig,...rest}=props
    const {...newProps }= transferProp(rest, "pull-down")
    // 这个是本页选中数据
    const [selectedRows, setSelectedRows] = useState([]);
    // 这个是全部数据
    const [rows, setRows] = useState([]);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const textareaRef = useRef(null);
    const tagsContainerRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const [search,setSearch] = useState("")
    const useApp = App.useApp()
    const gridRef = useRef()
    const { setFormValue } = useContext(FormContext);
    const inputFocus =(clearValue=false)=>{
        textareaRef.current.focus(); // Focus the textarea
        if (clearValue){
            setSearch('')
        }
    }
    const [data,setData] =useState([]);
    useEffect(()=>{
        if(props.mountGetData || pullDownConfig.getMountGetData()){
            getDataList()
        }
        const resizeObserver = new ResizeObserver(() => {
            updateTextareaPosition();
        });
        if (textareaRef.current) {
            resizeObserver.observe(textareaRef.current.resizableTextArea.textArea);
            //@ts-ignore
            resizeObserverRef.current = resizeObserver;
        }
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };

    },[])
    const getDataList = useCallback(debounce(async () => {
        const httpFunc = ajaxAction();
        const attrs = {};
        const configAttrs = pullDownConfig.getAttrs();
        if (configAttrs) {
            configAttrs.forEach(field => {
                attrs[field] = props[field];
            });
        }
        const action = {
            api: pullDownConfig.getApi(),
            data: {
                search: search,
                ...pullDownConfig.getData(),
                ...attrs
            }
        };
        const data = await httpFunc(action, props.store, props.rootStore, useApp);
        if (data.success) {
            setData(data.data);
        } else {
            useApp?.message?.error(data.msg);
        }
    }, 300), [props, pullDownConfig, search, useApp]);
    const onGridReady = useCallback((params) => {
        setTimeout(() => {
            params.api.sizeColumnsToFit()
        }, 10)
    }, [])
    // 处理排序后，排序号不跟着变
    const onSortChanged = useCallback((params) => {
        params.api.refreshCells({ force: true })
    }, [])
    const onRowClicked = (event) => {
        inputFocus(true)
    };
    const onSelectionChanged = useCallback((event) => {
        // 设置复选框的绑定对象
        // if (selection) {
        const selectedData = event.api.getSelectedRows()
        handlerRows(selectedData)
        // const selectionName = varName(selection)
        //     store.setValue(selectionName, selectedData)
        // }
    }, [])
    const handlerRows=(selectedRows)=>{
        // 设置选中项
        setSelectedRows(selectedRows)
        // todo 处理未分页的数据,这里现不考虑分页清空，默认就是选中数据
        let totalRows = selectedRows
        setRows(totalRows)
        if(!config.multiple){
            const value = getValueSingle(totalRows)
            props.onChange(value)
            // 关闭弹框
            setIsPopoverVisible(false)
        }
        // todo 改变其他表单的值
        // setFormValue("rows",rows)
    }
    const clearRow=()=>{
        handlerRows([])

        // @ts-ignore
        gridRef?.current?.api.deselectAll()

    }
    const config = useMemo(()=>{
        let multiple=false
        if(props.multiple!=undefined) {
            multiple=props.multiple
        }else if(pullDownConfig.multiple!=undefined){
            multiple=pullDownConfig.multiple
        }
        // 提示语
        let placeholder = pullDownConfig.getPlaceholder()
        if(props.placeholder!=undefined){
            placeholder=props.placeholder
        }

        return {
            multiple,
            placeholder,
            labelField: pullDownConfig.getLabelField(),
            valueField: pullDownConfig.getValueField()
        }
    },[])
    const content =(
        <div

            className="ag-theme-quartz" style={{'width':"100%",height:"350px"}}>
            <AgGridReact
                headerHeight="36px"
                rowHeight="32px"
                tooltipShowDelay={0}
                ref={gridRef}
                rowData={data}
                onSortChanged={onSortChanged}
                onGridReady={onGridReady}
                rowSelection={config.multiple?'multiple':'single'}
                onSelectionChanged={onSelectionChanged}
                onRowClicked={onRowClicked} // 行点击事件处理
                columnDefs={pullDownConfig.getColDefs()}
            ></AgGridReact>
        </div>
    )



    const updateTextareaPosition = useCallback(() => {
        if (tagsContainerRef.current && textareaRef.current) {
            // Set a minimum height for the textarea to avoid it being too small
            const minHeight = 32; // Adjust this value as needed
            // Adjust padding-top based on the number of lines
            const basePaddingTop = 4; // Base padding-top value
            const tagLineHeight = 26.2; // Adjust this value as needed (tag line height)
            const textareaWidth = textareaRef.current.resizableTextArea.textArea.clientWidth - 24; // Subtract 24px for paddingRight
            textareaRef.current.resizableTextArea.textArea.style.minHeight = "";
            // Calculate the position of the last tag
            const lastTag = tagsContainerRef.current.lastChild;
            if (lastTag) {
                const lastTagRect = lastTag.getBoundingClientRect();
                const tagsContainerRect = tagsContainerRef.current.getBoundingClientRect();
                let totalLines = 1;
                let currentLineWidth = 0;
                const tags = tagsContainerRef.current.children;
                const tagMargin = 4; // 4px for spacing
                let wordWidth = 2 * 16; // Assuming 16px is the width of two characters
                let tagWidthList=[]
                // 根据水缸，舀水一样，拿杯子容器去装水，去判断可以放几杯，就是几行
                // textareaWidth 就是容器大小
                // can 表示容器，将所有tag的宽度，完can 里面放，放的下，就放。放不下，就清空，加一行
                for (let i = 0; i < tags.length; i++) {
                    const tagRect = tags[i].getBoundingClientRect();
                    const tagWidth = tagRect.width + tagMargin;
                    tagWidthList.push(tagWidth)
                }
                let can = 0
                let  size = tagWidthList.length
                for(let i=0;i<size;i++){
                    let currentSize = tagWidthList[i]
                    can+=currentSize
                    currentLineWidth=can
                    if (can+wordWidth+8>textareaWidth){
                        // 如果容器放不下，在加一个容器。判断容器是否还是剩下40px标准，
                        // 如果大于40 证明还有空间，小于40则要换行
                        totalLines++
                        currentLineWidth=0
                        can=0
                    }
                }
                // 最后一个tag后的光标位置
                const paddingLeft = lastTagRect.right - tagsContainerRect.left + 8; // 2px for spacing
                // 最后一个tag剩余宽度
                const maxTagWidth = textareaWidth - paddingLeft;
                if(can==0 && maxTagWidth<wordWidth+8){// 如果最后一个标签位置，不足40px，换行
                    textareaRef.current.resizableTextArea.textArea.style.paddingLeft = '6px'
                }else{
                    textareaRef.current.resizableTextArea.textArea.style.paddingLeft = `${paddingLeft}px`;
                }
                let finalPaddingTop = basePaddingTop + (totalLines - 1) * tagLineHeight;
                textareaRef.current.resizableTextArea.textArea.style.paddingTop = `${finalPaddingTop}px`;
                // Calculate the textarea height based on the number of lines and the minimum height
                const textareaHeight = Math.max(finalPaddingTop + tagLineHeight, minHeight); // Add 2px to the height
                textareaRef.current.resizableTextArea.textArea.style.height = `${textareaHeight}px`;
            } else {// 默认样式
                // If there are no tags, reset the textarea height to the minimum height
                textareaRef.current.resizableTextArea.textArea.style.height = `${minHeight}px`;
                textareaRef.current.resizableTextArea.textArea.style.paddingTop = '4px'; // Reset padding-top
                textareaRef.current.resizableTextArea.textArea.style.paddingLeft = '11px'; // Reset padding-left
            }
        }
    },[]);

    // 当选中的值发生变化，更新光坐标
    useEffect(() => {
        updateTextareaPosition();
    }, [selectedRows]);
    useEffect(()=>{
        if(!config.multiple){
            let row = getRowByValue(props.value)
            if(row){
                setRows([row])
            }else{
                setRows([])
            }
        }
    },[props.value,data])

    const getRowByValue = (value)=>{
        let row =null
        if(data){
            for(let i=0; i<data.length; i++){
                const rowValue = getValue(data[i])
                if(rowValue===props.value){
                    row = data[i]
                    break
                }
            }
        }
        if(!row && value){
            row = {
                [config.valueField]:value
            }

        }
        return row

    }

    const handleTogglePopover = (e) => {
        e.stopPropagation()
        setIsPopoverVisible(!isPopoverVisible);
        if(!isPopoverVisible){
            inputFocus()
        }
    };

    const popoverClick=()=>{
        // 打开popover
        setIsPopoverVisible(true)
        // 聚焦
        inputFocus(false)
    }
    const getLabel=useCallback((row)=>{
        const labelField=pullDownConfig.getLabelField()
        return row[labelField]
    },[])
    const LabelSingle=({rows})=>{
        if(rows && rows.length>0){
            return getLabel(rows[0])
        }
        return ""
    }

    const getValueSingle=useCallback((totalRows)=>{
        if(totalRows!=undefined){
            if(totalRows.length>0){
                return getValue(totalRows[0])
            }else{
                return ""
            }
        }
        if(rows.length>0){
            return getValue(rows[0])
        }
        return ""
    },[rows])
    const hasRow=useCallback(()=>{
        if(rows.length>0){
            return true
        }
        return false
    },[rows])
    const getValue=useCallback((row)=>{
        const valueField=pullDownConfig.getValueField()
        return row[valueField]
    },[])
    const getId=useCallback((row)=>{
        const valueField=pullDownConfig.getValueField()
        const idField=pullDownConfig.getIdField()
        if(idField){
            return row[idField]
        }else{
            return row[valueField]
        }

    },[])
    const handlePressEnter = (e) => {
        e.preventDefault(); // 阻止默认的换行行为
        getDataList()
        // 在这里执行你需要的操作，例如查询操作
    };
    const afterRender= pullDownConfig.getAfterRender()
    return (
        <div className={newProps.className} id={pullDownId}>
            <Popover
                overlayStyle={{ width: '100%' }}
                getPopupContainer={() => document.getElementById(pullDownId)}
                trigger="click"
                placement="bottomLeft"
                content={content}
                open={isPopoverVisible}
                onClick={popoverClick}
                onOpenChange={setIsPopoverVisible}
            >
                <div className={newProps.className} >
                    <Input.TextArea
                        ref={textareaRef}
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        placeholder={hasRow()?'':config.placeholder}
                        className="input"
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        onPressEnter={handlePressEnter}
                        value={search}
                    />
                    <div ref={tagsContainerRef} className="tags">
                        {config.multiple && <RenderTags
                            rows={rows}
                            getLabel={getLabel}
                            getId={getId}
                        >

                        </RenderTags>}
                        { !config.multiple && !search && hasRow() && <label className="label-single"><LabelSingle rows={rows}></LabelSingle></label>}
                    </div>
                    <div
                        className="down"

                    >
                        { hasRow() && !search  && <CloseCircleOutlined onClick={clearRow} className="close" />}
                        <DownOutlined  onClick={handleTogglePopover} className={isPopoverVisible ? 'rotate-180' : 'rotate-0'} />
                    </div>
                </div>
            </Popover>
            {props.value && afterRender && <ScopedRender {...afterRender}  store={props.store} rootStore={props.rootStore} _target_value={props.value} />}
        </div>
    );
}
