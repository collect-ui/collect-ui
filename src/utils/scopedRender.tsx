import {memo, useMemo} from "react"
import RenderChild from "../components/render/render-child"
import { getConfig } from "./index"


const ScopedRender = (props: any) => {
  const { store,onClick, rootStore, ...rest } = props
  // 处理 onClick 事件

  if (onClick && rest._target) {
    const handleClick = (e) => {
      // 将事件对象 e 和 item 传递给 onClick
      onClick(e, rest._target_row);
    }
    rest._target["onClick"] = handleClick
  }
  return <RenderChild  {...getConfig(rest, store, rootStore,rest._target)} />
}
export default ScopedRender
