// 这个可能不需要了，过时的产物，动态配置initStore,就行
export const registerStoreMap: any = {};

export function getStore(name: string) {
    return registerStoreMap[name];
}

export function hasStore(name: string) {
    return !!registerStoreMap[name];
}

export function setStore(name: string, func: any) {
    registerStoreMap[name] = func;
}
