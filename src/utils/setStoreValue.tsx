export default function (name: string, value: any, store: any) {
  const storeVar = name.replace("store.", "")
  return store.setValue(storeVar, value)
}
