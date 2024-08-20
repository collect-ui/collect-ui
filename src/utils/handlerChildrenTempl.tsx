// 提前把变量给处理掉，让后在进行渲染
import isArray from "./isArray"
import isExpression from "./isExpression"
import convertStringToFunction from "./convertStringToFunction"
import expression_name from "./expression_name"
import hasVar from "./hasVar";

export default function handlerChildrenTempl(templCpy, params) {
  // 如果是数组
  if (isArray(templCpy)) {
    for (let i = 0; i < templCpy.length; i++) {
      const child = templCpy[i]
      templCpy[i] = handlerChildrenTempl(child, params)
    }
    return templCpy
  }
  // 如果是字符串
  if (typeof templCpy === "string") {
    if (isExpression(templCpy)) {
      templCpy = convertStringToFunction(expression_name(templCpy), {
        ...params,
      })
    }
    return templCpy
  } else if (typeof templCpy === "object") {
    // 如果是对象
    for (let key in templCpy) {
      let templ = templCpy[key]
      // 如果是字符串处理模板
      if (typeof templ === "string" && hasVar(templ) && isExpression(templ)) {
        templCpy[key] = convertStringToFunction(expression_name(templ), {
          ...params,
        })
      }
      // 递归处理
      if (templCpy.children) {
        templCpy.children = handlerChildrenTempl(templCpy.children, params)
      }
    }
  }

  return templCpy
}
