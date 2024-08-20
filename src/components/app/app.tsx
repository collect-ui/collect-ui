import { App } from "antd"
import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const { ...rest } = props
  return <App {...transferProp(rest, "app")}></App>
}
