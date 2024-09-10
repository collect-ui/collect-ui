import {App, Input, InputNumber} from "antd"
import transferProp from "../../utils/transferProp"
import Icon from "../icon/icon"
import { useCallback } from "react"
import handlerActions from "../../utils/handlerActions";
export default function (props: any) {
  const {
    isNumber,
    isTextarea,
    isSearch,
    showPassword,
    addonAfterTitle,
    addonAfterIcon,
    addonAfterAction,
    onSearchAction,
    prefixIcon,
    prefixTitle,
    prefixAction,
    ...rest
  } = props
  let newProps = transferProp(rest, "input")
  const useApp = App.useApp()
  const prefixClick = useCallback(() => {
    if (prefixAction) {
      handlerActions(
          prefixAction,
        props.store,
        props.rootStore,
        useApp,
        rest._target,
      )
    }
  }, [])
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
  const onSearchClick = useCallback(() => {
    if (onSearchAction) {
      handlerActions(
          onSearchAction,
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
  if(prefixIcon){
    newProps.prefix = <Icon icon={prefixIcon} onClick={prefixClick}  title={prefixTitle} />
  }
  if (isNumber) {
    return <InputNumber {...newProps}></InputNumber>
  } else if (showPassword) {
    return <Input.Password {...newProps}></Input.Password>
  } else if (isTextarea) {
    return <Input.TextArea {...newProps}></Input.TextArea>
  } else if (isSearch){
    return <Input.Search {...newProps} onSearch={onSearchClick}></Input.Search>
  }

  return <Input {...newProps}></Input>
}
