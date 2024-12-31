import { Space } from "antd"
import transferProp from "../../utils/transferProp"
export default function (props: any) {
    const  {isCompact,...rest}=props
    const newProps = transferProp(rest, "space")
    if(isCompact) {
        return <Space.Compact {...newProps}></Space.Compact>
    }
    return <Space {...newProps}></Space>
}
