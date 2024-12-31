import {getErrorResult, getResult} from "../utils/result"
import { App, Modal } from "antd"
import varValue from "../utils/varValue"

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
  let { title, content, showCancelMsg } = action
  title = varValue(title, store, target)
  content = varValue(content, store, target)


  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: title,
      content: content,
      onOk() {
        resolve(getResult(true))
      },
      onCancel() {
        resolve(getErrorResult("取消操作", !!showCancelMsg))
      },
    })
  })
}
