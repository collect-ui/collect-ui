import { Switch } from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
export default function (props: any) {
  // 模仿element-ui 的 inactiveValue和activeValue，将true 和false 进行值转换
  const { inactiveValue, activeValue, value, ...rest } = props
  let newProps = transferProp(rest, "switch")
  // 根据选中值转换，对应值
  const transferValue = useCallback((checked) => {
    if (inactiveValue === undefined || activeValue === undefined) {
      return checked
    }
    return checked ? activeValue : inactiveValue
  }, [])
  const restoreValue = useCallback((text) => {
    if (inactiveValue === undefined || activeValue === undefined) {
      return text
    }
    return text === activeValue
  }, [])
  const onChange = useCallback((checked, event) => {
    if (props.onChange) {
      props.onChange(transferValue(checked), event)
    }
  }, [])
  return (
    <Switch
      {...newProps}
      onChange={onChange}
      value={restoreValue(value)}
    ></Switch>
  )
}
