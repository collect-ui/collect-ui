import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const {  children, ...rest} = props
  const newProps = transferProp(rest, "title")
    return <div {...newProps}><div className="title-block"></div>{children}</div>
}
