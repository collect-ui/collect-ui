import { getConfig } from "../../utils"
import RenderChild from "./render-child"
// export default function renderChildren(children, store, rootStore,_target?:any) {
//   return children.map((child,index) => {
//     return <RenderChild key={index} {...getConfig(child, store, rootStore,_target)}></RenderChild>
//   })
// }

export default function RenderChildren(props) {
  const { children, store, rootStore,_target,...rest } = props
  return children.map((child) => {
    return RenderChild(getConfig({...rest,...child}, store, rootStore,_target))
  })
}
