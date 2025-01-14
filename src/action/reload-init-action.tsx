import { result } from "../types/result"
import { getResult } from "../utils/result"
import handlerActions from "../utils/handlerActions"
import { App } from "antd"
import actionStore from "../utils/actionStore";
import varValue from "../utils/varValue";

/**
 * 重新运行initAction
 * @param api
 * @param storeData
 * @param options
 */
export default async function (
  action: object,
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target:any,
  namespace:string
): Promise<result> {
  let { group } = action
  let targetStoreObj = actionStore(action, store, rootStore,namespace)
  group = varValue(group,targetStoreObj)
  const actions = targetStoreObj.getInitAction(group)
  const res =  await handlerActions(actions, targetStoreObj, rootStore, useApp,{},false,namespace)
  //@ts-ignore
  res.showMsg=false
  return res
  // return getResult(true)
}
