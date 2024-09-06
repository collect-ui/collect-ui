import { App, Tabs } from "antd"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import ScopedRender from "../../utils/scopedRender"
import {useCallback} from "react";
import varName from "../../utils/varName";
import setStoreValue from "../../utils/setStoreValue";
import handlerActions from "../../utils/handlerActions"

export default function (props: any) {
  const { action, items, confirm, ...rest } = props
  const store = props.store
  const rootStore = props.rootStore
  const useApp = App.useApp()
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
  const onChange=useCallback((activeKey)=>{
    if(props.activeKey){
      // 获取配置激活标签页
      const activeKeyName = varName(props.activeKey)
      setStoreValue(activeKeyName, activeKey, store)
    }
    // 处理动作
    if(action){
      // 延迟处理是为了页面的表单还没有生成，appendFormFields请求发送出错。先等页面处理完成
      // 相当于vue $nextTick
      setTimeout(()=>{
        handlerActions(action, store, rootStore, useApp)
      },0)

    }

  },[])
  return (
    <>
      <Tabs
        {...newProps}
          onChange={onChange}
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
