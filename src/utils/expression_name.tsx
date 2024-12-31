const reg = /\$\{(.+?)\}$/
export default function (name: string) {
  const arr = name.match(reg)
  return arr[1]
}
