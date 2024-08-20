import { Select } from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
import clone from "../../utils/clone"
import handlerChildrenTempl from "../../utils/handlerChildrenTempl"

export default function (props: any) {
  const { optionRender, OptionRender, labelRender, ...rest } = props
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
  const labelRenderTmp = useCallback((option) => {
    if (!option.value) {
      return ""
    }
    const templ = handlerChildrenTempl(clone(labelRender), { ...option })
    return <>{templ}</>
  }, [])
  return (
    <Select
      labelRender={labelRender ? labelRenderTmp : null}
      optionRender={optionRender ? itemRenderTmp : null}
      {...newProps}
    ></Select>
  )
}
