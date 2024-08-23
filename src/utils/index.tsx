
import { Api, ApiObject, ApiString, PlainObject } from "../types/api"
import transferProp from "./transferProp";

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
export function getConfig(props: any, store: any, rootStore?: any): any {
  return { schema: props, store: store, rootStore: rootStore }
}
export default {
  transferProp
}
export {
  transferProp
}

