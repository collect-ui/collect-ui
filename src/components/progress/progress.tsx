import { Progress } from "antd"
import transferProp from "../../utils/transferProp"
import getVisible from "../../utils/getVisible";
export default function (props: any) {
    const { visible,...rest } = props
    const {...newProps }= transferProp(rest, "progress")
    const show = getVisible(props)
    if(!show) {
        return null
    }
    return <Progress {...newProps}></Progress>
}
