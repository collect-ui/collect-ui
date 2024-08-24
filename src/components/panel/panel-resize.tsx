import { PanelResizeHandle } from "react-resizable-panels"
import transferProp from "../../utils/transferProp"
import getVisible from "../../utils/getVisible";
export default function (props) {
  const {visible, ...rest } = props
  const show = getVisible(props)
  if(!show) {
    return null
  }
  const newProps = transferProp(rest, "panel-resize Resizer")
  return <PanelResizeHandle {...newProps} />
}
