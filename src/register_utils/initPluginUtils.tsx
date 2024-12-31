// 注册执行

export const initPluginMap: any = {};

export function hasInitPlugin(name: string) {
    return !!initPluginMap[name];
}

export function getInitPlugin(name: string) {
    return initPluginMap[name];
}

export function setInitPlugin(name: string,component: any) {
    return initPluginMap[name]=component;
}