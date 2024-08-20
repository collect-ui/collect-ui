import * as FaIcons from "react-icons/fa"
import * as Icons from "@ant-design/icons"
export default function (icon) {
  const IconComponent = FaIcons[icon] || Icons[icon] //|| MdIcons[icon] || GrIcons[icon]
  if (!IconComponent) {
    return null
  }
  return IconComponent
}
