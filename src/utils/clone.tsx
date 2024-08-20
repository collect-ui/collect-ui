export default function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    const arrClone = []
    for (let i = 0; i < obj.length; i++) {
      arrClone[i] = deepClone(obj[i])
    }
    return arrClone
  }

  const objClone = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      objClone[key] = deepClone(obj[key])
    }
  }
  return objClone
}
