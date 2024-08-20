import transferProp from "../../utils/transferProp"

export default function (props: any) {
  console.log("div render")
  const { ...rest } = props
  const newProps = transferProp(rest, "div")
  return <div {...newProps}></div>
}
