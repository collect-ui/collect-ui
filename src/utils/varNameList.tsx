import hasVar from "./hasVar"
const reg_g = /\$\{(.+?)\}/g
const reg = /\$\{(.+?)\}/

export default function (name: string): string[] {
  const nameList = []
  if (hasVar(name)) {
    const arr = name.match(reg_g)
    if(!arr){
      return nameList
    }
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      let storeVarArr = item.match(reg)
      let storeVar = null
      // 如果匹配上了变量
      if (storeVarArr) {
        storeVar = storeVarArr[1]
        if (storeVar.indexOf(".") > 0) {
          nameList.push(...storeVar.split("."))
        } else {
          nameList.push(storeVar)
        }
      }
    }
  }
  return nameList
}
