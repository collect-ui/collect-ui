import {App, Tabs} from "antd"
import transferProp from "../../utils/transferProp"
import React, { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function (props: any) {
  const { rootStore } = props
  const newProps = transferProp(props, "router-tab")
  const [activeKey, setActiveKey] = useState("")
  const [items, setItems] = useState([])
  const navigate = useNavigate()
  const useApp = App.useApp()
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
  const onEdit=useCallback((targetKey: TargetKey, action: 'add' | 'remove') => {
    if(action==='remove'){

      if(items.length>1){
        const newCurrent = rootStore.removeRouterTab(targetKey)
        if(newCurrent){
          // 如果新路由存在，跳转到新路由
          navigate(newCurrent.path, {})
        }
        setItems(items.filter(item =>item.key!=targetKey))
      }else{
        useApp?.message?.error("只剩一个标签不能删除！")
      }

    }
  },[items])
  return (
    <>
      <Tabs

        activeKey={activeKey}
        type="editable-card"
        size="small"
        {...newProps}
        hideAdd
        onEdit={onEdit}
        onTabClick={onTabClick}
        items={items}
      />
    </>
  )
}
