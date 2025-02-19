import React, {useCallback, useEffect, useRef, useState} from "react"
import { v4 as uuid } from "uuid"
import {AgGridReact} from "ag-grid-react";
import varName from "../../utils/varName";
import transferProp from "../../utils/transferProp";
import handlerActions from "../../utils/handlerActions";
import varValue from "../../utils/varValue";
import {Button } from "antd"
import Table from "../table/table"


export default function (props) {
    const { theme,onChange, value, ...rest } = props
    const newProps = transferProp({theme,...rest}, "table")
    const { style, ...newRest } = newProps
    const tableStyle = style || { height: "200px", width: "100%" }
    const addRow = useCallback(() => {
        const columnDefs= newProps.columnDefs
        const target = {__rowId:uuid()}
        columnDefs.forEach(columnDef => {
            if (columnDef.field) {
                target[columnDef.field] = ""
            }
        })
        const rowData=value??[]
        onChange([...rowData,target])

    }, [value])
    const [selection,setSelection]=useState([])
    const removeSelection = useCallback(() => {
        // const rowData=value??[]
        const rowIdList = selection.map(item=>item.__rowId)
        setSelection([])
        const rowData=value?.filter(item=>!rowIdList.includes(item.__rowId))
        onChange(rowData)
    }, [value,selection])
    const onSelectionChanged = useCallback((selection) => {
        setSelection(selection)
    }, [])

    const dataChanged = useCallback((rowData) => {
        onChange(rowData)
    }, [])


    return (
        <div>
            <div style={{padding: "10px 0"}}>
                <Button onClick={addRow} style={{marginRight:10}} type="primary" size="small" >新增</Button>
                <Button onClick={removeSelection} disabled={selection.length==0} danger={true} type="primary" size="small">删除</Button>
            </div>
            <Table onDataChanged={ dataChanged} style={tableStyle} onSelection={onSelectionChanged} rowData={value??[]} {...newRest}></Table>
        </div>
    )
}
