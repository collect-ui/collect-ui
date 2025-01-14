import { Api, ApiObject } from "../types/api.js"
import axios from "axios"
import {getResult, toApiObj} from "../utils"
import type { result } from "../types/result"
import varName from "../utils/varName"
import varValue from "../utils/varValue"
import hasVar from "../utils/hasVar"
import handlerAction from "../utils/handlerAction"
import { App } from "antd"
function convertRes2Blob(response: any) {
  // 提取文件名
  let desc = response.headers.get("content-disposition")
  let fileName = desc.match(
      /filename=(.*)/
  )[1]
  // 处理文件名中文乱码
  if (fileName.startsWith("'") && fileName.endsWith("'")) {
    fileName = fileName.slice(1, -1);
  }
  if (fileName.includes('utf-8')) {
    fileName = decodeURIComponent(fileName.split('utf-8\'')[1]);
  } else {
    fileName = decodeURIComponent(fileName);
  }
  // 创建一个下载链接
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const link = document.createElement('a');

  //@ts-ignore
  link.href = window?.URL.createObjectURL(blob);
  link.download = fileName; // 设置下载文件的名称
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}
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
  let { download,downloadingPercent,start,end,api, data, appendFields, appendFormFields, adapt, showResultMsg } =
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
    data:formValue,
  };
  if(download){
    //@ts-ignore
    config.responseType = 'blob'  // 接收blob 类型数据
    //@ts-ignore
    config.onDownloadProgress= (progressEvent) => {
      // 计算下载进度
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Download progress: ${percentCompleted}%`);
      if(downloadingPercent){// 设置进度字段
        const fieldName = varName(downloadingPercent)
        store.setValue(fieldName,percentCompleted)
      }
      // 在这里更新 UI 显示进度
    }
  }
 // 执行前触发一些动作
  // 比如设置请求loading开始
  if(start){
    const startConfig={
      tag:"update-store",
      value:start
    }
    handlerAction(startConfig,store,rootStore,useApp,target)
  }
  //@ts-ignore
  const res = await axios.create({}).request(config)
  // 执行后触发一些动作
  // 比如设置请求loading结束
  if(end){
    const endConfig={
      tag:"update-store",
      value:end
    }
    handlerAction(endConfig,store,rootStore,useApp,target)
  }
  if(download){
    convertRes2Blob(res)
    return   getResult(true)
  }
  const { msg, success } = res.data
  if (showResultMsg && success) {
    useApp?.message?.success(msg)
  }

  // 请求成功 解析结果集合
  if (success && adapt) {
    for (const key in adapt) {
      const resultField = adapt[key]
      if(resultField.indexOf(".")>0){// 多级地址
        store.setValue(key,varValue(resultField, store, res.data))
      }else{
        const field = varName(resultField)
        store.setValue(key, res.data[field])
      }


    }
  }


  return res.data
}
