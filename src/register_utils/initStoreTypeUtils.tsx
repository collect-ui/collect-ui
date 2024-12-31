// 注册store 类型
export const initStoreTypeMap: any = {};

export function getInitStoreType(name: string) {
    return initStoreTypeMap[name];
}

export function hasInitStoreType(name: string) {
    return !!initStoreTypeMap[name];
}

export function setInitStoreType(name: string, func: any) {
    initStoreTypeMap[name] = func;
}
