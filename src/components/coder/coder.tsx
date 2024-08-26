import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {transferProp} from "../../utils";
import varValue from "../../utils/varValue";

const CoderComponent = (props) => {
    const {transfer,children,...rest}=props;
    const newProps =transferProp(rest,"coder")
    if (transfer!=false){
        newProps.children = varValue(children,props.store,props._target)
    }else{
        newProps.children=children
    }
    return <SyntaxHighlighter  style={tomorrow} className="h100" {...newProps}/>
};
export default CoderComponent;