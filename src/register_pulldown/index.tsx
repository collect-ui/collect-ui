import  BasePullDown from "./Base";
export const registerPullDownMap: any = {};
export function getPullDown(name: string) {
    return registerPullDownMap[name];
}
export function setPullDown(name: string, func: any) {
    registerPullDownMap[name] = func;
}

export {
    BasePullDown
}