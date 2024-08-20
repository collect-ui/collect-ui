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
  const { formName, saveField } = action
  // 获取表单
  const [form] = store.getFormRef(formName)
  // 提交
  form.submit()
  // 由于submit 是异步的，
  // 提交后getFieldsError 不能获取数据。
  // 所以sleep 1毫秒，等form 表单校验完成
  await sleep(1)
  // 获取表单错误信息
  const errors = form.getFieldsError()
  const hasError = errors.filter((item) => item.errors.length > 0)
  if (hasError.length > 0) {
    return getErrorResult("表单验证失败", false)
  }
  // 更新表单
  // 获取表单规则
  const formValue = form.getFieldsValue()
  const rules = store.getFormRule(formName)

  if (rules) {
    for (const field in rules) {
      const rule = rules[field]
      // 生成规则字典
      let ruleDict = {}
      rule.forEach((ruleItem) => {
        ruleDict[ruleItem["to"]] = ruleItem["from"]
      })
      let value = formValue[field]
      // 将值还原
      formValue[field] = ruleDict[value] || value
    }
  }
  if (saveField) {
    store.setValue(saveField, formValue)
  }

  return getResult(true, formValue)
}
