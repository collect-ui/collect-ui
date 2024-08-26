import { App, Tabs } from "antd"
import transferProp from "../../utils/transferProp"
import renderChildren from "../render/render-children"
import varValue from "../../utils/varValue"
import ScopedRender from "../../utils/scopedRender"
import { v4 as uuid } from "uuid"

export default function (props: any) {
  const { action, items, confirm, ...rest } = props
  const store = props.store
  const rootStore = props.rootStore
  const newItems = []
  //注意不能改变原来children
  items.forEach(({key,...item}) => {
    for (const attrKey in item) {
      item[attrKey] = varValue(item[attrKey], props.store)
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
        items={items.map(({key,...item}) => {
          return {
            ...item,
            key,
            // children: renderChildren(item.children, store, rootStore),
            children: (
              <ScopedRender
                tag="layout-fit"
                {...item}

                store={props.store}
                rootStore={props.rootStore}
                _target={props._target}
              />
            ),
          }
        })}
      />
    </>
  )
}
