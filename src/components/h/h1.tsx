import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "h1")
  return <h1 {...newProps}></h1>
}
