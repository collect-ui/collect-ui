import * as espree from "espree"
export default function getVariablesFromExpression(expression) {
  const ast = espree.parse(expression, { ecmaVersion: 2020 })
  const variables = new Set()

  function traverse(node) {
    if (node.type === "VariableDeclaration") {
      node.declarations.forEach((declaration) => {
        if (declaration.id.type === "Identifier") {
          variables.add(declaration.id.name)
        }
      })
    } else if (node.type === "FunctionDeclaration") {
      if (node.id && node.id.type === "Identifier") {
        variables.add(node.id.name)
      }
    } else if (node.type === "Identifier") {
      variables.add(node.name)
    }

    for (let key in node) {
      if (node[key] && typeof node[key] === "object") {
        traverse(node[key])
      }
    }
  }

  // 只遍历顶级作用域
  ast.body.forEach(traverse)

  return Array.from(variables)
}
