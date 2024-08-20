import { Item, Menu, Separator, Submenu } from "react-contexify"
import getIcon from "./getIcon"
import React from "react"

const generateContextMenu = (menu_id, menuItems, handleMenuItemClick) => {
  return (
    <Menu id={menu_id}>
      {menuItems.map((item, index) => {
        const Icon = item.icon ? getIcon(item.icon) : null
        if (item.type === "item") {
          return (
            <Item
              key={index}
              onClick={(props) => handleMenuItemClick({ item, ...props })}
            >
              {item.icon && <Icon className="margin-right10" />} {item.label}
            </Item>
          )
        } else if (item.type === "separator") {
          return <Separator key={index} />
        } else if (item.type === "submenu") {
          return (
            <Submenu key={index} label={item.label}>
              {item.children.map((child, childIndex) => {
                if (child.type === "item") {
                  const SubIcon = child.icon ? getIcon(child.icon) : null
                  return (
                    <Item
                      key={childIndex}
                      data={{ label: child.label }}
                      onClick={(props) =>
                        handleMenuItemClick({ item: child, ...props })
                      }
                    >
                      {child.icon && <SubIcon className="margin-right10" />}{" "}
                      {child.label}
                    </Item>
                  )
                } else if (child.type === "separator") {
                  return <Separator key={childIndex} />
                }
                return null
              })}
            </Submenu>
          )
        }
        return null
      })}
    </Menu>
  )
}
export default generateContextMenu
