export default function (functionString, jsonParams) {
  try{
    // 提取 JSON 字段的键和值
    const keys = Object.keys(jsonParams)
    const values = Object.values(jsonParams)

    // 使用 Function 构造函数创建一个动态函数
    const dynamicFunction = new Function(...keys, "return " + functionString)

    // 调用动态函数并传递参数
    return dynamicFunction(...values)
  }catch (e){
    console.error(`Error in functionString: ${functionString}, jsonParams: ${JSON.stringify(jsonParams)}`, e)
    return null

  }

}
