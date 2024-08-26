import transferProp from "../../utils/transferProp"
import { useOutlet } from "react-router-dom"
import KeepAlive from "../../common/KeepAlive"
import {useMemo, useRef} from "react";
export default function (props: any) {
  const { ...rest } = props
  const Outlet = useOutlet()
  const newProps = transferProp(rest, "outlet")
  const urls = useMemo(()=>{
    let l  = ['*']
    console.log(props.rootStore)
    return l
  },[props.rootStore])
  const include=props.rootStore.routerTabs.map(item=>item.path)
  return <KeepAlive {...newProps} include={include}   >{Outlet}</KeepAlive>
}
