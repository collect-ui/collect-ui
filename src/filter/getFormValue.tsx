export default (formName, fieldName,store)=>{
    const [form] = store.getFormRef(formName)
    return form.getFieldValue(fieldName)
}
