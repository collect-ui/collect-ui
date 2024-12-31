import type { result } from "../types/result"
import { getResult } from "../utils/result"
import {App} from "antd";

export default async function (
  action: object,
  store: any,
  rootStore: any,
  useApp: App.useApp,
): Promise<result> {
  let url: string = action["url"]
  //todo 这里处理参数
  window.location.href = url
  return getResult(true)
}
