import transferProp from "../../utils/transferProp"
import Title from "../title/title"
import { getConfig } from "../../utils"
import renderChildren from "../render/render-children"
import treeToArray from "../../utils/tree2Array"
import { App, Form } from "antd"
import { useForm } from "antd/lib/form/Form"
import {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react"

import handlerActions from "../../utils/handlerActions"

// function handlerChildrenForm(children: any, store: any) {
//   const childList = treeToArray(children)
//   // // 处理children 里面的表单，能在外层拿到引用
//   childList.forEach((child) => {
//     const { tag, name, valueRule } = child
//     if (tag === "form" && name) {
//       const useForm = Form.useForm()
//       // 表单引用
//       store.setFormRef(name, useForm)
//       // 表单规则
//       if (valueRule) {
//         store.setFormRule(name, valueRule)
//       }
//       child.form = useForm[0]
//     }
//   })
// }

export default function (props: any) {
  const {
    topRight,
    topRightRender,
    // 顶部搜索
    searchToolBar,
    searchToolBarRender,
    searchBarRight,
    searchBarRightRender,
    // 底部工具栏
    bottomToolBar,
    bottomToolBarRender,
    // 低对齐方式
    bottomAlign,
    children,
    childrenRender,
    initStore,
    ...rest
  } = props
  const useApp = App.useApp()
  const store = props["store"]
  console.log("layout-fit-render")

  // 处理变量初始化
  const initAction = props["initAction"]
  useEffect(() => {
    if (initAction && store) {
      handlerActions(initAction, store, props.rootStore, useApp)
    }
  }, [])

  const bottomAlignClass = bottomAlign || "right"
  const { title, ...newProps } = transferProp(rest, "layout-fit", useApp)
  return (
    <div {...newProps}>
      {title && (
        <div className="top-header">
          <Title className="top-title">{title}</Title>
          {topRightRender && <div>{topRightRender}</div>}
        </div>
      )}
      {searchToolBarRender && (
        <div className="bar">
          <div className="search-left">{searchToolBarRender}</div>
          {searchBarRightRender && (
            <div className="search-right">{searchBarRightRender}</div>
          )}
        </div>
      )}
      <div className="layout-content">{childrenRender}</div>
      {bottomToolBarRender && (
        <div className={`bottom-tool-bar ${bottomAlignClass}`}>
          {bottomToolBarRender}
        </div>
      )}
    </div>
  )
}
