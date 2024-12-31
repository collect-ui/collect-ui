// 创建一个通用的图标组件
import React from "react"
import { Image } from 'antd';
import getVisible from "../../utils/getVisible";
import transferProp from "../../utils/transferProp";


export default (props) => {
    const { icon,visible, ...rest } = props

    const show = getVisible(props)
    if(!show) {
        return null
    }
    const newProps = transferProp(rest, "img")
    return <Image{...newProps}/>
}
