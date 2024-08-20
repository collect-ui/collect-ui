import renderChildren from "../components/render/render-children"
import handlerChildrenForm from "../utils/handlerChildrenForm"
export default function init(props: any, store: any, rootStore: any) {
  console.log("layout-init", props)
  // 将子模块渲染处理放在这里，处理layout-fit组件中多次渲染的问题
  // 这里只会处理一次
  // 处理子节点的表单引用，主要将form的引用存起来
  if (props.children) {
    handlerChildrenForm(props.children, store)
    props.childrenRender = renderChildren(props.children, store, rootStore)
  }
  // 设置顶部右侧
  if (props.topRight) {
    props.topRightRender = renderChildren(props.topRight, store, rootStore)
  }
  // 设置底部
  if (props.bottomToolBar) {
    props.bottomToolBarRender = renderChildren(
      props.bottomToolBar,
      store,
      rootStore,
    )
  }
  if (props.searchToolBar) {
    // 将搜索表单的引用存起来
    handlerChildrenForm(props.searchToolBar, store)
    props.searchToolBarRender = renderChildren(
      props.searchToolBar,
      store,
      rootStore,
    )
  }
  if (props.searchBarRight) {
    props.searchBarRightRender = renderChildren(
      props.searchBarRight,
      store,
      rootStore,
    )
  }
}
