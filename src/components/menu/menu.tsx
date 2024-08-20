import { Menu } from "antd"
import transferProp from "../../utils/transferProp"
import tree2Array from "../../utils/tree2Array"
import { useCallback, useEffect, useState } from "react"

import { useNavigate, useLocation } from "react-router-dom"
export default function (props: any) {
  const { rootStore, items } = props
  let newProps = transferProp(props, "menu")
  let navigate = useNavigate()
  // const rootStore = useContext(rootProvider)
  const location = useLocation()
  const [current, setCurrent] = useState("")
  // 初始化进来的时候添加当前路由
  // todo 这里考虑items 必须加载完成
  useEffect(() => {
    const tmp = tree2Array(items).find((item) => item.to === location.pathname)
    // 根据当前路径找到当前的菜单，然后添加到router tab
    if (tmp) {
      rootStore.addRouterTab({
        path: location.pathname,
        name: tmp.name,
        key: tmp.key,
      })
    } else {
      rootStore.addRouterTab({
        path: location.pathname,
        name: "未知",
        key: "unknown",
      })
    }
  }, [])
  // 点击跳转路由
  const onClick = useCallback(({ item, key, keyPath, domEvent }) => {
    item.props.to && navigate(item.props.to, {})
    rootStore.addRouterTab({
      path: item.props.to,
      name: item.props.name,
      key: key,
    })
    // 设置当前激活的菜单
    setCurrent(key)
  }, [])
  // 获取当前激活的标签设置menu的选中
  useEffect(() => {
    const routerTab = rootStore.getRouterTabByPath(rootStore.currentRouterPath)
    if (routerTab) {
      setCurrent(routerTab.key)
    }
  }, [rootStore.currentRouterPath])

  return (
    <>
      <Menu selectedKeys={[current]} {...newProps} onClick={onClick}></Menu>
    </>
  )
}
