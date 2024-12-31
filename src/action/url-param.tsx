import {Api, fetchOptions, ApiObject} from "../types/api.js"
import type {result} from "../types/result"
import {getResult} from "../utils/result"
import {App} from "antd";
import varValue from "../utils/varValue";
import varName from "../utils/varName";

export default async function (
    action: object,
    store: any,
    rootStore: any,
    useApp: App.useApp,
): Promise<result> {
    let {adapt} = action
    const arr = window.location.href.split("?")
    if(arr.length<2){
        return getResult(true)  // 无参数直接返回
    }
    const  queryString = arr[1];
    // 创建一个对象来存储查询参数
    const params = new URLSearchParams(queryString);
    // 将查询参数转换为对象
    const queryParams = {};
    for (const [key, value] of params) {
        queryParams[key] = value;
    }
    if (adapt) {
        for (const key in adapt) {
            const resultField = adapt[key]
            const field = varName(resultField)
            store.setValue(key, queryParams[field])
        }
    }
    return getResult(true)
}
