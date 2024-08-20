import handlerAction from "./handlerAction"
import { App } from "antd"
import varValue from "./varValue"

/**
 * 批量处理动作
 * @param actions
 * @param store
 * @param useApp
 */
export default async function handlerActions(
  actions: any[],
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
) {
  for (let i = 0; i < actions.length; i++) {
    let { enable, useStore, ...rest } = actions[i]
    if (enable) {
      const enableValue = varValue(enable, store, target)
      if (!enableValue) {
        continue
      }
    }
    // 为了处理可能用store 又可能用传来变量，加个标志
    // 如果指定useStore ，则target 设置 null 即可，就会用store的变量
    const result = await handlerAction(
      rest,
      store,
      rootStore,
      useApp,
      useStore ? null : target,
    )
    if (!result.success) {
      break
    }
  }
}
