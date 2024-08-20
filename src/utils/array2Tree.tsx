/**
 * 列表转树
 * @param arr
 * @param id
 * @param pid
 * @param child
 * @returns {*[]}
 */
export default function arrayToTree(
  arr: any[],
  id: string,
  pid: string,
  child = "children",
): any[] {
  let r = []
  const hash = {}
  arr.forEach((json_item) => {
    hash[json_item[id]] = json_item
  })
  arr.forEach((aVal) => {
    const parent_id = aVal[pid]
    if (hash[parent_id]) {
      const hashVP = hash[parent_id]
      if (hashVP[child]) {
        const ch = hashVP[child]
        ch.push(aVal)
        hashVP[child] = ch
      } else {
        const ch = []
        ch.push(aVal)
        hashVP[child] = ch
      }
    } else {
      r.push(aVal)
    }
  })
  return r
}
