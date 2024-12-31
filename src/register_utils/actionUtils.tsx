// 注册动作
export const registerActionMap: any = {};

export function getAction(name: string) {
    return registerActionMap[name];
}

export function setAction(name: string, func: Function) {
    registerActionMap[name] = func;
}

export function ajaxAction() {
    return registerActionMap["ajax"];
}