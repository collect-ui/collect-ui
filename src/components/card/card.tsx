import { Card } from "antd"
import transferProp from "../../utils/transferProp"
export default function (props: any) {
  return <Card {...transferProp(props, "card")}></Card>
}
