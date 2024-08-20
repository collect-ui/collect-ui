import { DatePicker } from "antd"
import zhCN from "antd/locale/zh_CN"
import transferProp from "../../utils/transferProp"
import dayjs from "dayjs"
import "moment/locale/zh-cn"
import "dayjs/locale/zh-cn"
import { useCallback } from "react"
dayjs.locale("zh-cn")

export default function (props: any) {
  // 模仿element-ui 实现value-format
  const { valueFormat, ...rest } = props
  let newProps = transferProp(rest, "date")

  const onChange = useCallback((date: any, dateString: any) => {
    if (props.onChange) {
      const newDate = date ? dayjs(date).format(valueFormat) : null
      props.onChange(newDate, dateString)
    }
  }, [])
  return (
    <DatePicker
      locale={zhCN}
      {...newProps}
      defaultValue={props.defaultValue ? dayjs(props.defaultValue) : null}
      value={props.value ? dayjs(props.value) : null}
      onChange={onChange}
    ></DatePicker>
  )
}
