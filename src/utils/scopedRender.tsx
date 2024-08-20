import { memo } from "react"
import RenderChild from "../components/render/render-child"
import { getConfig } from "./index"

const ScopedRender = memo((props: any) => {
  const { store, rootStore, ...rest } = props
  return <RenderChild {...getConfig(rest, store, rootStore)} />
})
export default ScopedRender
