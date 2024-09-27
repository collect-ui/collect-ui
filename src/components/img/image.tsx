// 创建一个通用的图标组件
import React from "react"
import { Image } from 'antd';
import getVisible from "../../utils/getVisible";
import transferProp from "../../utils/transferProp";

const Image = (props) => {
    const { icon,visible, ...rest } = props
    const show = getVisible(props)
    if(!show) {
        return null
    }
    const newProps = transferProp(rest, "img")
    return <Image{...newProps}/>
}
export default Image
