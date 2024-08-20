import { App, Popconfirm } from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
import handlerActions from "../../utils/handlerActions"

export default function (props: any) {
  const { action, ...rest } = props
  const store = props["store"]
  const useApp = App.useApp()
  const newProps = transferProp(rest, "confirm")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const confirm = useCallback(async () => {
    if (action) {
      handlerActions(action, store, props.rootStore, useApp)
    }
  }, [])
  return <Popconfirm onConfirm={confirm} {...newProps}></Popconfirm>
}
