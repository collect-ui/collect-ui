import {App, Pagination, PaginationProps} from "antd"
import transferProp from "../../utils/transferProp"
import { useCallback } from "react"
import varNameList from "../../utils/varNameList"
import varName from "../../utils/varName";
const showTotalShow: PaginationProps["showTotal"] = (total) => `共 ${total} 条`
import handlerActions from "../../utils/handlerActions"

export default function (props: any) {
  const { showTotal,action, ...rest } = props
  const useApp = App.useApp()
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
    // 改变的size
    if(obj[pageSizeSecondVarName] != pageSize){
      obj[pageSecondVarName] = 1
      obj[pageSizeSecondVarName] = pageSize
    }else{// 改变的page
      obj[pageSecondVarName] = page
    }

    // obj[pageSizeSecondVarName] = pageSize
    // 设置表单对象
    store.setValue(formName, obj)
    // 处理actions
    if(action){
      handlerActions(action, store,props.rootStore,useApp)
    }
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
