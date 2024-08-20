import { Form, Input } from "antd"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import getVariablesFromExpression from "../../utils/getVariablesFromExpression"
import expression_name from "../../utils/expression_name";
export default function (props: any) {
  const { itemVisible, ...rest } = props
  let newProps = transferProp(rest, "form-item")
  if (itemVisible) {
    const expression = expression_name(itemVisible)
    const dependencies = getVariablesFromExpression(expression)
    return (
      <Form.Item noStyle dependencies={dependencies}>
        {({ getFieldValue }) => {
          const values = getFieldValue()
          const show = varValue(itemVisible, props.store, values)
          if (!show) {
            return null
          }
          return <Form.Item {...newProps}></Form.Item>
        }}
      </Form.Item>
    )
  }
  return <Form.Item {...newProps}></Form.Item>
}
