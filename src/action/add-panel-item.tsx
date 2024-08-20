import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import actionStore from "../utils/actionStore"
import varName from "../utils/varName"
import { v4 as uuid } from "uuid"
import deepClone from "../utils/clone"

/**
 * 更新store
 * 数组中添加一个子项，item
 * @param action - 操作对象
 * @param store - 当前store
 * @param rootStore - 根store
 * @param useApp - Ant Design的useApp hook
 * @param target - 目标对象（可选）
 */
export default async function updateStore(
  action: object,
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
): Promise<result> {
  // 从action中解构出需要的属性
  const { from, bind, panelKey, subValue, subPanelBind, value } = action
  // 深拷贝value，避免修改原始数据
  const tmp = deepClone(value)
  // 获取目标store对象
  const targetStoreObj = actionStore(action, store, rootStore)
  // 获取from属性的变量名
  const fromVal = varName(from)

  // 获取panelKey的值
  const panelKeyValue = varValue(panelKey, targetStoreObj)
  // 处理subValue，替换变量值
  const processedSubValue = processSubValue(subValue, targetStoreObj)
  // 创建新的subMap对象
  const subMapNew = { [panelKeyValue]: processedSubValue }

  // 获取subPanelBind的变量名,将所有的对象都保存在一个map中，方便管理与查看
  const subPanelName = varName(subPanelBind)
  // 获取旧的subPanel值
  const old = targetStoreObj.getValue(subPanelName)
  // 更新subPanel值
  targetStoreObj.setValue(subPanelName, { ...old, ...subMapNew })
  // 处理items，替换变量值并生成新的子项
  const processedItems = processItems(
    tmp,
    targetStoreObj,
    `${subPanelName}.` + panelKeyValue,
  )
  // 获取bind属性的变量名
  const bindName = varName(bind)

  // 更新bind属性的值，添加新的panelKeyValue
  targetStoreObj.setValue(bindName, [
    ...targetStoreObj.getValue(bindName),
    panelKeyValue,
  ])

  // 获取fromVal的值
  const arr = targetStoreObj.getValue(fromVal)
  // 更新fromVal的值，添加新的processedItems
  targetStoreObj.setValue(fromVal, [...arr, ...processedItems])

  // 返回操作结果
  return getResult(true)
}

/**
 * 处理subValue，替换变量值
 * @param subValue - 子值数组
 * @param targetStoreObj - 目标store对象
 * @returns 处理后的子值数组
 */
function processSubValue(subValue: any, targetStoreObj: any): any[] {
  const tmp2 = deepClone(subValue)
  return tmp2.map((item) => {
    for (const key in item) {
      item[key] = varValue(item[key], targetStoreObj)
    }
    return item
  })
}

/**
 * 处理items，替换变量值并生成新的子项
 * @param items - 项数组
 * @param targetStoreObj - 目标store对象
 * @param panelKeyValue - panelKey的值
 * @returns 处理后的项数组
 */
function processItems(
  items: any[],
  targetStoreObj: any,
  panelKeyValue: string,
): any[] {
  return items.filter(({ enable, ...item }) => {
    if ((enable && varValue(enable, targetStoreObj)) || !enable) {
      for (const key in item) {
        item[key] = varValue(item[key], targetStoreObj)
      }
      item?.children?.forEach((child) => {
        if (typeof child === "object") {
          child["key"] = uuid()
          child?.children.forEach((subChild) => {
            subChild["key"] = uuid()
            subChild.panelKey = panelKeyValue
            subChild.itemData = "${" + panelKeyValue + "}"
          })
        }
      })
      return true
    }
    return false
  })
}
