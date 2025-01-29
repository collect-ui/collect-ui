import treeToArray from "./tree2Array"
import {Form} from "antd"
import {useRef} from "react";
import {varValue} from "./index";


export default function handlerChildrenForm(children: any, store: any,target?: any) {
    const childList = treeToArray(children)
    // // 处理children 里面的表单，能在外层拿到引用
    childList.forEach((child) => {
        const {tag, name, refName} = child
        if (tag === "form" && name) {
            if(!store.getFormRef(name)){
                const useForm = Form.useForm()
                // 表单引用
                store.setFormRef(name, useForm)
                child.form = useForm[0]
            }
        } else if (refName) {
            // 这里主要解决ssh 组件，需要调用ref 的方法
            interface TerminalProps {
                [key: string]: string | Function; // 动态字段可以是字符串或函数
            }
            const newRefName = varValue(refName, store, target)
            if (!store.getFormRef(newRefName)){
                //@ts-ignore
                const ssh = useRef<TerminalProps>(null)
                store.setFormRef(newRefName, [ssh])
                child.ref = ssh
            }

        }
    })
}
