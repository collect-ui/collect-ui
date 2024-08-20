import { result } from "../types/result"
import { getErrorResult, getResult } from "../utils/result"
import sleep from "../utils/sleep"
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
  const { formName } = action
  // 获取表单
  const [form] = store.getFormRef(formName)
  // 重置表单
  form.resetFields()

  return getResult(true)
}
