import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"
import isArray from "../utils/isArray";

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
): Promise<result> {
  const { value } = action
  let targetStoreObj = actionStore(action, store, rootStore)
  let targetObj: any
  let newObj = {}
  for (let key in value) {
    // 名称也可能是动态的
    const keyName=varValue(key,store,target)
    const keyValue = value[key]
    if(isArray(keyValue)){
      // 取二级
      const l = []

      for(const index in keyValue){// 挨个取对象
        //生成一个新对象
        const newSubObj = {}
        const subVar=keyValue[index]
        for(const subKey in subVar){// 字段依次转换
          const subKeyName=varValue(subKey,store,target)
          //将值转换
          const subValue = subVar[subKey]
          newSubObj[subKeyName] = varValue(subValue, store, target)
        }
        // 添加新对象
        l.push(newSubObj)
      }
      newObj[keyName]=l
    }else{
      // 值动态取变量
      newObj[keyName] = varValue(value[key], store, target)
    }


  }
  targetObj = newObj
  targetStoreObj.updateValues(targetObj)
  return getResult(true)
}
