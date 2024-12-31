import RenderChildren from "../components/render/render-children"

import getPassVar from "../utils/getPassVar";
export default function init(props: any, store: any, rootStore: any,target?: any) {
  console.log("before-layout-init", props)
  // 将子模块渲染处理放在这里，处理layout-fit组件中多次渲染的问题
  // 这里只会处理一次
  // 处理子节点的表单引用，主要将form的引用存起来
  const pass=getPassVar(props)
  if (props.actions) {
    const p = {
      ...props,
      ...pass,
      children: props.actions,
      store: store,
      rootStore: rootStore,
      _target: target||{...pass['_target_row']},
    }
    props.actionsRender = RenderChildren(p)
  }

}
