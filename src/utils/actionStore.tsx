export default function getActionStore(
  action: object,
  store: any,
  rootStore: any,
): any {
  const { targetStore } = action
  let targetStoreObj = store
  if (targetStore) {
    // 如果有目标store,则更新目标store用于左右布局
    const targetStoreObjTmp = rootStore.getStore(targetStore)
    const storeObj = targetStoreObjTmp[0]

    targetStoreObj = storeObj
  }
  return targetStoreObj
}
