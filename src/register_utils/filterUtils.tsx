// 注册函数方法
export const filterMap: any = {};

export function setFilter(name: string, func: any) {
    filterMap[name] = func;
}

export function getFilter(name: string) {
    return filterMap[name];
}

export function getFilterNames() {
    return Object.keys(filterMap);
}