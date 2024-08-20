import { Row } from "antd"
import transferProp from "../../utils/transferProp";
export default function (props: any) {
  const newProps = transferProp(props, "row")
  return <Row {...newProps} />
}
