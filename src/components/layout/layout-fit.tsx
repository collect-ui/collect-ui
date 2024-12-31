import transferProp from "../../utils/transferProp"
import Title from "../title/title"
import { App,  } from "antd"
import {

  useEffect,
} from "react"

import handlerActions from "../../utils/handlerActions"
import {varValue} from "../../utils";



export default function (props: any) {
  const {
    topRight,
    topRightRender,
    // 顶部搜索
    searchToolBar,
    searchToolBarRender,
    searchBarRight,
    searchBarRightRender,
    // 底部工具栏
    bottomToolBar,
    bottomToolBarRender,
    // 低对齐方式
    bottomAlign,
    children,
    childrenRender,
    initStore,
    // window的监听事件
    windowKeyUpEvent,
      timer,
    ...rest
  } = props
  const useApp = App.useApp()
  const store = props["store"]
  console.log("layout-fit-render")
  const handleKeyUp=(event)=>{
    const eventKey = event.key
    console.log(event.key)
    const action_list =[]
    for(let i=0; i<windowKeyUpEvent.length; i++){
      let item = windowKeyUpEvent[i]
      if(!item.key){
        console.error("item 数据配置有有误，未找到key",item)
      }
      if(item.key.split("|").indexOf(eventKey)>=0){
        action_list.push(...item.action)
      }
    }
    if (action_list.length>0) {
        handlerActions(action_list, store, props.rootStore, useApp,null,false)
    }

  }
  const timer_enable= varValue(timer?.enable,store,props.rootStore)
  // 处理变量初始化
  const initAction = props["initAction"]
  useEffect(() => {
    if (initAction && store) {
      handlerActions(initAction, store, props.rootStore, useApp,null,false)
    }
    if(windowKeyUpEvent){
      window.addEventListener('keyup', handleKeyUp);
    }

    return ()=>{
      if(windowKeyUpEvent){
        window.removeEventListener('keyup', handleKeyUp);
      }
    }
  }, [])
  // 处理定时器
  useEffect(()=>{
    if(timer){
      if(timer_enable){
        const timer_id=setInterval(()=>{
          handlerActions(timer.action, store, props.rootStore, useApp,null,false)
        },timer.interval)
        return ()=>{
          clearInterval(timer_id)
        }
      }
    }
  },[timer_enable])

  const bottomAlignClass = bottomAlign || "right"
  const { title, ...newProps } = transferProp(rest, "layout-fit", useApp)
  return (
    <div {...newProps}>
      {title && (
        <div className="top-header">
          <Title className="top-title">{title}</Title>
          {topRightRender && <div>{topRightRender}</div>}
        </div>
      )}
      {searchToolBarRender && (
        <div className="bar">
          <div className="search-left">{searchToolBarRender}</div>
          {searchBarRightRender && (
            <div className="search-right">{searchBarRightRender}</div>
          )}
        </div>
      )}
      <div className="layout-content">{childrenRender}</div>
      {bottomToolBarRender && (
        <div className={`bottom-tool-bar ${bottomAlignClass}`}>
          {bottomToolBarRender}
        </div>
      )}
    </div>
  )
}
