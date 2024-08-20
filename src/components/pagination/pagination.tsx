import { Pagination, PaginationProps } from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
import varNameList from "../../utils/varNameList"
import varName from "../../utils/varName";
const showTotalShow: PaginationProps["showTotal"] = (total) => `共 ${total} 条`

export default function (props: any) {
  const { showTotal, ...rest } = props

  const onChange = useCallback((page, pageSize) => {
    const currentStr = props["current"]
    const pageSizeStr = props["pageSize"]
    const store = props["store"]
    // 获取表单对象名称
    const formName = varName(currentStr)
    // 获取值
    let obj = { ...store.getValue(formName) }
    // 获取分页名称
    const [_, pageSecondVarName] = varNameList(currentStr)
    // 获取分页大小名称
    const [_1, pageSizeSecondVarName] = varNameList(pageSizeStr)
    obj[pageSecondVarName] = page
    obj[pageSizeSecondVarName] = pageSize
    // 设置表单对象
    store.setValue(formName, obj)
    //todo 处理actions
  }, [])
  const newProps = transferProp(rest, "pagination")
  return (
    <Pagination
      {...newProps}
      showTotal={showTotal ? showTotalShow : null}
      onChange={onChange}
    ></Pagination>
  )
}
