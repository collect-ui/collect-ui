import transferProp from "../../utils/transferProp"
import { AgGridReact } from "ag-grid-react" // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css" // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"
import React, { useCallback, useEffect, useRef } from "react" // Optional Theme applied to the Data Grid
import { Suspense } from "react"
import varName from "../../utils/varName"
import handlerActions from "../../utils/handlerActions"
import { App } from "antd"
import ScopedRender from "../../utils/scopedRender"
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
  const { selection, rowClick, rowClickAction, ...rest } = props
  const store = props["store"]
  const rootStore = props["rootStore"]
  const useApp = App.useApp()
  const newProps = transferProp(rest, "table")
  const { style, ...newRest } = newProps
  const tableStyle = style || { height: "100%", width: "100%" }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onGridReady = useCallback((params) => {
    setTimeout(() => {
      params.api.sizeColumnsToFit()
    }, 0)
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
    console.log(event)
    //设置行绑定对象
    if (rowClick) {
      const rowClickName = varName(rowClick)
      store.setValue(rowClickName, event.data)
    }
    if (rowClickAction) {
      handlerActions(rowClickAction, store, rootStore, useApp)
    }
  }, [])

  return (
    <Suspense fallback={<Loading></Loading>}>
      <div className={"ag-theme-quartz"} style={tableStyle}>
        <AgGridReact
          onGridReady={onGridReady}
          ref={gridRef}
          headerHeight="36px"
          rowHeight="32px"
          onSelectionChanged={onSelectionChanged}
          onSortChanged={onSortChanged}
          onRowClicked={onRowClicked}
          {...newRest}
        ></AgGridReact>
      </div>
    </Suspense>
  )
}
