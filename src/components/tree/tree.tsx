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
// 递归查找父节点
const findParentNode = (treeData, key,treeKey,rest, parent = null) => {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    const targetKey = varValue(treeKey,rest.store,{item:node})
    if (targetKey === key) {
      return parent;
    }
    if (node.children) {
      const result = findParentNode(node.children, key,treeKey,rest, node);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

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
  allowDrop,
  dragAction,
  // 以下是其他属性
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
  const treeRef = useRef();

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
  const handleAllowDrap = useCallback(({ dropNode, dropPosition }) => {
    return varValue(allowDrop,rest.store,{item:dropNode.__origin, dropPosition: dropPosition})
    // return true
  }, [])
  const handleDrop = useCallback((props) => {
    const {event, node, dragNode, dragNodesKeys,dropPosition,dropToGap}=props
    const treeData = varValue(rest.treeData,rest.store)
    let curent_level_list = []
    let parent = {}
    const parent_id_field = "parent_id"
    const children_field = "children"
    const order_index_field = "order_index"
    function getCopy(node){
      const target_item={}
      for(let key in node){
        if(key!=children_field){
          target_item[key]=node[key]
        }
      }
      return target_item
    }
    // dropToGap true 表示拖动顺序，
    // dropToGap false 表示改变父节点
    // dropToGap 只有
    // 如果有父节点的情况
    let parent_node={}
    let has_change_parent=false
    let is_err_parent=false
    if(dropPosition===0){// 节点是父的
       parent_node = node.__origin
    }else{
       parent_node = findParentNode(treeData,node.key,treeKey,rest)
       if(!parent_node){
         parent_node=node.__origin
         has_change_parent=true
         is_err_parent=true
       }
    }
    curent_level_list = parent_node?.children??treeData
    parent = getCopy(parent_node)


    // 处理都是根节点的问题
    if(!parent[parent_id_field] && (!node[parent_id_field] || node[parent_id_field]=="0")){

      // 忽略
    }else{
      const parent_id = varValue(treeKey,rest.store,{item:parent})
      has_change_parent = parent_id!==dragNode[parent_id_field]
    }
    if(!node[children_field] && !dropToGap && dropPosition===1){
      has_change_parent=true
      parent=node.__origin
      curent_level_list=[dragNode.__origin]
    }

    const rows = []
    let target_index=-1
    for (let i=0;i<curent_level_list.length;i++){
      let item=curent_level_list[i]
      const id = varValue(treeKey,rest.store,{item:item})
      // 找到目标为止
      if(id===node.key){
        target_index=i
      }
      const target_item=item.__origin||item
      let row = getCopy(target_item)
      rows.push(row)
    }
    const target_item = {...dragNode.__origin,__is_moving:true}
    if(dropPosition===0 || is_err_parent){
      rows.splice(0, 0, target_item)
    }else{
      const position =target_index+dropPosition
      rows.splice(position, 0, target_item)
    }

    //删除原来的
    let remove_target=-1
    for(let i=0;i<rows.length;i++){
      const item=rows[i]
      const id = varValue(treeKey,rest.store,{item:item})
      // 找到目标为止
      if(id===dragNode.key && !item.__is_moving){
        remove_target=i
      }
    }
    if(remove_target!=-1){
      rows.splice(remove_target,1 )
    }
    rows.forEach((item,index)=>{
      item[order_index_field]=(index+1)*10
    })
    if (dragAction) {
      handlerActions(dragAction, rest.store, rest.rootStore, useApp, {
        item: {...dragNode.__origin},
        rows: rows,
        parent:parent,
        change_parent: has_change_parent,
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
          ref={treeRef}
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        onExpand={handleExpand}
        onSelect={handleSelect}
        {...newProps}
        treeData={treeDataMemo}
        onRightClick={handleRightClick}
        onDoubleClick={handleDoubleClick}
        onDrop={handleDrop}
        allowDrop={handleAllowDrap}
      />
      {rightMenu && genContextMenu(MENU_ID, rightMenu, handleItemClick)}
    </>
  )
}

export default MyTree
