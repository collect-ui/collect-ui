// src/demo/App.js
import React from 'react';
import { Render } from "../src/index"
// const config={
//     "tag":"div",
//     "children":[
//         {
//             "tag":"label",
//             "children":"低代码测试"
//         },
//         {
//             "tag":"input",
//             "className":"ui-input",
//             "placeholder":"请输入用户名"
//         }
//     ]
// }
const config={
    tag: "app",
    className: "home-page",
    children: [
        {tag:"h1",children:" Collect UI Demo"},
        {"tag":"div",children:["这个是一个低代码示例"]},
        {
            tag: "layout-fit",
            style:{
                height:"400px"
            },
            initStore: {
                dialogVisible: false,
                // 操作类型
                op: "add",
                user_id_list: [],
                role_list: [],
                selection: [],
                searchForm: {
                    page: 1,
                    size: 20,
                    search: "",
                    role_id_list: [],
                },
                opForm: {
                    password: "A123456!",
                    status: "trial",
                    create_ldap: "1",
                    role_id_list: ["common"],
                },
                count: 0,
                dataList: [{user_id:"1",create_time:"",entry_date:"",role_names:"普通用户",email:"18874948657@163.com",nick:"张三",status_text:"正常",username:"test","work_code":"001",create_ldap:"1"}]
            },
            // initAction: [
            //     {
            //         tag: "ajax",
            //         group: "dataList",
            //         description: "页面初始化请求",
            //         api: "post:/template_data/data?service=hrm.user_list",
            //         appendFormFields: "user-form",
            //         appendFields: "${searchForm}",
            //         adapt: {
            //             dataList: "${data}",
            //             count: "${count}",
            //         },
            //     },
            //     {
            //         tag: "ajax",
            //         description: "加载角色",
            //         api: "post:/template_data/data?service=hrm.role_query",
            //         adapt: {
            //             role_list: "${data}",
            //         },
            //     },
            // ],
            children: [
                {
                    tag: "table",
                    selection: "${selection}",
                    rowSelection: "multiple",
                    columnDefs: [
                        {
                            headerName: "#",
                            width: 60,
                            valueGetter: "node.rowIndex + 1",
                            sortable: false,
                            pinned: "left",
                        },
                        {
                            pinned: "left",
                            checkboxSelection: true,
                            headerCheckboxSelection: true,
                            headerName: "账号",
                            field: "username",
                        },
                        {
                            headerName: "工号",
                            field: "work_code",
                        },
                        {
                            headerName: "昵称",
                            field: "nick",
                        },
                        {
                            headerName: "状态",
                            field: "status_text",
                        },
                        {
                            headerName: "角色",
                            field: "role_names",
                        },
                        {
                            headerName: "创建LDAP",
                            field: "create_ldap",
                            cellRender: {
                                tag: "icon",
                                visible: "${create_ldap==='1'}",
                                icon: "FaCheck",
                                color: "green",
                            },
                        },
                        {
                            headerName: "邮箱",
                            field: "email",
                        },
                        {
                            headerName: "入职时间",
                            field: "entry_date",
                        },
                        {
                            headerName: "创建时间",
                            field: "create_time",
                        },
                        {
                            headerName: "操作",
                            field: "op",
                            cellRender: [
                                {
                                    tag: "button",
                                    action: [
                                        {
                                            tag: "update-store",
                                            value: {
                                                dialogVisible: true,
                                                op: "edit",
                                            },
                                        },
                                        {
                                            tag: "reset-form",
                                            formName: "opForm",
                                        },
                                        {
                                            tag: "update-form",
                                            formName: "opForm",
                                            value: "${row}",
                                        },
                                    ],
                                    type: "primary",

                                    size: "small",
                                    children: "编辑",
                                },
                                {
                                    tag: "button",
                                    danger: true,
                                    size: "small",
                                    children: ["删除"],
                                    confirm: {
                                        title: "确认删除吗？",
                                        description:
                                            "${'确认删除【'+row.nick+'（'+row.username+'）】记录吗？'}",
                                    },
                                    action: [
                                        {
                                            tag: "ajax",
                                            description: "删除用户",
                                            api: "post:/template_data/data?service=hrm.delete_user_by_user_id_list",
                                            data: {
                                                user_id_list: "${[row.user_id]}",
                                            },
                                        },
                                        {
                                            tag: "reload-init-action",
                                            group: "dataList",
                                            description: "页面初始化请求",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    rowData: "${dataList}",
                },
                {
                    tag: "dialog",
                    title: "${op=='add'?'新增用户':'修改用户'}",
                    width: "50%",
                    open: "${dialogVisible}",
                    action: [
                        {
                            tag: "submit-form",
                            description: "提交表单",
                            formName: "opForm",
                        },
                        {
                            tag: "ajax",
                            enable: "${op=='add'}",
                            description: "新增发送请求到后端",
                            api: "post:/template_data/data?service=hrm.create_user_flow",
                            appendFormFields: "opForm",
                        },
                        {
                            tag: "ajax",
                            enable: "${op=='edit'}",
                            description: "修改发送请求到后端",
                            api: "post:/template_data/data?service=hrm.edit_user_flow",
                            appendFormFields: "opForm",
                            data: {
                                user_id: "${selection[0].user_id}",
                            },
                        },
                        {
                            tag: "update-store",
                            description: "关闭对话框",
                            value: {
                                dialogVisible: false,
                            },
                        },
                        {
                            tag: "reload-init-action",
                            group: "dataList",
                            description: "页面初始化请求",
                        },
                    ],
                    children: [
                        {
                            tag: "form",
                            name: "opForm",
                            initialValues: "${opForm}",
                            valueRule: {},
                            labelCol: { span: 4 },
                            children: [
                                {
                                    tag: "row",
                                    children: [
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "nick",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入昵称!",
                                                        },
                                                    ],
                                                    label: "昵称",
                                                    children: [
                                                        {
                                                            tag: "input",
                                                            placeholder: "请输入昵称",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "work_code",
                                                    className: "center",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入工号!",
                                                        },
                                                    ],
                                                    label: "工号",
                                                    children: [
                                                        {
                                                            className: "login-input",
                                                            tag: "input",
                                                            placeholder: "请输入工号",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    tag: "row",
                                    children: [
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "username",

                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入登录名!",
                                                        },
                                                    ],
                                                    label: "登录名",
                                                    children: [
                                                        {
                                                            tag: "input",
                                                            placeholder: "请输入姓名",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "password",

                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入密码!",
                                                        },
                                                    ],
                                                    label: "密码",

                                                    children: [
                                                        {
                                                            tag: "input",
                                                            disabled: "${op=='edit'}",
                                                            showPassword: true,
                                                            placeholder: "请输入密码",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    tag: "row",
                                    children: [
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "email",

                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入公司邮箱!",
                                                        },
                                                    ],
                                                    label: "公司邮箱",
                                                    children: [
                                                        {
                                                            tag: "input",
                                                            placeholder: "请输入公司邮箱",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "status",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请选择状态!",
                                                        },
                                                    ],
                                                    label: "状态",
                                                    children: [
                                                        {
                                                            tag: "select",
                                                            placeholder: "请选择状态",
                                                            options: [
                                                                { value: "trial", label: "试用" },
                                                                { value: "normal", label: "正式" },
                                                                { value: "leave", label: "离职" },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    tag: "row",
                                    children: [
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "entry_date",

                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请选择入职时间!",
                                                        },
                                                    ],
                                                    label: "入职时间",
                                                    children: [
                                                        {
                                                            tag: "date",
                                                            format: "YYYY-MM-DD",
                                                            valueFormat: "YYYY-MM-DD",
                                                            placeholder: "请选择入职时间",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "phone",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入联系方式!",
                                                        },
                                                    ],
                                                    label: "联系方式",
                                                    children: [
                                                        {
                                                            tag: "input",
                                                            placeholder: "请输入联系方式",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    tag: "row",
                                    children: [
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "create_ldap",
                                                    label: "创建Ldap",
                                                    children: [
                                                        {
                                                            tag: "switch",
                                                            activeValue: "1",
                                                            inactiveValue: "0",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    tag: "row",
                                    children: [
                                        {
                                            tag: "col",
                                            span: 12,
                                            children: [
                                                {
                                                    tag: "form-item",
                                                    name: "role_id_list",
                                                    label: "角色",
                                                    children: [
                                                        {
                                                            tag: "select",
                                                            placeholder: "请选择角色",
                                                            mode: "multiple",
                                                            fieldNames: {
                                                                label: "role_name",
                                                                value: "role_code",
                                                            },
                                                            labelRender: "${label+'['+value+']'}",
                                                            optionRender: "${role_name+'['+role_code+']'}",
                                                            options: "${role_list}",
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            title: "用户管理",
            topRight: [
                {
                    tag: "button",
                    type: "primary",
                    children: "新增",
                    icon: "FaPlus",
                    action: [
                        {
                            tag: "update-store",
                            value: {
                                dialogVisible: true,
                                op: "add",
                            },
                        },
                        {
                            tag: "reset-form",
                            formName: "opForm",
                        },
                    ],
                },

                {
                    tag: "button",
                    action: [
                        {
                            tag: "update-store",
                            value: {
                                dialogVisible: true,
                                op: "edit",
                            },
                        },
                        {
                            tag: "reset-form",
                            formName: "opForm",
                        },
                        {
                            tag: "update-form",
                            formName: "opForm",
                            value: "${selection[0]}",
                        },
                    ],
                    disabled: "${selection.length !=1 }",
                    children: "编辑",
                    icon: "FaPencilAlt",
                },
                {
                    tag: "button",
                    disabled: "${selection.length <=0 }",
                    type: "primary",
                    confirm: {
                        title: "确认删除吗？",
                        description:
                            "${'确认删除【'+selection.map(item=>item.nick+'（'+item.username+'）').join(',')+'】'+selection.length+'记录吗？'}",
                    },
                    danger: true,
                    action: [
                        {
                            tag: "ajax",
                            description: "删除用户",
                            api: "post:/template_data/data?service=hrm.delete_user_by_user_id_list",
                            data: {
                                user_id_list: "${selection.map(item=>item.user_id)}",
                            },
                        },
                        {
                            tag: "reload-init-action",
                            group: "dataList",
                            description: "页面初始化请求",
                        },
                    ],
                    children: "删除",
                    icon: "FaTrashAlt",
                },
            ],
            searchToolBar: [
                {
                    tag: "form",
                    name: "user-form",
                    initialValues: "${searchForm}",
                    labelCol: { span: 4 },
                    wrapperCol: { span: 19 },
                    action: [
                        {
                            tag: "reload-init-action",
                            group: "dataList",
                            description: "页面初始化请求",
                        },
                    ],
                    submitOnChange: true,
                    children: [
                        {
                            tag: "row",
                            children: [
                                {
                                    tag: "col",
                                    span: 5,
                                    children: [
                                        {
                                            tag: "form-item",
                                            name: "search",
                                            label: "搜索",

                                            children: [
                                                {
                                                    tag: "input",
                                                    placeholder: "账号/用户名",
                                                    allowClear: true,
                                                },
                                            ],
                                        },
                                    ],
                                },

                                {
                                    tag: "col",
                                    span: 6,
                                    children: [
                                        {
                                            tag: "form-item",
                                            name: "role_id_list",
                                            label: "角色",
                                            children: [
                                                {
                                                    tag: "select",
                                                    placeholder: "请选择角色",
                                                    mode: "multiple",
                                                    allowClear: true,
                                                    fieldNames: {
                                                        label: "role_name",
                                                        value: "role_code",
                                                    },
                                                    labelRender: "${label+'['+value+']'}",
                                                    optionRender: "${role_name+'['+role_code+']'}",
                                                    // optionRender: {
                                                    //   tag: "label",
                                                    //   children: ["test"],
                                                    // },
                                                    options: "${role_list}",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    tag: "col",
                                    span: 3,
                                    children: [
                                        {
                                            tag: "button",
                                            action: [
                                                {
                                                    tag: "reload-init-action",
                                                    group: "dataList",
                                                    description: "页面初始化请求",
                                                },
                                            ],
                                            type: "primary",
                                            children: "搜索",
                                            icon: "FaSearch",
                                        },
                                        {
                                            tag: "button",
                                            action: [
                                                {
                                                    tag: "reset-form",
                                                    formName: "user-form",
                                                },
                                                {
                                                    tag: "reload-init-action",
                                                    group: "dataList",
                                                    description: "页面初始化请求",
                                                },
                                            ],
                                            icon: "FaUndo",
                                            children: "重置",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            bottomAlign: "right",
            bottomToolBar: [
                {
                    tag: "pagination",
                    showSizeChanger: true,
                    pageSize: "${searchForm.size}",
                    current: "${searchForm.page}",
                    total: "${count}",
                    showTotal: true,
                },
            ],
        }
    ],
}
const App = () => {
    return <Render {...config}/>
};

export default App;