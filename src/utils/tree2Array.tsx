/**
 * 树转列表
 */
export default function treeToArray(
  nodes: any[],
  childName = "children",
  subField?: string,
): any[] {
  let r = []
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      let node = nodes[i]
      r.push(node) // 取每项数据放入一个新数组
      let children = null
      if (!subField) {
        children = node[childName]
      } else {
        children = node[subField][childName]
      }
      if (Array.isArray(children) && children.length > 0)
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(treeToArray(children, childName, subField))
    }
  }
  return r
}
