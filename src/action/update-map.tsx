import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"
import varName from "../utils/varName"
import { v4 as uuid } from "uuid"
import deepClone from "../utils/clone"
import varnameList from "../utils/varNameList"
/**
 * 更新store
 * 数组中添加一个子项，item
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
  namespace?:string
): Promise<result> {
  const { from, value } = action
  const tmp = deepClone(value)
  let targetStoreObj = actionStore(action, store, rootStore,namespace)
  const [first, second] = varnameList(from)
  const map = targetStoreObj.getValue(first)

  const l = []
  tmp.forEach(({ enable, ...item }) => {
    if ((enable && varValue(enable, targetStoreObj)) || !enable) {
      for (const key in item) {
        item[key] = varValue(item[key], targetStoreObj)
      }
      l.push(item)
    }
  })
  const newKey = targetStoreObj.getValue(second)
  targetStoreObj.setValue(first, { ...map, [newKey]: l })
  return getResult(true)
}
