const reg = /\$\{(.+?)\}$/
export default function (name: string) {
  name = name.trim()
  const arr = name.match(reg)
  return arr[1]
}
