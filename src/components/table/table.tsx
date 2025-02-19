import transferProp from "../../utils/transferProp"
import { AgGridReact } from "ag-grid-react" // React Data Grid Component

import React, { useCallback, useEffect, useRef } from "react" // Optional Theme applied to the Data Grid
import { Suspense } from "react"
import varName from "../../utils/varName"
import handlerActions from "../../utils/handlerActions"
import { App } from "antd"
import getVisible from "../../utils/getVisible";
import varValue from "../../utils/varValue";

function Loading() {
  return <div>加载中...</div>
}
let status = "pending"
let result: any
function wrapPromise(promise: Promise<any>) {
  let suspender = promise.then(
    (r: any) => {
      status = "success"
      result = r
    },
    (e: any) => {
      status = "error"
      result = e
    },
  )
  if (status === "pending") {
    throw suspender
  } else if (status === "error") {
    throw result
  } else if (status === "success") {
    return result
  }
}
export default function (props: any) {
  console.log("table render")
  const gridRef = useRef()
  const containerRef = useRef()
  const { onSelection,onDataChanged,theme,selection, rowClick, cellChangedAction,dragAction,rowClickAction, ...rest } = props
  const store = props["store"]
  const rootStore = props["rootStore"]
  const useApp = App.useApp()

  const newProps = transferProp({theme,...rest}, "table")
  const { style, ...newRest } = newProps
  const tableStyle = style || { height: "100%", width: "100%" }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onGridReady = useCallback((params) => {
    setTimeout(() => {
      params.api.sizeColumnsToFit()
    }, 10)
  }, [])
  // 处理排序后，排序号不跟着变
  const onSortChanged = useCallback((params) => {
    params.api.refreshCells({ force: true })
  }, [])
  // 复选变化
  const onSelectionChanged = useCallback((event) => {
    // 设置复选框的绑定对象
    if (selection) {
      const selectedData = event.api.getSelectedRows()
      const selectionName = varName(selection)
      store.setValue(selectionName, selectedData)
    }
    if(onSelection){
      const selectedData = event.api.getSelectedRows()
      onSelection(selectedData)
    }
  }, [])
  // 行点击事件
  const onRowClicked = useCallback((event) => {
    //设置行绑定对象
    if (rowClick) {
      const rowClickName = varName(rowClick)
      store.setValue(rowClickName, event.data)
    }
    if (rowClickAction) {
      handlerActions(rowClickAction, store, rootStore, useApp,{row:event.data},false,props.namespace)
    }
  }, [])
  // 编辑模式结束
  const onDragChanged = useCallback(async (event) => {
    if (dragAction) {
      const draggedNode = event.node;
      const draggedDataOld = draggedNode.data;
      let overIndex = event.overIndex;
      // 获取原来的序号
      function getOldIndex(rowData,item){
        let index=-1
        for(let i=0;i<rowData.length;i++){
          let target = rowData[i]
          let is_equal = true
          // 判断所有的字段相等
          // todo 这里可以优化，如果指定主键了化
          for(let key in target){
            if(target[key]!=item[key]){
              is_equal = false
              break;
            }
          }
          // 如果相等跳出
          if(is_equal){
            index = i
            break;
          }
        }
        return index

      }
      // 从原位置移除拖拽行


      const dataListName = props.rowData
      // 从store 里面获取变量
      const rowData = varValue(dataListName,store)
      const oldIndex = getOldIndex(rowData,draggedDataOld);
      const newRowData = [];
      // 重新复制出来一份数据
      // todo 以后改成配置
      const field = 'order_index'
      rowData.forEach(row=>{
        newRowData.push({...row})
      })
      // 先删除
      newRowData.splice(oldIndex, 1);
      // 将拖拽行插入到新位置
      const draggedData={}
      for(let key in draggedDataOld ){
        draggedData[key]=draggedDataOld[key]
      }
      if (overIndex<0){
        overIndex=newRowData.length+oldIndex
      }
      newRowData.splice(overIndex, 0, draggedData);
      newRowData.forEach((item,index)=>item[field]=(index+1)*10)
      const result = await handlerActions(dragAction, store, rootStore, useApp, {rows: newRowData}, false, props.namespace)
    }
  }, [])
  const onCellChanged = useCallback(async (event) => {
    if (cellChangedAction) {
      const result = await handlerActions(cellChangedAction, store, rootStore, useApp, {row: event.data}, false, props.namespace)
      // 如果编辑失败，重新进入编辑模式
      //@ts-ignore
      if (result?.success === false) { // 假设 handlerActions 返回 false 表示失败
        event.api.startEditingCell({
          rowIndex: event.rowIndex,
          colKey: event.column.getId(),
        });
      }
    }
    if(onDataChanged){
      onDataChanged(props.rowData)
    }

  }, [props.rowData])


  // 处理页面变宽过后，表格适应页面，撑开
  useEffect(() => {
    const handleResize = () => {
      //@ts-ignore
      if (gridRef.current && gridRef.current?.api) {
        setTimeout(() => {
          //@ts-ignore
          gridRef.current?.api.sizeColumnsToFit();
        }, 10)
      }
    };

    // 使用 ResizeObserver 监听 containerRef 的大小变化
    const resizeObserver = new ResizeObserver(handleResize);
    //@ts-ignore
    resizeObserver.observe(containerRef.current);

    // Cleanup listener on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [])

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseLeave = (event) => {

      //@ts-ignore
      if (gridRef.current && gridRef.current.api && (!container.contains(event.target)||event.target.classList.contains('ag-center-cols-viewport'))) {
        //@ts-ignore
        const editingCells = gridRef.current.api.getEditingCells();
        if (editingCells.length > 0) {
          // 阻止编辑模式关闭
          //@ts-ignore
          gridRef.current.api.stopEditing(); // false 表示不触发 onCellEditingStopped
        }
      }
    };

    if (container && (cellChangedAction || onDataChanged)) {
      //@ts-ignore
      window.addEventListener('click', handleMouseLeave);
    }

    return () => {
      if (container && (cellChangedAction || onDataChanged)) {
        //@ts-ignore
        window.removeEventListener('click', handleMouseLeave);
      }
    };
  }, []);


  const show = getVisible(props)
  if(!show) {
    return null
  }

  // 定义中文提示文本
  const localeText = {
    noRowsToShow: '暂无数据', // 将 "No rows to show" 改为 "暂无数据"
    loadingOoo: '加载中...',
    page: '页',
    more: '更多',
    to: '到',
    of: '共',
    next: '下一页',
    last: '最后一页',
    first: '第一页',
    previous: '上一页',
  };

  return (

    <Suspense fallback={<Loading></Loading>}>
      <div
          ref={containerRef}
          className={['ag-theme-quartz','ag-theme-balham'].indexOf(theme)>=0?theme:"ag-theme-quartz"} style={tableStyle}>
        <AgGridReact
          onGridReady={onGridReady}
          ref={gridRef}
          headerHeight={props.headerHeight?props.headerHeight:"36px"}
          rowHeight={props.rowHeight?props.rowHeight:"32px"}
          tooltipShowDelay={0}
          onSelectionChanged={onSelectionChanged}
          onSortChanged={onSortChanged}
          onRowClicked={onRowClicked}
          onCellEditingStopped={onCellChanged}
          onRowDragEnd={onDragChanged}
          localeText={localeText}
          {...newRest}
        ></AgGridReact>
      </div>
    </Suspense>
  )
}
