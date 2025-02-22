import React, {memo} from "react"
import {
  getRegister,
  hasRegister,
  getStore,
  hasStore,
  hasInitPlugin,
  getInitPlugin,
  getInitStoreType,
} from "../../index"
import { v4 as uuid } from "uuid"
import RenderChildren from "./render-children"
import { isIgnoreRenderChildrenNode } from "../../utils/rules.tsx"
import { types } from "mobx-state-tree"

import handlerActions from "../../utils/handlerActions";
import getPassVar from "../../utils/getPassVar";
import {App} from "antd";
import getStoreName from "../../utils/getStoreName";

function genStore(initStore,initStoreType): any {
  const transferType = {
    // 处理表单引用
    _formRef: types.optional(types.frozen(), {}),
    // 表单规则
    _formRule: types.optional(types.frozen(), {}),
    // 页面初始动作
    _initAction: types.optional(types.frozen(), []),
  }
  for (let key in initStore) {
    const type = typeof initStore[key]
    if (type === "boolean") {
      transferType[key] = types.optional(types.boolean, initStore[key])
    } else if (type === "string") {
      transferType[key] = types.optional(types.string, initStore[key])
    } else if (type === "object") {
      if(initStoreType && initStoreType[key]){
        const storeType = initStoreType[key]
        const tmp = getInitStoreType(storeType)
        if (tmp){
          transferType[key]=tmp

        }else if(typeof(storeType)==="object"){
          // 根据类型自定义 比如
          // 1.这里的逻辑尚未成功，由于在表格中修改数据，必须定义action,导致修改不了
          // 2.还有就是类型转换还是不成功，原始[{...}] 转frozen[]
          // 开发模式下会报错，但是生成模式下能修改，直接不定类型可以用
          /*
          "dataList": {
            "type": "array",
            "properties": {
              "name": {
                "type":
              },
              "value": {
                "type": "string"
              }
            }
           }
           *
           */
          const obj={}
          for (let subKey in storeType["properties"]){
             const subKeyValue = storeType["properties"][subKey]
            if(subKeyValue["type"]=="string"){
              obj[subKey] =  types.optional(types.string, "")
            }else if(subKeyValue["type"]=="boolean"){
              obj[subKey] =  types.optional(types.bool, false)
            }else if(subKeyValue["type"]=="number"){
              obj[subKey] =  types.optional(types.number, "")
            }
          }
          const auto = types.model('_auto', obj).actions((self) => {return {}})
          transferType[key] =  types.array(auto)
        }else{
          console.error("注册自定义类型："+storeType)
          console.error("但是没找到类型："+storeType)
        }
        continue
      }
      // 如果是数组的处理
      if (Array.isArray(initStore[key])) {

          transferType[key] = types.optional(
              types.array(types.frozen()),
              initStore[key],
          )
      } else {
        transferType[key] = types.optional(types.frozen(), initStore[key])
      }
    } else {
      transferType[key] = initStore[key]
    }
  }
  const store = types
    .model("genStore", transferType)
    .views((self) => {
      return {
        getValue(key: string) {
          return self[key]
        },
        getFormRef(key: string) {
          return self._formRef[key]
        },
        hasFormRef(key: string) {
          return Object.hasOwn(self._formRef, key)
        },
        getFormValue(key: string) {
          const [form] = self.getFormRef(key)
          return form.getFieldsValue()
        },
        getFormRule(key: string) {
          return self._formRule[key]
        },
        getInitAction(group: string) {
          if (group === "*") {
            return self._initAction
          }
          const groupActions = self._initAction.filter((action: any) => {
            return action.group === group
          })
          return groupActions.length > 0 ? groupActions : []
        },
      }
    })
    .actions((self) => {
      return {
        setValue(key: string, value: any) {
          self[key] = value
        },
        setFormRule(key: string, value: any) {
          self._formRule = { ...self._formRule, [key]: value }
        },
        updateValues(value) {
          for (const key in value) {
            self[key] = value[key]
          }
        },
        setFormRef(key: string, value: any) {
          self._formRef = { ...self._formRef, [key]: value }
        },
        setInitAction(action: any) {
          self._initAction = [...action]
        },
      }
    })
  return store.create(initStore)
}

export default function RenderChild(props: any) {
  // 获取schema
  const {  store, rootStore,storeName, initStore,initStoreType, ...rest } = props
  // 获取渲染类型
  // let { storeName, initStore, ...rest } = schema
  let tag = props["tag"]
  let initAction = props["initAction"]
  let localStore = null
  let children = props["children"]
  // _target 是一个特殊属性，用于行数据显示，比如listview循环一个列表，_target 是列表的子项item
  let target = props["_target"]
  // 命名空间
  let namespace=props["namespace"]

  // 获取store,如果组件有store,就用组件的，否则用上层传递的
  // todo 这里看如何改造成层级取，可能也不需要层级取？，将要打数据层级传递还是？
  if (initStore) {
    localStore = genStore(initStore,initStoreType)

    // 如果存在storeName 则在rootStore,中保存,由于不能直接设置localStore ，所以外面包了一个数组
    if (storeName) {
      const newStoreName=getStoreName(storeName,namespace)
      setTimeout(()=>{
        rootStore.setStore(newStoreName, [localStore])
      },0)

    }

  } else if (hasStore(tag)) {
    localStore = getStore(tag).create({})
  } else {
    // 传递store 的引用
    localStore = store
  }

  // 初始化store
  if (initAction) {
    localStore.setInitAction(initAction)
    handlerActions(initAction,localStore,rootStore,App,null,true,namespace)
  }
  //将子模块渲染处理放在这里，处理layout-fit 多次渲染的问题
  if (hasInitPlugin(tag)) {
    const initPlugin = getInitPlugin(tag)
    initPlugin(rest, localStore, rootStore,target)
  }
  // 如果没有类型，就是一个叶子元素
  // 获取子节点
  // 忽略render children 用于layout-fit 自定义render children
  // 主要用于插入useForm ,以便全局能拿到form
  if (children && !isIgnoreRenderChildrenNode(tag) && Array.isArray(children)) {
    // 传递target 属性
    // children = renderChildren(children, localStore, rootStore,target)
    const pass=getPassVar(props)
    const config={
      children:children,
      store:localStore,
      rootStore:rootStore,
      _target:target,
      ...pass
    }
    // 不能用标签，form 表单input值value更新了,
    // 导致上层RenderChildren重新渲染，
    // 导致input 重新渲染了，然后就input失去焦点
    children= RenderChildren(config)
    // children =(
    //     // <RenderChildren
    //     //     children={children}
    //     //     store={localStore}
    //     //     rootStore={rootStore}
    //     //     _target={target}
    //     //     {...pass}
    //     // >
    //     // </RenderChildren>
    // )
  }

  if (hasRegister(tag)) {
    // 如果是自定义组件
    tag = getRegister(tag)
  } else {
    // rest = props
    tag = getRegister("default")
  }
  let Tag = tag
  let key = uuid()

  // if (rest["refName"]){
  //   rest["ref"]=localStore.getFormRef(rest["refName"])
  // }

  // 处理显示隐藏
  return (
    <Tag key={key} store={localStore} rootStore={rootStore} {...rest} _target={target} namespace={namespace}>
      {children}
    </Tag>
  )
}
