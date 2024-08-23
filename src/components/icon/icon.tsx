// 创建一个通用的图标组件
import React from "react"
import getIcon from "../../utils/getIcon"
import getVisible from "../../utils/getVisible";

const DynamicIcon = (props) => {
  const { icon, store,visible, rootStore, ...rest } = props
  const show = getVisible(props)
  if(!show) {
    return null
  }

  const IconComponent = getIcon(icon)
  if (!IconComponent) {
    return null
  }
  return <IconComponent {...rest} />
}
export default DynamicIcon
