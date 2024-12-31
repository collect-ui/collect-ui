import varNameList from "./varNameList"
import expression_name from "./expression_name"
import hasVar from "./hasVar"
import isArray from "./isArray"
import isExpression from "./isExpression"
import convertStringToFunction from "./convertStringToFunction"
import getVariablesFromExpression from "../utils/getVariablesFromExpression"
import {getFilter, getFilterNames} from "../index"

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
  if(!name){
    return false
  }
  return name.indexOf("[") >= 0 && name.indexOf("]") > 0 && !(name.indexOf("?")>=0 || name.indexOf(":")>=0)
}
export default function (name: string, store: any, targetValue?: any): any {
  // store 和目标对象都没有，直接返回
  if (!store ) {
    console.error("没有传store 过来，请检查代码")
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
  const filterNames=getFilterNames()
  // 处理行自定义渲染
  if (targetValue) {
    let expression = expression_name(name)
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
    let hasFilter=false
    for(let i=0;i<vars.length;i++){
      const varName = vars[i]

      if(filterNames.indexOf(varName)>=0){
        // 填充函数
        p[varName]=getFilter(varName)
        hasFilter=true
      }else if(targetKeys.indexOf(varName)<0 && store.getValue){
        // 如果targetValue没有varName 字段，才从store 里面取
        // 这里体现了优先从targetValue 取，然后从store 里面取
        const storeValue = store.getValue(varName)
        if(storeValue!=undefined){
          p[varName] = storeValue
        }
      }
    }
    if(hasFilter){
      const regexPattern = filterNames.map(name => `${name}\\([^)]*\\)`).join("|");
      const regex = new RegExp(`(${regexPattern})`, "g");
      // 使用正则表达式替换字符串
      expression = expression.replace(regex, (match) => {
        // 检查是否有参数
        if (match.includes('()')) {
          return match; // 如果没有参数，不添加 store
        }
        // 在匹配到的函数调用后面添加 store 参数
        return match.replace(/(\))/, `, store$1`);
      });
      if(expression.indexOf('store')>=0){
        p['store']=store;
      }

    }
    return convertStringToFunction(expression, p)
  }
  const [firstName, secondName,thirdName] = varNameList(name)
  if(!store.getValue){
    return "未获取到store！！！不能获取变量："+firstName
  }
  let value = store.getValue(firstName)
  // 如果是单一的数组变量
  if (isArrayVar(firstName)) {
    // 取数组名称
    const arrName = firstName.split("[")[0]
    // 取坐标
    const numName = firstName.split("[")[1].split("]")[0]

    if(arrName && numName){
      // 先尝试转成int
      let  index = parseInt(numName)
      // 默认处理list[0]
      // 判断index是否为store名称,stage_list[stage_index]
      if (isNaN(index)){
        index = store.getValue(numName)
      }
      value = store.getValue(arrName)[index]
    }

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
  let hasFilter=false
  if (isExpression(name)) {
    let expression = expression_name(name)
    // 获取表达式里面有哪些变量
    let vars = []
    try {
      // 忽略变量对象
      const ignore=["JSON","stringify","parseInt"]
      vars = getVariablesFromExpression(expression).filter(item=>ignore.indexOf(item)<0)
    } catch (e) {
      return value
    }
    const params = {}


    vars.forEach((varKey) => {
      // 处理表达式的函数
      // todo 这里搞成自动注册的，主要只利用store,返回一个函数
      if(filterNames.indexOf(varKey)>=0){
        params[varKey]=getFilter(varKey)
        hasFilter=true
      }else{
        params[varKey] = store.getValue(varKey)
      }
    })


// 动态生成正则表达式,都拼接一个store 变量
    if(hasFilter){
      const regexPattern = filterNames.map(name => `${name}\\([^)]*\\)`).join("|");
      const regex = new RegExp(`(${regexPattern})`, "g");
      // 使用正则表达式替换字符串
      expression = expression.replace(regex, (match) => {
        // 检查是否有参数
        if (match.includes('()')) {
          return match; // 如果没有参数，不添加 store
        }
        // 在匹配到的函数调用后面添加 store 参数
        return match.replace(/(\))/, `, store$1`);
      });
    }

    value = convertStringToFunction(expression, { ...params,store:store })
  }
  return value
}
