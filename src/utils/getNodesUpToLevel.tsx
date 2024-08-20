// 获取指定层级之前的所有节点
const getNodesUpToLevel = (data, level) => {
  const result = []

  const traverse = (node, currentLevel) => {
    if (currentLevel > level) return
    result.push(node)
    if (node.children) {
      node.children.forEach((child) => traverse(child, currentLevel + 1))
    }
  }

  data.forEach((rootNode) => traverse(rootNode, 1))
  return result
}
export default getNodesUpToLevel
