import { result } from "../types/result"
import { getErrorResult, getResult } from "../utils/result"
import varValue from "../utils/varValue"
import { App } from "antd"

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
): Promise<unknown> {
  let { check, title } = action
  title = varValue(title, store, target)
  check = varValue(check, store, target)
  if (check) {
    return getResult(true)
  } else {
    return getErrorResult(title)
  }
}
