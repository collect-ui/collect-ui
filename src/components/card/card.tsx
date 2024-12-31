import { Card } from "antd"
import transferProp from "../../utils/transferProp"
export default function (props: any) {
  const {actionsRender,...newProps} = transferProp(props, "card")
  return <Card {...newProps} actions={actionsRender}></Card>
}
