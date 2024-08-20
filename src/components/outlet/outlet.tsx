import transferProp from "../../utils/transferProp"
import { useOutlet } from "react-router-dom"
import KeepAlive from "../../common/KeepAlive"
export default function (props: any) {
  const { ...rest } = props
  const Outlet = useOutlet()
  const newProps = transferProp(rest, "outlet")
  return <KeepAlive {...newProps} include={["*"]}  >{Outlet}</KeepAlive>
}
