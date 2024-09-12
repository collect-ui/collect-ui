import { result } from "../types/result"
import { getResult } from "../utils/result"
import { App } from "antd"
import varValue from "../utils/varValue"
import expression_name from "../utils/expression_name";
import getVariablesFromExpression from "../utils/getVariablesFromExpression";

/**
 *  数组里面添加数据
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
  const { method } = action


    //示例${panelList[0].addChildren(value)}
    const expression = expression_name(method)
    // 获取表达式里面有哪些变量
    let vars = []
    try {
      vars = getVariablesFromExpression(expression)
    } catch (e) {
     console.error(e)
    }
    let targetRow = {

    }
    if(target){
      targetRow=target
    }else{
      vars.forEach(key=>{
        if(store[key]!=undefined){
          targetRow[key]=store[key]
        }
      })
    }

    varValue(method,store,targetRow)

  return getResult(true)
}
