import transferProp from "../../utils/transferProp"
import getVisible from "../../utils/getVisible";
import {useCallback} from "react";
import handlerActions from "../../utils/handlerActions";
import {App} from "antd";

export default function (props: any) {
  const { action,visible,...rest } = props
  const show = getVisible(props)
  if(!show) {
    return null
  }
  const useApp = App.useApp()
  const onClick = useCallback(() => {
    if (action) {
      handlerActions(action, props.store, props.rootStore, useApp, rest._target)
    }
  }, [])
  const newProps = transferProp(rest, "span")
  return <span {...newProps} onClick={onClick}></span>
}