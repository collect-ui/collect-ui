import getVisible from "../../utils/getVisible";
import transferProp from "../../utils/transferProp";
import { Tag } from 'antd';

export default (props:any)=>{
    const { visible,  ...rest } = props
    const show = getVisible(props)
    if(!show) {
        return null
    }
    let newProps = transferProp(rest, "tag")
    return <Tag {...newProps} />

}