import {App, Input, InputNumber} from "antd"
import transferProp from "../../utils/transferProp"
import Icon from "../icon/icon"
import { useCallback } from "react"
import handlerActions from "../../utils/handlerActions";
export default function (props: any) {
  const {
    isNumber,
    addonAfterTitle,
    addonAfterIcon,
    addonAfterAction,
    showPassword,
    ...rest
  } = props
  let newProps = transferProp(rest, "input")
  const useApp = App.useApp()
  const addonAfterClick = useCallback(() => {
    if (addonAfterAction) {
      handlerActions(
        addonAfterAction,
        props.store,
        props.rootStore,
        useApp,
        rest._target,
      )
    }
  }, [])
  // 处理后缀的标题
  if (addonAfterIcon) {
    newProps.addonAfter = (
      <Icon
        className="pointer"
        onClick={addonAfterClick}
        icon={addonAfterIcon}
        title={addonAfterTitle}
      />
    )
  }
  if (isNumber) {
    return <InputNumber {...newProps}></InputNumber>
  } else if (showPassword) {
    return <Input.Password {...newProps}></Input.Password>
  }
  return <Input {...newProps}></Input>
}
