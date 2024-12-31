import {App, Select} from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
import clone from "../../utils/clone"
import handlerChildrenTempl from "../../utils/handlerChildrenTempl"
import handlerActions from "../../utils/handlerActions";

export default function (props: any) {
  const { action,optionRender, OptionRender, labelRender, ...rest } = props
  let newProps = transferProp(rest, "select")
  const itemRenderTmp = useCallback((option) => {
    const templ = handlerChildrenTempl(clone(optionRender), { ...option.data })
    return <>{templ}</>
    // return <>{OptionRender}</>
    // return <OptionRender></OptionRender>
    // return <Test code="1" />
    // return <ScopedRender {...optionRender} {...option.data}></ScopedRender>
    // return null
  }, [])
  const useApp = App.useApp()
  const labelRenderTmp = useCallback((option) => {
    if (!option.value) {
      return ""
    }
    const templ = handlerChildrenTempl(clone(labelRender), { ...option })
    return <>{templ}</>
  }, [])
  const onChange = useCallback(async (value) => {
    if (action) {
      handlerActions(action, props.store, props.rootStore, useApp, {value})
    }
  }, [])
  return (
    <Select
      onChange={onChange}
      labelRender={labelRender ? labelRenderTmp : null}
      optionRender={optionRender ? itemRenderTmp : null}
      {...newProps}
    ></Select>
  )
}
