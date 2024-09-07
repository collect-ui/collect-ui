import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "h3")
  return <h3 {...newProps}></h3>
}
