import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"

/**
 * 更新store
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
  const { value } = action
  let targetStoreObj = actionStore(action, store, rootStore)
  let targetObj: any
  let newObj = {}
  for (let key in value) {
    // 动态取变量
    newObj[key] = varValue(value[key], store, target)
  }
  targetObj = newObj
  targetStoreObj.updateValues(targetObj)
  return getResult(true)
}
