import React from 'react';
import { Tag } from 'antd';

const RenderTags = ({ rows, getLabel, getId }) => {
    return rows.map((row) => (
        <Tag key={getId(row)} className="tag" closable>
            {getLabel(row)}
        </Tag>
    ));
};

export default RenderTags;