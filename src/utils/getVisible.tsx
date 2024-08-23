import varValue from "./varValue";

export default function (props:any){
    const { visible } = props
    if (visible) {
        const show = varValue(visible, props.store, props["_target"])
        if (!show) {
            return false
        }
    }
    return true
}