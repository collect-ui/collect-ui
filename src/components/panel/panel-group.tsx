import { PanelGroup } from "react-resizable-panels"
import transferProp from "../../utils/transferProp"
export default function (props) {
  const { ...rest } = props
  const newProps = transferProp(rest, "panel-group")
  return <PanelGroup {...newProps} />
}
