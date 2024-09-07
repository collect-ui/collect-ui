import {App, Tabs} from "antd"
import transferProp from "../../utils/transferProp"
import varValue from "../../utils/varValue"
import ScopedRender from "../../utils/scopedRender"
import React, {useCallback, useMemo} from "react";
import varName from "../../utils/varName";
import setStoreValue from "../../utils/setStoreValue";
import handlerActions from "../../utils/handlerActions"
import {v4 as uuid} from "uuid"
import NoData from "../no-data/no-data";

export default function (props: any) {
    const {keyField, action, itemAttr, items, confirm, ...rest} = props
    const store = props.store
    const rootStore = props.rootStore
    const useApp = App.useApp()
    const {itemData, ...newProps} = transferProp(rest, "tabs")
    const onChange = useCallback((activeKey) => {
        if (props.activeKey) {
            // 获取配置激活标签页
            const activeKeyName = varName(props.activeKey)
            setStoreValue(activeKeyName, activeKey, store)
        }
        // 处理动作
        if (action) {
            // 延迟处理是为了页面的表单还没有生成，appendFormFields请求发送出错。先等页面处理完成
            // 相当于vue $nextTick
            setTimeout(() => {
                handlerActions(action, store, rootStore, useApp)
            }, 0)

        }

    }, [])
    const itemsMemo = useMemo(() => {
        if (items) {// 直接传items 的模式
            return items.map(({key, ...item}) => {
                return {
                    ...item,
                    key,
                    children: (
                        <ScopedRender
                            tag="layout-fit"
                            {...item}
                            store={props.store}
                            rootStore={props.rootStore}
                            _target={props._target}
                        />
                    )
                }
            })
        }
        if (!keyField) {
            throw new Error("tabs 中 keyField is required");
        }
        const arr= itemData.reduce((acc, item, index) => {
            const newAttr = {
                ...itemAttr,
                store:props.store,
                rootStore:props.rootStore,
                _target_row: item,
                _target_rowIndex: index,
                _target_rowId: item[keyField]
            };
            // 添加当前的 ScopedRender 组件
            const newItemProps = transferProp(newAttr,"tabs-item",useApp)
            acc.push(
                {
                    ...newItemProps,
                    key: keyField ? item[keyField] : uuid(),
                    children: (
                        <ScopedRender
                            tag="layout-fit"
                            {...newAttr}
                        />
                    )
                }
            );
            return acc;
        }, [])
        return arr

    }, [itemData, items, itemAttr, rest.store, rest.rootStore])
    if(itemsMemo.length <= 0){
        return <NoData/>
    }
    return (
        <>
            <Tabs
                {...newProps}
                onChange={onChange}
                items={itemsMemo}
            />
        </>
    )
}
