import { projectName } from "./index"
import varNameList from "./varNameList"
import getStoreValue from "./getStoreValue"
import hasVar from "./hasVar"

import handlerAction from "./handlerAction"
import varValue from "./varValue";
import genTarget from "./genTarget";
import {get} from "mobx";
// 为了防止和组件冲突，将以下划线的key,替换位原始key
// 比如tag 已经被使用，可以替换成_tag
export default function transferProp(props: any, name: string, useApp?: any) {
  // const {rootStore,...rest}=props
  let tmp: any = {}
  // let _target=props._target
  // for (let key in props) {
  //   if (key.startsWith("_target_")) {
  //     if(!_target){
  //       _target={}
  //     }
  //     let newKey = key.replace("_target_","")
  //     _target[newKey]=props[key]
  //   }
  // }
  let _target = genTarget(props)
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
    if (key.startsWith("_target_")) {
      continue
    }
    let str = rest[key]
    // 正则替换${store.xxx} 这种变量
    if (hasVar(str)) {
      str = varValue(str, store,_target)
      // if (str !== rest[key]) {
      //   tmp[key] = str
      // }
      tmp[key] = str
    }else{
      tmp[key] = str
    }
  }

  const pClass = projectName(name)
  // 添加主题的样式
  if(props.theme){
    pClass["className"]+='-'+props.theme
  }
  const className = tmp["className"]
  // 如果配置className 或者class
  if (className) {
    pClass["className"] = `${pClass["className"]} ${className}`
  }
  return { store, ...tmp, ...pClass}
}
