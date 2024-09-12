import {App, Tabs} from "antd"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import ScopedRender from "../../utils/scopedRender"
import React, {useCallback, useMemo} from "react";
import varName from "../../utils/varName";
import setStoreValue from "../../utils/setStoreValue";
import handlerActions from "../../utils/handlerActions"
import {v4 as uuid} from "uuid"
import NoData from "../no-data/no-data";
import {useContextMenu} from "react-contexify";
import genContextMenu from "../../utils/genContextMenu";


export default function (props: any) {
    const {tabId,keyField, action,removeAction, rightMenu,rightMenuAction,itemAttr, items, confirm, ...rest} = props
    const store = props.store
    const rootStore = props.rootStore
    const useApp = App.useApp()
    const {itemData, ...newProps} = transferProp(rest, "tabs")
    const MENU_ID = `tree-menu-id-${tabId}`
    const { show } = useContextMenu({
        id: MENU_ID,
    })
    const onChange = useCallback((activeKey) => {
        if (props.activeKey) {
            // 获取配置激活标签页
            if(props._target_row){
                props._target_row?.setActiveKey(activeKey)
            }else{
                const activeKeyName = varName(props.activeKey)
                setStoreValue(activeKeyName, activeKey, store)
            }

        }
        // 处理动作
        if (action) {
            // 延迟处理是为了页面的表单还没有生成，appendFormFields请求发送出错。先等页面处理完成
            // 相当于vue $nextTick
            setTimeout(() => {
                handlerActions(action, store, rootStore, useApp)
            }, 0)

        }

    }, [])

    const onContextMenu = useCallback((event,row) => {
        event.preventDefault()
        show({
            event: event,
            props: {
                row: row
            },
        })
    },[])
    const itemsMemo = useMemo(() => {
        if (items) {// 直接传items 的模式
            return items.map(({key, ...item}) => {
                return {
                    ...item,
                    key,
                    children: (
                        <ScopedRender
                            tag="layout-fit"
                            {...item}
                            store={props.store}
                            rootStore={props.rootStore}
                            _target={props._target}
                        />
                    )
                }
            })
        }
        if (!keyField) {
            throw new Error("tabs 中 keyField is required");
        }
        const arr= itemData.reduce((acc, item, index) => {
            const newAttr = {
                ...itemAttr,
                store:props.store,
                rootStore:props.rootStore,
                _target_row: item,
                // _target_rowIndex: index,
                _target_rowId: item[keyField]
            };
            // 添加当前的 ScopedRender 组件
            const {label,...newItemProps} = transferProp(newAttr,"tabs-item",useApp)
            acc.push(
                {
                    ...newItemProps,
                    label:!rightMenu?label:<div onContextMenu={(e)=>onContextMenu(e,item)}>{label}</div>,
                    key: keyField ? item[keyField] : uuid(),
                    children: (
                        <ScopedRender
                            tag="layout-fit"
                            {...newAttr}
                        />
                    )
                }
            );
            return acc;
        }, [])
        return arr

    }, [itemData, items, itemAttr, rest.store, rest.rootStore])
    const onEdit = useCallback((key,op)=>{
        if(op==='remove'){
            const target = {
                // 这里优先从上级传过来的数据，其次本身的数据
                // 主要处理webshell 中listview 在嵌套tabs。根据listview的数据优先级比较高
                row: props._target_row||itemData.find(item=>item[keyField]===key),
                key: key
            }
            handlerActions(removeAction, store, rootStore, useApp,target)
        }
    },[itemData])
    const handleItemClick = useCallback(({ props, item }) => {
        const { row } = props
        if (rightMenuAction) {
            handlerActions(rightMenuAction, rest.store, rest.rootStore, useApp, {
                item,
                row
            })
        }
        // Add your logic here
    }, [])
    if(itemsMemo.length <= 0){
        return <NoData/>
    }
    return (
        <>
            <Tabs
                {...newProps}
                onChange={onChange}
                onEdit={onEdit}
                items={itemsMemo}
            />
            {rightMenu && genContextMenu(MENU_ID, rightMenu, handleItemClick)}
        </>
    )
}
