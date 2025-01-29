import RenderChildren from "../components/render/render-children"
import handlerChildrenForm from "../utils/handlerChildrenForm"
import getPassVar from "../utils/getPassVar";
export default function init(props: any, store: any, rootStore: any,target?: any) {
  console.log("before-layout-init", props)
  // 将子模块渲染处理放在这里，处理layout-fit组件中多次渲染的问题
  // 这里只会处理一次
  // 处理子节点的表单引用，主要将form的引用存起来
  const pass=getPassVar(props)
  if (props.children) {
    handlerChildrenForm(props.children, store,target)
    props.childrenRender = <RenderChildren children={props.children} store={store} rootStore={rootStore} _target={target} {...pass}></RenderChildren>
  }
  // 设置顶部右侧
  if (props.topRight) {
    props.topRightRender = <RenderChildren children={props.topRight} store={store} rootStore={rootStore} _target={target} {...pass}></RenderChildren>
  }
  // 设置底部
  if (props.bottomToolBar) {
    handlerChildrenForm(props.bottomToolBar, store,target)
    props.bottomToolBarRender = <RenderChildren children={props.bottomToolBar} store={store} rootStore={rootStore} _target={target}  {...pass}></RenderChildren>
  }
  if (props.searchToolBar) {
    // 将搜索表单的引用存起来
    handlerChildrenForm(props.searchToolBar, store,target)
    props.searchToolBarRender = <RenderChildren children={props.searchToolBar} store={store} rootStore={rootStore} _target={target}  {...pass}></RenderChildren>
  }
  if (props.searchBarRight) {
    props.searchBarRightRender = <RenderChildren children={props.searchBarRight} store={store} rootStore={rootStore} _target={target}  {...pass}></RenderChildren>
  }
}
