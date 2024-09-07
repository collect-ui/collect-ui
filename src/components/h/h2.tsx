import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "h2")
  return <h2 {...newProps}></h2>
}
