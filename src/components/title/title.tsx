import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const {  size,children, ...rest} = props
  const newProps = transferProp(rest, "title")
   if(size){
     newProps.className += ` title-${size}`
   }
   return <div  {...newProps}><div className="title-block"></div>{children}</div>
}
