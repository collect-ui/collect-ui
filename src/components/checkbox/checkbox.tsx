import { Checkbox } from "antd"
import transferProp from "../../utils/transferProp"
export default function (props: any) {
  return <Checkbox {...transferProp(props, "checkbox")}></Checkbox>
}
