import { v4 as uuid } from "uuid"
import {getPullDown} from "../register_pulldown";
import isArray from "../utils/isArray";
import ScopedRender from "../utils/scopedRender";
import React from "react";
export default function (props: any, store: any, rootStore: any) {
  if (!props.pullDownId) {
    props.pullDownId = uuid()
  }
  props.pullDownConfig=getPullDown("attachment-list")
  const colDefs = props.pullDownConfig.getColDefs()
  colDefs.forEach((item) => {
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
      delete item.cellRender
    }
  })
  const after = props.pullDownConfig.getAfterRender()
  if(after){
   // const newAfterRender =( <ScopedRender
   //      {...props.afterRender}
   //      store={store}
   //      rootStore={rootStore}
   //  ></ScopedRender>)
   //  props.pullDownConfig.setAfterRender(newAfterRender)
  }
}
