import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"
import isArray from "../utils/isArray";
import {applySnapshot} from "mobx-state-tree";
import expression_name from "../utils/expression_name";
import getVariablesFromExpression from "../utils/getVariablesFromExpression";
function handlerVarValue(value,store,target){
  let newObj = {}

  for (let key in value) {
    const content = value[key]
    if(isArray(content)) {
      // 递归处理
      const arr = []
      for( let index in content ) {
        const subItem=content[index]
        arr.push(handlerVarValue(subItem,store,target))
      }
      newObj[key]=arr
    }else{
      // 动态取变量
      newObj[key] = varValue(content, store, target)
    }

  }
  return newObj

}
/**
 *  数组里面添加数据
 * @param api
 * @param storeData
 * @param options
 */
export default async function (
  action: object,
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
): Promise<result> {
  const { method,from,value,first } = action
  let targetStoreObj = actionStore(action, store, rootStore)
  const newObj=handlerVarValue(value, store, target)
  const fromName = varValue(from, store, target)
  const old = targetStoreObj.getValue(fromName)
  if(method){// 解决二级数组的children的节点，addChildren 方法
    //示例${panelList[0].addChildren(value)}
    const expression = expression_name(method)
    // 获取表达式里面有哪些变量
    let vars = []
    try {
      vars = getVariablesFromExpression(expression)
    } catch (e) {
      return value
    }
    const oldTarget = target||{}
    const targetRow = {
      ...oldTarget,
      value:newObj
    }
    vars.forEach(key=>{
      if(store[key]!=undefined){
        targetRow[key]=store[key]
      }
    })
    varValue(method,store,targetRow)
  }else{
    if(first){
      targetStoreObj.setValue(fromName,[newObj,...old])
    }else{
      targetStoreObj.setValue(fromName,[...old,newObj])
    }

  }

  return getResult(true)
}
