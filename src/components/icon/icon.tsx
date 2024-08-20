// 创建一个通用的图标组件

import React from "react"
import getIcon from "../../utils/getIcon"

const DynamicIcon = (props) => {
  const { icon, store, rootStore, ...rest } = props
  const IconComponent = getIcon(icon)
  if (!IconComponent) {
    return null
  }
  return <IconComponent {...rest} />
}
export default DynamicIcon
