import {App, Upload} from "antd"
import React, {  useCallback } from 'react';
import transferProp from "../../utils/transferProp"
import getVisible from "../../utils/getVisible";
import {Api, ApiObject} from "../../types/api";
import {toApiObj} from "../../utils";
import varValue from "../../utils/varValue";
import handlerActions from "../../utils/handlerActions";
export default function (props: any) {
    const { finish_action,uploadConfig,visible,...rest } = props
    const {...newProps }= transferProp(rest, "upload")
    const useApp = App.useApp()
    const show = getVisible(props)
    if(!show) {
        return null
    }
    const apiObj: ApiObject = toApiObj(uploadConfig.api as Api)

    let formValue = {}
    // 平均api 的data
    if (apiObj.data) {
        for (let key in apiObj.data) {
            formValue[key] = apiObj.data[key]
        }
    }
    if (uploadConfig.data) {
        for (let key in uploadConfig.data) {
            const value = uploadConfig.data[key]
            formValue[key] = varValue(value, props.store, newProps.target)
        }
    }
    const handleChange = useCallback((info) => {

        if (info.file.status === 'done') {
            console.log('上传成功后的返回数据:', info.file.response);
            if (finish_action) {
                handlerActions(finish_action, props.store, props.rootStore, useApp, {row:info.file.response})
            }
        } else if (info.file.status === 'error') {
            useApp?.message?.error(`${info.file.name} 文件上传失败`);
        }
    }, []);
    return <Upload  {...newProps} {...uploadConfig}  onChange={handleChange} name="file" action={apiObj.url} data={(file)=>{return formValue}}></Upload>
}
