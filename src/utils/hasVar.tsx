export default function (name) {
  if (typeof name === "string" && name.indexOf("$") >= 0) {
    return true
  } else {
    return false
  }
}
