import varValue from "./varValue";
import genTarget from "./genTarget";

export default function (props:any){
    const { visible } = props
    if (visible) {
        const show = varValue(visible, props.store, genTarget(props))
        if (!show) {
            return false
        }
    }
    return true
}