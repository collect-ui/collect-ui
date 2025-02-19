import React from "react"
import getVisible from "../../utils/getVisible";

export default function (props) {
    const show = getVisible(props)
    if(!show) {
        return null
    }
    return (
        <div
            style={{
                position: "relative",
                top: "50%",
                textAlign: "center",
                color: "#999",
                width: "100%"
            }}
        >
            占无数据
        </div>
    )
}
