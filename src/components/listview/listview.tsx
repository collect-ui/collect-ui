import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import ScopedRender from "../../utils/scopedRender"
import transferProp from "../../utils/transferProp"
import NoData from "../no-data/no-data"

const DynamicListView = (props) => {
  const { ...rest } = props
  let { itemData, ...newProps } = transferProp(rest, "listview")
  if (!itemData) {
    return <NoData />
  }
  return (
    <React.Fragment>
      {itemData.map((item) => {
        return (
          <ScopedRender
            {...item}
            store={rest.store}
            rootStore={rest.rootStore}
          />
        )
      })}
    </React.Fragment>
  )
}

export default DynamicListView
