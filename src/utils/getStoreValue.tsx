export default function (name: string, store: any) {
  if (!store) {
    return
  }
  const storeVar = name.replace("store.", "")
  if (storeVar.indexOf(".") > 0) {
    // 取2级
    let arr = storeVar.split(".")
    const first = store.getValue(arr[0])
    if(!first) {
      return
    }
    let value= first[arr[1]]
    return value
  }

  return store.getValue(storeVar)
}
