import { utils } from "../../src/index"
import {Tabs} from "antd"

import React from "react";

export default function(props){
    const {coder}=props
    const CoderShow = utils.ScopedRender
    const tabs = {
        tag:"tabs",
        items:[
            {
                label: "页面预览",
                key:"1",
                children: [
                    coder
                ]
            },
            {
                label:"配置代码",
                key:"2",
                children: [
                    {
                        tag:"coder",
                        className:"h100",
                        language:"javascript",
                        transfer:false,
                        children: JSON.stringify(coder, null, "\t")
                    }
                ]
            }

        ]
    }
    return (
        <CoderShow {...tabs} store={props.store} rootStore={props.rootStore} _target={props._target}/>
       )
}