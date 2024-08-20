import varnameList from "./varNameList"
export default function (name: string): string {
  const nameList = varnameList(name)
  if (nameList) {
    return nameList[0]
  } else {
    return ""
  }
}
