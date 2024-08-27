import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {transferProp} from "../../utils";
import varValue from "../../utils/varValue";

const CoderComponent = (props) => {
    const {transfer,value,children,...rest}=props;

    const newProps =transferProp(rest,"coder")
    if (transfer!=false){// 如果不转义
        if (value){// 取value
            newProps.children=JSON.stringify(value,null,"\t")
        }else{
            newProps.children = varValue(children,props.store,props._target)
        }
    }else{
        // json 处理一下

        newProps.children=children

    }
    return <SyntaxHighlighter  style={tomorrow} className="h100" {...newProps}/>
};
export default CoderComponent;