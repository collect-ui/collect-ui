import { Breadcrumb } from "antd"
import transferProp from "../../utils/transferProp"
export default function (props: any) {
    return <Breadcrumb {...transferProp(props, "breadcrumb")}></Breadcrumb>
}
