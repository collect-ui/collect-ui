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
    return pass
}