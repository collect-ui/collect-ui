/*还原varName*/
export default function (name: string, secondName?: string): string {
  if (secondName) {
    name += "." + secondName
  }
  return "${" + name + "}"
}
