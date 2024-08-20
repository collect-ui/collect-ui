const rules = {
  "ignore-render-children": ["layout-fit"],
}
// 忽略render children 用于layout-fit 自定义render children
// 主要用于插入useForm ,以便全局能拿到form
export function isIgnoreRenderChildrenNode(tag: string) {
  return rules["ignore-render-children"].includes(tag)
}
