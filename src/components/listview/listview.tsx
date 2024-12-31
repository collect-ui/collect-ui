import React, {memo, useMemo} from "react"
import ScopedRender from "../../utils/scopedRender"
import transferProp from "../../utils/transferProp"
import NoData from "../no-data/no-data"
import {v4 as uuid} from "uuid"
import handlerActions from "../../utils/handlerActions";
import {App} from "antd";
import getVisible from "../../utils/getVisible";

const ItemsWithJoinAttr = ({ itemData, keyField, itemAttr, joinAttr, store, rootStore, rowClick }) => {
  return useMemo(() => {
    return itemData?.reduce((acc, item, index) => {
      const newAttr = { ...itemAttr,
        _target_row: item,
        _target_rowId: item[keyField]
      };
      // 添加当前的 ScopedRender 组件
      acc.push(
          <ScopedRender
              key={keyField ? item[keyField] : uuid()}
              {...newAttr}
              store={store}
              onClick={(e) => rowClick(item)}
              rootStore={rootStore}
          />
      );

      // 如果不是最后一个元素，添加 joinAttr 对应的 ScopedRender 组件
      if (joinAttr && index < itemData.length - 1) {
        const joinAttrCopy = { ...joinAttr };
        const newJoinAttr = {
          _target_row: item,
          _target_rowId: item[keyField] + "_join"
        };
        acc.push(
            <ScopedRender
                key={keyField ? item[keyField] + "_join" : uuid()}
                {...newJoinAttr}
                {...joinAttrCopy}
                store={store}
                rootStore={rootStore}
            />
        );
      }

      return acc;
    }, []);
  }, [itemData, keyField, itemAttr, joinAttr, store, rootStore, rowClick]);
};
const DynamicListView = (props) => {
  const { keyField,rowClickAction, itemAttr, joinAttr, ...rest } = props;
  if(!keyField){
    throw new Error("listview 中 keyField is required");
  }
  const useApp = App.useApp()
  let { itemData, ...newProps } = transferProp(rest, "listview");
  const rowClick=(row)=>{
    if(rowClickAction){
      handlerActions(rowClickAction, props.store, props.rootStore, useApp,{row})
    }

  }
  const show = getVisible(props)
  if(!show) {
    return null
  }
  if (!itemData ||itemData?.length <= 0) {
    return <NoData />;
  }
  return (
    <ItemsWithJoinAttr
        itemData={itemData}
        keyField={keyField}
        itemAttr={itemAttr}
        joinAttr={joinAttr}
        store={rest.store}
        rootStore={rest.rootStore}
        rowClick={rowClick}
    />
)
  // return <React.Fragment>{itemsWithJoinAttr}</React.Fragment>;
};

export default DynamicListView;
