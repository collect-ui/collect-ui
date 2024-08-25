import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import ScopedRender from "../../utils/scopedRender"
import transferProp from "../../utils/transferProp"
import NoData from "../no-data/no-data"
import varValue from "../../utils/varValue";
import { v4 as uuid } from "uuid"

const DynamicListView = (props) => {
  const { itemAttr,...rest } = props
  let { itemData, ...newProps } = transferProp(rest, "listview")
  if (!itemData) {
    return <NoData />
  }
  return (
    <React.Fragment >
      {itemData.map((item) => {
        const newAttr = {...itemAttr}
        const target={row:item}
        for(const key in newAttr ){
          newAttr[key]=varValue(newAttr[key],rest.store,target)
        }
        newAttr['_target']=target
        return (
          <ScopedRender
              key={uuid()}
            {...newAttr}
            store={rest.store}
            rootStore={rest.rootStore}
          />
        )
      })}
    </React.Fragment>
  )
}

export default DynamicListView
