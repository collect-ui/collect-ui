import { Panel } from "react-resizable-panels"
import transferProp from "../../utils/transferProp"
export default function (props) {
  const { panelKey, ...rest } = props
  const newProps = transferProp(rest, "panel")
  return <Panel {...newProps} />
}
