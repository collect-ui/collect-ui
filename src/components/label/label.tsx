import transferProp from "../../utils/transferProp"
import getVisible from "../../utils/getVisible";

export default function (props: any) {
  console.log("label render")
  const { visible,...rest } = props
  const show = getVisible(props)
  if(!show) {
    return null
  }
  const newProps = transferProp(rest, "label")
  return <label {...newProps}></label>
}