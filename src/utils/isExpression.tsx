export default function isExpression(str: string) {
  if (typeof str !== "string") {
    return false
  }
  if (str.startsWith("${[") && str.endsWith("]}")) {
    return true
  }
  if (str.startsWith("${{") && str.endsWith("}}")) {
    return true
  }
  // 三元表达式
  if (
    str.startsWith("${") &&
    str.endsWith("}") &&
    str.indexOf("?") > 0 &&
    str.indexOf(":") > 0
  ) {
    return true
  }
  // 运行函数
  if (
    str.startsWith("${") &&
    str.endsWith("}") &&
    str.indexOf("(") > 0 &&
    str.indexOf(")") > 0
  ) {
    return true
  }
  if (
    str.startsWith("${") &&
    str.endsWith("}") &&
    str.indexOf("[") >= 0 &&
    str.endsWith("]") >= 0
  ) {
    return true
  }

  const operatorRegex =
    /[+\-*/%&|^<>!=]=?|&&|\|\||--|\+\+|<<|>>|>>>|instanceof|in|getFormValue/g
  return operatorRegex.test(str)
}
