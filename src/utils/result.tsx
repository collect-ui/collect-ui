import type { result } from "../types/result"
// action 的返回对象
export function getResult(
  success: boolean,
  msg?: string,
  data?: any,
  showMsg?: boolean | undefined,
): result {
  return {
    success,
    msg: msg,
    data: data,
    showMsg,
  } as result
}
export function getErrorResult(msg: string, showMsg?: boolean): result {
  return getResult(false, msg, null, showMsg)
}
export type{
  result
}
