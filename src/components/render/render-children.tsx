import { getConfig } from "../../utils"
import renderChild from "./render-child"
export default function renderChildren(children, store, rootStore,_target?:any) {
  return children.map((child) => {
    return renderChild(getConfig(child, store, rootStore,_target))
  })

  // return  renderChild(getConfig(children[0], store, rootStore))
}
