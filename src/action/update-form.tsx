import { result } from "../types/result"
import { getResult } from "../utils/result"
import varValue from "../utils/varValue"
import { App } from "antd"

/**
 * 更新表单
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
  const { formName, value } = action
  let formValue = {}

  if (typeof value === "string") {
    // 如果是字符串
    formValue = varValue(value, store, target)
  } else {
    // 如果是对象
    for (const key in value) {
      const valueData = varValue(value[key], store, target)
      formValue[key] = valueData
    }
  }

  const [form] = store.getFormRef(formName)
  form.setFieldsValue(formValue)
  return getResult(true)
}
