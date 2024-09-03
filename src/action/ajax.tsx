import { Api, ApiObject } from "../types/api.js"
import axios from "axios"
import { toApiObj } from "../utils"
import type { result } from "../types/result"
import varName from "../utils/varName"
import varValue from "../utils/varValue"
import hasVar from "../utils/hasVar"
import { App } from "antd"
/**
 * 发送http请求
 * @param api
 * @param storeData
 */
export default async function (
  action: object,
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
): Promise<result> {
  let { api, data, appendFields, appendFormFields, adapt, showResultMsg } =
    action
  // 支持三元表达式
  if (api && hasVar(api)) {
    api = varValue(api, store)
  }

  const apiObj: ApiObject = toApiObj(api as Api)
  let formValue = {}
  // 如果有appendFields 则拼接appendFields 里面的字段，否则拼接所有字段
  if (appendFields) {
    const fieldsName = varName(appendFields)
    const fields = store.getValue(fieldsName)
    for (let key in fields) {
      formValue[key] = fields[key]
    }
  }
  // 拼接表单字段
  if (appendFormFields) {
    let tmp = store.getFormValue(appendFormFields)
    for (let key in tmp) {
      formValue[key] = tmp[key]
    }
  }
  // 平均api 的data
  if (apiObj.data) {
    for (let key in apiObj.data) {
      formValue[key] = apiObj.data[key]
    }
  }
  if (data) {
    for (let key in data) {
      const value = data[key]
      formValue[key] = varValue(value, store, target)
    }
  }

  const config = {
    method: apiObj.method,
    url:apiObj.url,
    data:formValue
  };
  //@ts-ignore
  const res = await axios.create({}).request(config)
  const { msg, success } = res.data
  if (showResultMsg && success) {
    useApp?.message?.success(msg)
  }

  // 请求成功 解析结果集合
  if (success && adapt) {
    for (const key in adapt) {
      const field = varName(adapt[key])
      store.setValue(key, res.data[field])
    }
  }


  return res.data
}
