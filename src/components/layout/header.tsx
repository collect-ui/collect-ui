import transferProp from "../../utils/transferProp"
import { Layout } from "antd"

export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "header")
  return <Layout.Header {...newProps}></Layout.Header>
}
