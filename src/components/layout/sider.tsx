import transferProp from "../../utils/transferProp"
import { Layout } from "antd"


export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "sider")
  return <Layout.Sider {...newProps}></Layout.Sider>
}
