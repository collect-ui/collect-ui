import { App, Form, Modal,Button } from "antd"
import transferProp from "../../utils/transferProp"
import varName from "../../utils/varName"
import setStoreValue from "../../utils/setStoreValue"
import type { DraggableData, DraggableEvent } from "react-draggable"
import Draggable from "react-draggable"
import {

  useCallback,
  useRef,
  useState,
} from "react"
import handlerActions from "../../utils/handlerActions";
export default function (props: any) {
  console.log("dialog render")
  const { action, ...rest } = props
  const store = props.store

  // 处理拖拽
  const [disabled, setDisabled] = useState(true)
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null)
  const newProps = transferProp(rest, "dialog")
  const confirmAndContinue=newProps.confirmAndContinue
  const title = newProps.title

  const useApp = App.useApp()
  // 绑定对话框里的第一个form，用于提交

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }
  // 去掉直接关闭对话框
  const handleCancel = useCallback(() => {
    // 获取配置对话框变量名称
    const openName = varName(props.open)
    setStoreValue(openName, false, store)
  }, [])
  // 去掉直接关闭对话框
  const handleOk = useCallback(async () => {

    setTimeout(()=>{
      handlerActions(action, store, props.rootStore, useApp,{"confirmAndContinue":false},false,props["namespace"])
    },0)


  }, [])
  // 去掉直接关闭对话框
  const handleConfirmAndContinue = useCallback(async () => {
    setTimeout(()=> {
      handlerActions(action, store, props.rootStore, useApp, {"confirmAndContinue": true}, false, props["namespace"])
    },0)

  }, [])

  const footer=[
    <Button key="cancel" onClick={handleCancel}>
      取消
    </Button>,
    <Button key="ok" type="primary" onClick={handleOk}>
      确定
    </Button>
  ]
  if (confirmAndContinue){
    footer.push(<Button key="confirmAndContinue" type="primary" onClick={handleConfirmAndContinue}>确定并继续</Button>)
  }
  return (
    <Modal
      {...newProps}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={footer}
      title={
        <div
          className="dialog-title"
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false)
            }
          }}
          onMouseOut={() => {
            setDisabled(true)
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {title}
        </div>
      }
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    ></Modal>
  )
}
