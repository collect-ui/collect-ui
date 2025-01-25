import transferProp from "../../utils/transferProp"
import { Layout } from "antd"
import getVisible from "../../utils/getVisible";

export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "sider")
  const show = getVisible(props)
  if(!show) {
    return null
  }
  return <Layout.Sider {...newProps}></Layout.Sider>
}
