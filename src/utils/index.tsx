
import { Api, ApiObject, ApiString, PlainObject } from "../types/api"
import transferProp from "./transferProp";
import ScopedRender from "./scopedRender";
import clone from "./clone";
import varValue from "./varValue";
import {getResult} from "./result";
import type {result} from "../types/result"
export function projectName(name: string) {
  return {
    className: `co-ui-${name}`,
  }
}

export function isApiString(api: Api): boolean {
  return typeof api === "string"
}

export function getUrlParam(url: string): PlainObject {
  let params = {}
  let urls = url.split("?")
  if (urls[1]) {
    let arr = urls[1].split("&")
    for (var i = 0, l = arr.length; i < l; i++) {
      var a = arr[i].split("=")
      params[a[0]] = a[1]
    }
    return params
  } else {
    return {}
  }
}
export function toApiObj(api: Api): ApiObject {
  if (isApiString(api)) {
    let tmp = api as ApiString
    let arr = tmp.split(":")
    let url = ""
    let method = "get"
    if (arr.length > 1) {
      url = arr[1]
      method = arr[0]
    }
    let data = getUrlParam(url)
    return {
      url,
      method,
      data,
    } as ApiObject
  }
  return api as ApiObject
}
export function getConfig(props: any, store: any, rootStore?: any,_target?:any,_level?:0,): any {
  // let config= { schema: props, store: store, rootStore: rootStore,_target: _target,_level: _level ,_index: _index}
  let config={...props,store: store, rootStore: rootStore,_target: _target,_level: _level}
  return config
}
export default {
  transferProp,
  ScopedRender,
  clone,
  getResult,

}
export {
  transferProp,
  ScopedRender,
  clone,
  getResult,

}
export type{
  result
}

