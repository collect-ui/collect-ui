import ScopedRender from "../utils/scopedRender"
import React from "react"
import isArray from "../utils/isArray"
import { v4 as uuid } from "uuid"

export default function (props: any, store: any, rootStore: any) {
  props?.columnDefs.forEach((item) => {
    if (item.cellRender) {
      const cellRender = item.cellRender
      item.cellRenderer = (params) => {
        if (isArray(cellRender)) {
          return cellRender.map((renderItem) => (
            <ScopedRender
              key={uuid()}
              {...renderItem}
              _target={{row:params.data}}
              store={store}
              rootStore={rootStore}
            ></ScopedRender>
          )) // 多列情况处理，返回一个数组，每一项是ScopedRender
        } else {
          return (
            <ScopedRender
              {...cellRender}
              _target={{row:params.data}}
              store={store}
              rootStore={rootStore}
            ></ScopedRender>
          )
        }
      }
    }
  })
}
