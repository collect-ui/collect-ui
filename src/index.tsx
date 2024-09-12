// 组件样式
import "./scss/index.scss"
import Render from "./components/render/render"
import {observer} from "mobx-react-lite"
import utils from "./utils/index"
// 扫描filter
const filterContext: any = import.meta.glob("./filter/**/*.tsx", {
    eager: true,
})
// 扫描组件
const componentContext: any = import.meta.glob("./components/**/*.tsx", {
    eager: true,
})
// 扫描store
const storeContext: any = import.meta.glob("./store/**/*.tsx", {
    eager: true,
})
// 扫描action
const actionContext: any = import.meta.glob("./action/**/*.tsx", {
    eager: true,
})

// 扫描action
const initContext: any = import.meta.glob("./init-plugin/**/*.tsx", {
    eager: true,
})

const registerMap: any = {}
const registerStoreMap: any = {}
const registerActionMap: any = {}
const initPluginMap: any = {}
const initStoreTypeMap: any = {}
const filterMap: any = {}
const pascal2Kebab = (str: string) =>
    str
        .replace(/([a-z])([A-Z])/g, ($, $1, $2) => $1 + "-" + $2.toLowerCase())
        .replace(/^([A-Z])/, ($, $1) => $1.toLowerCase())
// 处理组件
for (const item in filterContext) {
    let filename = item.substring(item.lastIndexOf("/") + 1)
    let frame = filename.substring(0, filename.indexOf("."))
    // 注册模板函数
    setFilter(frame, filterContext[item].default)
}// 处理组件
for (const item in componentContext) {
    let filename = item.substring(item.lastIndexOf("/") + 1)
    let frame = filename.substring(0, filename.indexOf("."))
    const name = pascal2Kebab(frame)
    // 注册组件名称
    setRegister(name, componentContext[item].default)
}
//处理store
for (const item in storeContext) {
    let filename = item.substring(item.lastIndexOf("/") + 1)
    let frame = filename.substring(0, filename.indexOf("."))
    const name = pascal2Kebab(frame)
    // 注册store名称
    registerStoreMap[name] = storeContext[item].default

}
// 处理action
for (const item in actionContext) {
    let filename = item.substring(item.lastIndexOf("/") + 1)
    let frame = filename.substring(0, filename.indexOf("."))
    const name = pascal2Kebab(frame)
    // 注册动作名称
    setAction(name, actionContext[item].default)
}
// 处理init 函数
for (const item in initContext) {
    let filename = item.substring(item.lastIndexOf("/") + 1)
    let frame = filename.substring(0, filename.indexOf("."))
    const name = pascal2Kebab(frame)
    // 注册init 函数
    initPluginMap[name] = initContext[item].default
}

/**
 *  获取组件
 * @param name
 */
function getRegister(name: string) {
    return registerMap[name]
}

/**
 * 判断是否有组件
 * @param name
 */
function hasRegister(name: string) {
    return !!registerMap[name]
}

/**
 * 设置组件
 * @param name
 * @param component
 */
function setFilter(name: string, func: any) {
    filterMap[name] = func
}

/**
 * 设置组件
 * @param name
 * @param component
 */
export function setRegister(name: string, component: any) {
    registerMap[name] = observer(component)
}

/**
 * 获取模板函数
 * @param name
 * @param component
 */
export function getFilter(name: string) {
    return filterMap[name]
}
export function getFilterNames(){
  return Object.keys(filterMap)
}

/**
 * 判断是否store
 * @param name
 */
function hasStore(name: string) {
    return !!registerStoreMap[name]
}

/**
 * 获取store
 * @param name
 */
function getStore(name: string) {
    return registerStoreMap[name]
}

function hasInitPlugin(name: string) {
    return !!initPluginMap[name]
}

/**
 * 获取初始化的方法
 * @param name
 */
function getInitPlugin(name: string) {
    return initPluginMap[name]
}

export function getAction(name: string) {
    return registerActionMap[name]
}

export function setAction(name: string, func: Function) {
    registerActionMap[name] = func
}

export function ajaxAction() {
    return registerActionMap["ajax"]
}

export function getInitStoreType(name: string) {
    return initStoreTypeMap[name]
}

export function setInitStoreType(name: string, type: any) {
    initStoreTypeMap[name] = type
}

export default {
    getRegister,
    hasRegister,
    hasStore,
    getStore,
    ajaxAction,
    Render,
    utils,

}
export {
    getRegister,
    hasRegister,
    getStore,
    hasStore,
    hasInitPlugin,
    getInitPlugin,
    Render,
    utils,
}
