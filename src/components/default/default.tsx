import transferProp from "../../utils/transferProp";
import { v4 as uuid } from "uuid"
export default function (props: any) {
  const { schema, store } = props
  const { tag, children, ...rest } = schema
  console.log(typeof schema)
  if (typeof schema === "object" && !tag) {
    if(schema?.type?.$$typeof){
      console.error("存在组件改变children 属性")
      return
    }

    return JSON.stringify(schema)
  }
  // eslint-disable-next-line no-template-curly-in-string
  let tmp = schema as string
  if (typeof schema === "string") {
    //todo 取上级store
    tmp = tmp.replace("${page}", "【模拟测试变量】")
  }
  let Tag = tag
  if (!Tag) {
    return tmp
  }
  if (typeof children === "string" && store) {
    let childrenStr = children as string
    childrenStr = childrenStr.replace("${store.loading}", store.loading)
    childrenStr = childrenStr.replace("${store.error_msg}", store.error_msg)
    rest["children"] = childrenStr
  } else {
    rest["children"] = children
  }

  return <Tag key={uuid()} {...rest}></Tag>
}
