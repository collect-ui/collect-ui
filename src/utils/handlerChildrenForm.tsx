import treeToArray from "./tree2Array"
import { Form } from "antd"

export default function handlerChildrenForm(children: any, store: any) {
  const childList = treeToArray(children)
  // // 处理children 里面的表单，能在外层拿到引用
  childList.forEach((child) => {
    const { tag, name, valueRule } = child
    if (tag === "form" && name) {
      const useForm = Form.useForm()
      // 表单引用
      store.setFormRef(name, useForm)
      // 表单规则
      if (valueRule) {
        store.setFormRule(name, valueRule)
      }
      child.form = useForm[0]
    }
  })
}
