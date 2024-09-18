import { Upload } from "antd"
import transferProp from "../../utils/transferProp"
import getVisible from "../../utils/getVisible";
export default function (props: any) {
    const { uploadConfig,visible,...rest } = props
    const {...newProps }= transferProp(rest, "upload")
    const show = getVisible(props)
    if(!show) {
        return null
    }
    return <Upload {...newProps}></Upload>
}
