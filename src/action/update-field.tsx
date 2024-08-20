import { result } from "../types/result"
import { getResult } from "../utils/result"
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
): Promise<result> {
  const { value } = action
  store.setValue("dataList", store.pageData.data)
  return getResult(true)
}
