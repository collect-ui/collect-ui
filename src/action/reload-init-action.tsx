import { result } from "../types/result"
import { getResult } from "../utils/result"
import handlerActions from "../utils/handlerActions"
import { App } from "antd"
import actionStore from "../utils/actionStore";

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
): Promise<result> {
  const { group } = action
  let targetStoreObj = actionStore(action, store, rootStore)
  const actions = targetStoreObj.getInitAction(group)
  handlerActions(actions, targetStoreObj, rootStore, useApp)
  return getResult(true)
}
