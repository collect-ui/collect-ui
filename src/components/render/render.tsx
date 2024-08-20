import { getConfig } from "../../utils"
import RenderChild from "./render-child"
import root from "../../store/root"
export default function Render(props: any) {
  //todo 处理根store
  let rootStore = root.create({})
  return <RenderChild  {...getConfig(props, rootStore, rootStore)} />
}
