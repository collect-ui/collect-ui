import { projectName } from "./index"
import varNameList from "./varNameList"
import getStoreValue from "./getStoreValue"
import hasVar from "./hasVar"

import handlerAction from "./handlerAction"
import varValue from "./varValue";

// 为了防止和组件冲突，将以下划线的key,替换位原始key
// 比如tag 已经被使用，可以替换成_tag
export default function transferProp(props: any, name: string, useApp?: any) {
  // const {rootStore,...rest}=props
  let tmp: any = {}
  for (let key in props) {
    if (key.startsWith("_")) {
      let newKey = key.substring(1)
      // 防止a 标签中target 被替换成行_target。导致target="_bank" 不生效
      // _target 之前用了，用成表示行数据里面item

      if(!props.hasOwnProperty(newKey)){
        tmp[newKey] = props[key]
      }

    }
  }
  // // todo 处理模板变量
  const { rootStore, store, initAction, ...rest } = props

  // 处理变量初始化

  // if (initAction && store) {
  //   for (let i = 0; i < initAction.length; i++) {
  //     let action = initAction[i]
  //     if (action.tag !== "ajax") {
  //       handlerAction(action, store, useApp)
  //     }
  //   }
  // }
  // 动态处理store和变量
  for (let key in rest) {
    let str = rest[key]
    // 正则替换${store.xxx} 这种变量
    if (hasVar(str)) {
      // const nameList = varNameList(str)
      // for (let i = 0; i < nameList.length; i++) {
      //   const varName = nameList[i]
      //   let value = getStoreValue(varName, store)
      //   //如果是全量匹配，替换，保证类型不变
      //   // todo 表达式的处理
      //   if (str === toVarName(varName)) {
      //     if (typeof value == "object") {
      //       str = value.toJSON()
      //     } else {
      //       str = value
      //     }
      //   } else {
      //     // 如果是部分匹配，只替换匹配到的部分
      //     str = str.replace(varName, value)
      //   }
      // }
      str = varValue(str, store,rest._target)
      if (str !== rest[key]) {
        rest[key] = str
      }
    }
  }

  const pClass = projectName(name)
  const className = props["className"]
  // 如果配置className 或者class
  if (className) {
    pClass["className"] = `${pClass["className"]} ${className}`
  }
  return { store,...rest, ...tmp, ...pClass }
}
