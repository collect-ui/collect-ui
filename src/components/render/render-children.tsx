import { getConfig } from "../../utils"
import renderChild from "./render-child"
export default function renderChildren(children, store, rootStore) {
  return children.map((child) => {
    return renderChild(getConfig(child, store, rootStore))
  })

  // return  renderChild(getConfig(children[0], store, rootStore))
}
