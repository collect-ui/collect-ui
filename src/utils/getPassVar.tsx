/**
 * 透传的变量
 * @param props
 */
export default function get_pass_vars(props){
    const pass={}
    // 以_target 开头的变量名称透传
    for(let key in props){
        if(key.startsWith("_target_")){
            pass[key]=props[key]
        }
    }
    // 全局传递namespace ，目前在router组件传的menu_code
    // 主要影响表单命名，因为antd的表单只要命名name 就会根据name 元素生成一个id 。一个页面还好，但是多个页面id会报id 重复
    // store也是一样的。不同页面storeName 名称重复了，导致数据串了。典型的是树点击出发，表格store变化。然后后面
    // 都是复制数据，导致store重复
    if (props?.namespace){
        pass.namespace=props.namespace
    }
    return pass
}