import { result } from "../types/result"
import { getErrorResult } from "./result"
import { getAction } from "../index"
import { App } from "antd"
import {useNavigate} from "react-router-dom";

/**
 * 处理action,动作，跳转地址发送请求什么的
 * @param action
 * @param storeData
 * @param useApp
 */
export default async function handlerAction(
  action: any,
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
  namespace?:string
): Promise<result> {
  const { tag, saveField } = action
  if (!tag) {
    let msg = "没有tag"
    console.error(msg)
    return getErrorResult(msg)
  }
  const actionFunc = getAction(tag)
  if (!actionFunc) {
    let msg = "没有对应处理器" + tag
    console.error(msg)
    return getErrorResult(msg)
  }
  const res = await actionFunc(action, store, rootStore, useApp,target,namespace)
  //todo 这个根据action 显示错误信息的提示形式，
  // 可以是消息提示，
  // 也可以是对话框，
  // 也可以不提示
  // 形式待定

  if (!res.success && res.showMsg !== false) {
    useApp?.message?.error(res.msg)
    // todo 这里改成注册插件模式
    if(res.msg=="请登录！！！"){
      window.location.href = "/#/login"
    }
  }
  if (saveField) {
    store.setValue(saveField, res)
  }
  return res
}
