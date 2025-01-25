// 创建一个通用的图标组件
import React from "react"
import getIcon from "../../utils/getIcon"
import getVisible from "../../utils/getVisible";
import transferProp from "../../utils/transferProp";

const DynamicIcon = (props) => {
  const {visible, ...rest } = props
  const {icon,...newProps} = transferProp(rest, "button")
  const show = getVisible(props)
  if(!show) {
    return null
  }

  const IconComponent = getIcon(icon)
  if (!IconComponent) {
    return null
  }
  return <IconComponent {...newProps} />
}
export default DynamicIcon
