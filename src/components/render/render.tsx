import { getConfig } from "../../utils"
import RenderChild from "./render-child"
import root from "../../store/root"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import "dayjs/locale/zh-cn"
import dayjs from "dayjs"
dayjs.locale("zh-cn")
export default function Render(props: any) {
  //todo 处理根store
  let rootStore = root.create({})
  return   (
      <ConfigProvider locale={zhCN}>
        <RenderChild  {...getConfig(props, rootStore, rootStore)} />
      </ConfigProvider>
  )
}
