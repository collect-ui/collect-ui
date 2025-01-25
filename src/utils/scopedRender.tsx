import {memo, useMemo} from "react"
import RenderChild from "../components/render/render-child"
import { getConfig } from "./index"


const ScopedRender = (props: any) => {
  const { store,onClick, rootStore, ...rest } = props
  // 处理 onClick 事件
  const handleClick = (e) => {
    if (onClick) {
      // 将事件对象 e 和 item 传递给 onClick
      onClick(e, rest._target_row);
    }
  };
  return <RenderChild  {...getConfig(rest, store, rootStore,rest._target)}  onClick={handleClick}/>
}
export default ScopedRender
