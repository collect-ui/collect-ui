import { Tabs } from "antd"
import transferProp from "../../utils/transferProp"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
export default function (props: any) {
  const { rootStore } = props
  const newProps = transferProp(props, "router-tab")
  const [activeKey, setActiveKey] = useState("")
  const [items, setItems] = useState([])
  const navigate = useNavigate()
  // 路由和标签改变时，生成tab
  useEffect(() => {
    let l = []
    const activeTab = rootStore.activeTab()
    rootStore.routerTabs.forEach((item) => {
      let TabLabel = ({ tabKey, item, activeTabKey }) => {
        return (
          <>
            {tabKey === activeTabKey && <div className={"active-dot"}></div>}
            {item.name}
          </>
        )
      }
      l.push({
        label: (
          <TabLabel tabKey={item.key} item={item} activeTabKey={activeTab?.key} />
        ),
        key: item.key,
      })
    })
    setItems(l)
    if (activeTab) {
      setActiveKey(activeTab.key)
    }
  }, [rootStore.routerTabs, rootStore.currentRouterPath])
  // 标签页点击跳转路由
  const onTabClick = (key) => {
    setActiveKey(key)
    const routerTab = rootStore.getRouterTabByKey(key)
    if (routerTab) {
      // 跳转路由
      navigate(routerTab.path, {})
      // 设置当前激活的标签
      rootStore.addRouterTab(routerTab)
    }
  }
  return (
    <>
      <Tabs
        activeKey={activeKey}
        type="editable-card"
        size="small"
        {...newProps}
        hideAdd
        onTabClick={onTabClick}
        items={items}
      />
    </>
  )
}
