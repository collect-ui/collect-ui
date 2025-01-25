import React, { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { App, Tree } from "antd"
import { DownOutlined } from "@ant-design/icons"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import getIcon from "../../utils/getIcon"
import arrayEqual from "../../utils/arrayEqual"
import expression_name from "../../utils/expression_name"
import genContextMenu from "../../utils/genContextMenu"
import { useContextMenu } from "react-contexify"
import getNodesUpToLevel from "../../utils/getNodesUpToLevel"
import handlerActions from "../../utils/handlerActions"
import NoData from "../no-data/no-data"

const MyTree = ({
  treeKey,
  treeIcon,
  treeSelected,
  treeId,
  treeTitle,
  rightMenu,
  rightMenuAction,
  dblAction,
  selectAction,
  ...rest
}) => {
  console.log("tree render")
  const newProps = useMemo(() => transferProp(rest, "tree"), [rest])
  const treeData = newProps.treeData
  const MENU_ID = `tree-menu-id-${treeId}`
  const { show } = useContextMenu({
    id: MENU_ID,
  })
  const useApp = App.useApp()
  const treeDataMemo = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const key = varValue(treeKey, rest.store, { item })
        const title = varValue(treeTitle, rest.store, { item })
        const result = {
          key,
          title,
          ...item,
          __origin: item// 原始数据,由于改了icon 图标展示，到时图标字段展示不正常
        }
        if (item.children) {
          result.children = loop(item.children)
        }
        if (treeIcon){
          const iconName = varValue(treeIcon, rest.store, { item })
          const Icon = getIcon(iconName)
          result.icon = <Icon />
        }
        return result
      })

    return loop(treeData)
  }, [treeData, treeKey, treeTitle, treeIcon, rest.store])

  const openKeys = useMemo(() => {
    const data = getNodesUpToLevel(treeDataMemo, newProps.openLevel)
    const keys = data.map((item) => item.key)
    return keys
  }, [treeDataMemo, newProps.openLevel])

  const [expandedKeys, setExpandedKeys] = useState(openKeys)
  const prevOpenKeysRef = useRef(openKeys)

  useEffect(() => {
    if (!arrayEqual(openKeys, prevOpenKeysRef.current)) {
      setExpandedKeys(openKeys)
      prevOpenKeysRef.current = openKeys
    }
  }, [openKeys])

  const handleExpand = useCallback((keys) => {
    setExpandedKeys(keys)
  }, [])

  const handleSelect = useCallback(
    (selectedKeys, e: { selected: boolean; selectedNodes; node; event }) => {
      if (treeSelected) {
        const expression = expression_name(treeSelected)
        if (e.selected) {
          rest.store.setValue(expression, e.node.__origin)
        } else {
          rest.store.setValue(expression, {})
        }
      }
      if (selectAction) {
        handlerActions(selectAction, rest.store, rest.rootStore, useApp,{row:e.node.__origin,selected:e.selected},false,rest["namespace"])
      }
    },
    [],
  )
  const handleItemClick = useCallback(({ props, item }) => {
    const { node } = props
    if(item.action){// 如果自己配action则取自己
      handlerActions(item.action, rest.store, rest.rootStore, useApp, {
        item,
        node: node.__origin||node,
      },false,rest["namespace"])
    }else if (rightMenuAction) {
      handlerActions(rightMenuAction, rest.store, rest.rootStore, useApp, {
        item,
        node: node.__origin||node,
      },false,rest["namespace"])
    }
    // Add your logic here
  }, [])

  const handleRightClick = useCallback(({ event, node }) => {
    event.preventDefault()
    show({
      event: event,
      props: {
        node: node.__origin||node, // Pass the node information as a prop
      },
    })
  }, [])
  const handleDoubleClick = useCallback((event,data) => {
    if (rightMenuAction) {
      handlerActions(dblAction, rest.store, rest.rootStore, useApp, {
        node: data.__origin,
      },false,rest["namespace"])
    }
    // Add your logic here
  },[])

  if (treeData && treeData.length <= 0) {
    return <NoData />
  }

  return (
    <>
      <Tree
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        onExpand={handleExpand}
        onSelect={handleSelect}
        {...newProps}
        treeData={treeDataMemo}
        onRightClick={handleRightClick}
        onDoubleClick={handleDoubleClick}
      />
      {rightMenu && genContextMenu(MENU_ID, rightMenu, handleItemClick)}
    </>
  )
}

export default MyTree
