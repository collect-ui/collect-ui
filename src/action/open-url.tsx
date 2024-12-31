import type { result } from "../types/result"
import { getResult,getErrorResult } from "../utils/result"
import {App} from "antd";
import varValue from "../utils/varValue";

export default async function (
    action: object,
    store: any,
    rootStore: any,
    useApp: App.useApp,
    target?: any,
): Promise<result> {
    const {url,windowName,windowFeatures,data} = action
    if (!url){
        return getErrorResult("url不能为空")
    }
    const queryParam={}
    if (data) {
        for (let key in data) {
            const value = data[key]
            queryParam[key] = varValue(value, store, target)
        }
    }

    const queryStr = new URLSearchParams(queryParam).toString();
    const newUrl = url.indexOf("?")<0?url+"?"+queryStr:url+"&"+queryStr
    window.open(newUrl,windowName,windowFeatures)
    return getResult(true)
}
