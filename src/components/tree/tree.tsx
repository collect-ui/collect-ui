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
        }
        if (item.children) {
          result.children = loop(item.children)
        }
        const iconName = varValue(treeIcon, rest.store, { item })
        const Icon = getIcon(iconName)
        result.icon = <Icon />
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
          rest.store.setValue(expression, e.node)
        } else {
          rest.store.setValue(expression, {})
        }
      }
    },
    [],
  )
  const handleItemClick = useCallback(({ props, item }) => {
    const { node } = props
    if (rightMenuAction) {
      handlerActions(rightMenuAction, rest.store, rest.rootStore, useApp, {
        item,
        rightNode: node,
      })
    }
    // Add your logic here
  }, [])

  const handleRightClick = useCallback(({ event, node }) => {
    event.preventDefault()
    show({
      event: event,
      props: {
        node: node, // Pass the node information as a prop
      },
    })
    // const menu = generateContextMenu(node, menuItems, (node, item) => {
    //   console.log(node, item)
    // })
  }, [])

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
      />
      {rightMenu && genContextMenu(MENU_ID, rightMenu, handleItemClick)}
    </>
  )
}

export default MyTree
