import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {transferProp} from "../../utils";

const CoderComponent = (props) => {
    const {...rest}=props;
    const newProps =transferProp(rest,"coder")
    return <SyntaxHighlighter  style={tomorrow} className="h100" {...newProps}/>
};
export default CoderComponent;