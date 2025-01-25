import { Form } from "antd"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import getVariablesFromExpression from "../../utils/getVariablesFromExpression"
import expression_name from "../../utils/expression_name";
import React from "react";
export default function (props: any) {
  const { itemVisible,itemDisabled, ...rest } = props
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
  if (itemDisabled) {
    const enableExpression = expression_name(itemDisabled);
    const enableDependencies = getVariablesFromExpression(enableExpression);
    return (
        <Form.Item noStyle dependencies={enableDependencies}>
          {({ getFieldValue }) => {
            const values = getFieldValue();
            const disabled = varValue(itemDisabled, props.store, values);
            // 将 disabled 状态传递给子组件
            const childrenWithProps = React.Children.map(props.children, (child:any) =>
                //@ts-ignore
                React.cloneElement(child, { disabled: disabled })
            );
            return <Form.Item {...newProps}>{childrenWithProps}</Form.Item>;
          }}
        </Form.Item>
    );
  }
  return <Form.Item {...newProps}></Form.Item>
}
