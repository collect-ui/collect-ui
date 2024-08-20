import { App, Tabs } from "antd"
import transferProp from "../../utils/transferProp"
import renderChildren from "../render/render-children"
import varValue from "../../utils/varValue"
import ScopedRender from "../../utils/scopedRender"

export default function (props: any) {
  const { action, items, confirm, ...rest } = props
  const store = props.store
  const rootStore = props.rootStore
  const newItems = []
  //注意不能改变原来children
  items.forEach((item) => {
    for (const key in item) {
      item[key] = varValue(item[key], props.store)
    }
    newItems.push({
      ...item,
      children: (
        <ScopedRender
          tag="layout-fit"
          {...item}
          store={props.store}
          rootStore={props.rootStore}
        />
      ),
    })
  })
  const newProps = transferProp(rest, "tabs")
  return (
    <>
      <Tabs
        {...newProps}
        items={items.map((item) => {
          return {
            ...item,

            // children: renderChildren(item.children, store, rootStore),
            children: (
              <ScopedRender
                tag="layout-fit"
                {...item}
                store={props.store}
                rootStore={props.rootStore}
              />
            ),
          }
        })}
      />
    </>
  )
}
