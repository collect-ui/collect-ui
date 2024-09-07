import transferProp from "../../utils/transferProp"

export default function (props: any) {
    const { ...rest } = props
    const newProps = transferProp(rest, "strong")
    return <strong {...newProps}></strong>
}