import transferProp from "../../utils/transferProp";
import { v4 as uuid } from "uuid"
export default function (props: any) {
  const { schema, store,tag, children, ...rest } = props
  // const { tag, children, ...rest } = schema
  // console.log(typeof schema)
  if (typeof props === "object" && !tag) {
    if(props?.type?.$$typeof){
      console.error("存在组件改变children 属性")
      return
    }

    return JSON.stringify(props)
  }
  // eslint-disable-next-line no-template-curly-in-string
  let tmp = props as string
  let Tag = tag
  if (!Tag) {
    // return props.children.join("")
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
