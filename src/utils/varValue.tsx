import varNameList from "./varNameList"
import expression_name from "./expression_name"
import * as espree from "espree"
import hasVar from "./hasVar"
import isArray from "./isArray"
import isExpression from "./isExpression"
import convertStringToFunction from "./convertStringToFunction"
import getVariablesFromExpression from "../utils/getVariablesFromExpression"
import { getSnapshot } from 'mobx-state-tree';
import { v4 as uuid } from "uuid"
const reg_g = /\$\{(.+?)\}/g
const reg = /\$\{(.+?)\}/

// function getVariablesFromExpression(expression) {
//   const ast = espree.parse(expression, { ecmaVersion: 2020 })
//   const variables = new Set()
//
//   function traverse(node) {
//     if (node.type === "VariableDeclaration") {
//       node.declarations.forEach((declaration) => {
//         if (declaration.id.type === "Identifier") {
//           variables.add(declaration.id.name)
//         }
//       })
//     } else if (node.type === "FunctionDeclaration") {
//       if (node.id && node.id.type === "Identifier") {
//         variables.add(node.id.name)
//       }
//     } else if (node.type === "Identifier") {
//       variables.add(node.name)
//     }
//
//     for (let key in node) {
//       if (node[key] && typeof node[key] === "object") {
//         traverse(node[key])
//       }
//     }
//   }
//
//   // 只遍历顶级作用域
//   ast.body.forEach(traverse)
//
//   return Array.from(variables)
// }

function isArrayVar(name: string): boolean {
  return name.indexOf("[") >= 0 && name.indexOf("]") > 0 && !(name.indexOf("?")>=0 || name.indexOf(":")>=0)
}
export default function (name: string, store: any, targetValue?: any): any {
  if (!store) {
    return name
  }
  // 如果不是字符串类型直接返回
  if (typeof name !== "string") {
    return name
  }
  // 如果不是变量类型，直接返回
  if (!hasVar(name)) {
    return name
  }
  // 处理行自定义渲染
  if (targetValue) {
    const expression = expression_name(name)
    // 获取表达式里面有哪些变量
    let vars = []
    try {
      vars = getVariablesFromExpression(expression)
    } catch (e) {
      return value
    }
    let p = {...targetValue }
    // 如果target 里面没有这变量，就重store 里面取
    // {
    //   "event_id":"${row.event_id}",
    //   "server_ip":"${selection[0].server_ip}",
    //   "port":"${selection[0].port}"
    // }
    // 比如server_ip 中selection[0] 就是从store 里面取
    // row.event_id 是行数据，从target 里面取
    const targetKeys = Object.keys(targetValue)
    for(let i=0;i<vars.length;i++){
      const varName = vars[i]
      // 如果targetValue没有varName 字段，才从store 里面取
      // 这里体现了优先从targetValue 取，然后从store 里面取
      if(targetKeys.indexOf(varName)<0){
        const storeValue = store.getValue(varName)
        if(storeValue){
          p[varName] = storeValue
        }
      }
    }
    const value = convertStringToFunction(expression, p)
    return value
  }
  const [firstName, secondName,thirdName] = varNameList(name)
  let value = store.getValue(firstName)
  // 如果是单一的数组变量
  if (isArrayVar(firstName)) {
    // 取数组名称
    const arrName = firstName.split("[")[0]
    // 取坐标
    const index = parseInt(firstName.split("[")[1].split("]")[0])
    value = store.getValue(arrName)[index]
  }
  // 如果是二级变量
  if (secondName && value) {
    value = value[secondName]
  }
  // 如果是三级变量
  if(thirdName && value){
    value = value[thirdName]
  }


  // 如是表单或者数组，必须从store 里面取toJSON
  if (value && typeof value == "object" && value.toJSON) {
    value = value.toJSON()
  }
  // 处理selection[0] 不能修改
  if (value && typeof value == "object" && !isArray(value)) {
    value = { ...value }
  }
  // 如果复杂的表达式
  if (isExpression(name)) {
    const expression = expression_name(name)
    // 获取表达式里面有哪些变量
    let vars = []
    try {
      vars = getVariablesFromExpression(expression)
    } catch (e) {
      return value
    }
    const params = {}

    vars.forEach((varKey) => {
      // 处理表达式的函数
      // todo 这里搞成自动注册的，主要只利用store,返回一个函数
      if (varKey === "getFormValue") {
        params[varKey] = (formName, fieldName) => {
          const [form] = store.getFormRef(formName)
          const varValue = form.getFieldValue(fieldName)
          return varValue
        }
      } else if (varKey === "uuid") {
        params[varKey] = () => {
          return uuid()
        }
      } else {
        params[varKey] = store.getValue(varKey)
      }
    })
    value = convertStringToFunction(expression, { ...params })
  }
  return value
}
