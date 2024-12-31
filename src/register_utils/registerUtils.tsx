import { observer } from "mobx-react-lite";

export const registerMap: any = {};

export function setRegister(name: string, component: any) {
  registerMap[name] = observer(component);
}

export function getRegister(name: string) {
    return registerMap[name];
}

export function hasRegister(name: string) {
    return !!registerMap[name];
}