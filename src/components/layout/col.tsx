import {App, Col} from "antd"
import transferProp from "../../utils/transferProp";
import { useEffect } from "react"
import handlerActions from "../../utils/handlerActions";

export default function (props: any) {
  const newProps = transferProp(props, "col")
  // 处理变量初始化
  const initAction = props["initAction"]
  const useApp = App.useApp()
  useEffect(() => {
    if (initAction && props.store) {
      handlerActions(initAction, props.store, props.rootStore, useApp)
    }
  }, [])
  return <Col {...newProps}></Col>
}
