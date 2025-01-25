import React ,{useEffect} from 'react';
import transferProp from "../../utils/transferProp";
function CssComponent(props){
    const {  ...rest } = props
    let newProps = transferProp(rest, "css")
    useEffect(()=>{
        const link = document.createElement('link');
        link.rel ='stylesheet';
        link.href = newProps.src;
        document.head.appendChild(link);
    },[newProps.src]);
    return null;
}
export default CssComponent;