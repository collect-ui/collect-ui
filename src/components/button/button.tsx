import { App, Button, Popconfirm } from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
import handlerActions from "../../utils/handlerActions"
import Icon from "../icon/icon"
import getVisible from "../../utils/getVisible";

export default function (props: any) {
  console.log("button render")
  const { icon,visible, action, confirm, ...rest } = props
  const store = props["store"]
  const useApp = App.useApp()

  const newProps = transferProp(rest, "button")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClick = useCallback(async () => {
    if (action) {
      handlerActions(action, store, props.rootStore, useApp, rest._target,false,rest["namespace"])
    }
  }, [])
  const show = getVisible(props)
  if(!show) {
    return null
  }
  // 将confirm 和button 合并
  let IconRender = icon ? <Icon icon={icon} /> : null
  if (confirm) {
    confirm["store"] = store
    if (props._target) {
      confirm["_target"] = props._target
    }
    const confirmProps = transferProp(confirm, "confirm")
    return (
      <Popconfirm {...confirmProps} onConfirm={onClick}>
        <Button icon={IconRender} {...newProps}></Button>
      </Popconfirm>
    )
  }
  return <Button icon={IconRender} onClick={onClick} {...newProps} ></Button>
}
