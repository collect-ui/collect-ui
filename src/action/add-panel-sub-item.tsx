import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"
import varName from "../utils/varName"
import { v4 as uuid } from "uuid"
import deepClone from "../utils/clone"
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
): Promise<result> {
  const { bind, subValue } = action

  let targetStoreObj = actionStore(action, store, rootStore)

  const tmp2 = deepClone(subValue)
  tmp2.forEach((item) => {
    for (const key in item) {
      item[key] = varValue(item[key], targetStoreObj)
    }
  })

  const bindName = varName(bind)
  const panelKeyValue = targetStoreObj.getValue(bindName)[0]
  const subMap = targetStoreObj.getValue("subMap")
  const before = subMap[panelKeyValue]
  const l = { [panelKeyValue]: [...before, ...tmp2] }

  targetStoreObj.setValue("subMap", { ...subMap, ...l })

  return getResult(true)
}
