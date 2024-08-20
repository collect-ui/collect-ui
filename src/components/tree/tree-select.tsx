import React, { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { TreeSelect } from "antd"
import { DownOutlined } from "@ant-design/icons"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import getIcon from "../../utils/getIcon"
import arrayEqual from "../../utils/arrayEqual"
import getNodesUpToLevel from "../../utils/getNodesUpToLevel";

const MyTree = ({
  valueKey,
  showIcon,
  openLevel,
  treeIcon,
  treeTitle,
  ...rest
}) => {
  console.log("tree-select render")
  const newProps = useMemo(() => transferProp(rest, "tree-select"), [rest])
  const treeData = newProps.treeData

  const treeDataMemo = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const value = varValue(valueKey, rest.store, { item })
        const title = varValue(treeTitle, rest.store, { item })
        const result = {
          value,
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
  }, [treeData, valueKey, treeTitle, treeIcon, rest.store])

  const openKeys = useMemo(() => {
    const data = getNodesUpToLevel(treeDataMemo, newProps.openLevel)
    const keys = data.map((item) => item.value)
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
  const filterTreeNode = useCallback((inputValue, treeNode) => {
    // 自定义搜索逻辑
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  }, [])

  return (
    <TreeSelect
      switcherIcon={<DownOutlined />}
      treeExpandedKeys={expandedKeys}
      onTreeExpand={handleExpand}
      {...newProps}
      treeIcon={showIcon}
      treeData={treeDataMemo}
      filterTreeNode={filterTreeNode}
    />
  )
}

export default MyTree

// import transferProp from "../../utils/transferProp"
// import { TreeSelect } from "antd"
// import { DownOutlined } from "@ant-design/icons"
// export default function (props: any) {
//   const { ...rest } = props
//   const newProps = transferProp(rest, "tree-select")
//   return <TreeSelect switcherIcon={<DownOutlined />} {...newProps}></TreeSelect>
// }
