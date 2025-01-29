import {memo, useMemo} from "react"
import RenderChild from "../components/render/render-child"
import { getConfig } from "./index"
import getPassVar from "./getPassVar";


const ScopedRender = memo((props: any) => {
  const { store,onClick, rootStore, ...rest } = props
  // 处理 onClick 事件
  const handleClick = (e) => {
    if (onClick) {
      // 将事件对象 e 和 item 传递给 onClick
      onClick(e, rest._target_row);
    }
  };
  const pass=getPassVar(props)
  if(rest._target_row){
    pass["row"]=rest._target_row
  }

  return <RenderChild  {...getConfig(rest, store, rootStore,pass)} onClick={handleClick} />
})

export default ScopedRender
