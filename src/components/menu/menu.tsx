import { Menu } from "antd"
import transferProp from "../../utils/transferProp"
import tree2Array from "../../utils/tree2Array"
import {useCallback, useEffect, useMemo, useState} from "react"
import Icon from "../icon/icon"
import { useNavigate, useLocation } from "react-router-dom"
function handlerItems(items,rule){
  return items.map(item => {
    const iconName = rule["icon_field"]
    const tmp={
      key:item[rule["key_field"]],
      label: item[rule["label_field"]],
      to: item[rule["to_field"]],
      icon:iconName?<Icon icon={item[iconName]} /> : null
    }
    if (item.children && item.children.length > 0) {
      return {
       ...item,
       ...tmp,
        children: handlerItems(item.children,rule),
      }
    }
    return {...item,...tmp}
  })
}
export default function (props: any) {
  const { changeRouter, rule,...rest} = props
  const rootStore=props.rootStore
  const newProps = useMemo(() => transferProp(rest, "menu"), [props]);
  const items = useMemo(() => handlerItems(newProps.items, rule), [newProps.items, rule]);
  let navigate = useNavigate()
  const location = useLocation()
  const [current, setCurrent] = useState("")
  // 初始化进来的时候添加当前路由
  //
  useEffect(() => {
    if(changeRouter){
      const tmp = tree2Array(items).find((item) => item.to === location.pathname)
      // 根据当前路径找到当前的菜单，然后添加到router tab
      if (tmp) {
        rootStore.addRouterTab({
          path: location.pathname,
          name: tmp.label,
          key: tmp.key,
        })
      }
    }

  },  [location.pathname, items])
  // 点击跳转路由
  const onClick = useCallback(({ item, key, keyPath, domEvent }) => {
   if(changeRouter){
     item.props.to && navigate(item.props.to, {})
     rootStore.addRouterTab({
       path: item.props[rule['to_field']],
       name: item.props[rule['label_field']],
       key: key,
     })
     // 设置当前激活的菜单
     setCurrent(key)
   }

  }, [])
  // 获取当前激活的标签设置menu的选中
  useEffect(() => {
    if(changeRouter){
      const routerTab = rootStore.getRouterTabByPath(rootStore.currentRouterPath)
      if (routerTab) {
        setCurrent(routerTab.key)
      }
    }

  }, [rootStore.currentRouterPath])

  return (
    <>
      <Menu selectedKeys={changeRouter?[current]:newProps.selectedKeys} {...newProps} items={items} onClick={onClick}></Menu>
    </>
  )
}
