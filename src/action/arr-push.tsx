import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"
import isArray from "../utils/isArray";
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
  const { from,value } = action
  let targetStoreObj = actionStore(action, store, rootStore)
  const newObj=handlerVarValue(value, store, target)
  const old = targetStoreObj.getValue(from)
  targetStoreObj.setValue(from,[...old,newObj])
  return getResult(true)
}
