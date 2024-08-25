import transferProp from "../../utils/transferProp"


export default function (props: any) {
    const { ...rest } = props

    const newProps = transferProp(rest, "ol")
    return <ol {...newProps}></ol>
}