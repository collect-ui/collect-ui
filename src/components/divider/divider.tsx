import { Divider } from "antd"
import transferProp from "../../utils/transferProp"
export default function (props: any) {
  return <Divider {...transferProp(props, "divider")}></Divider>
}
