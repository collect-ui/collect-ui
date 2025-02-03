import transferProp from "../../utils/transferProp"
import { AgGridReact } from "ag-grid-react" // React Data Grid Component

import React, { useCallback, useEffect, useRef } from "react" // Optional Theme applied to the Data Grid
import { Suspense } from "react"
import varName from "../../utils/varName"
import handlerActions from "../../utils/handlerActions"
import { App } from "antd"
import getVisible from "../../utils/getVisible";
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
  const { theme,selection, rowClick, rowClickAction, ...rest } = props
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
  const onSelectionChanged = useCallback((event) => {
    // 设置复选框的绑定对象
    if (selection) {
      const selectedData = event.api.getSelectedRows()
      const selectionName = varName(selection)
      store.setValue(selectionName, selectedData)
    }
  }, [])
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

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (gridRef.current && gridRef.current?.api) {
  //       setTimeout(()=>{
  //         gridRef.current?.api.sizeColumnsToFit();
  //       },10)
  //
  //     }
  //   };
  //
  //   window.addEventListener('resize', handleResize);
  //
  //   // Cleanup listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);
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
  }, []);


  const show = getVisible(props)
  if(!show) {
    return null
  }

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
          {...newRest}
        ></AgGridReact>
      </div>
    </Suspense>
  )
}
