# 基于 react 的antd 的前端低代码
本项目是一个基于 React 和 Ant Design 的低代码平台，旨在通过配置 JSON 来生成复杂的用户界面和交互逻辑。保留了原始组件的 API 风格，支持通过配置 JSON 来生成目标组件，标签名需要写成 tag，其他属性字段名称保持不变。
## 特点
  1. 保留原始组件风格：通过配置 JSON，保留了原始组件的 API 风格，使得开发者可以轻松地迁移和扩展。
  2. 支持复杂交互：支持通过配置实现复杂的交互逻辑，如表单提交、数据请求、对话框管理等。
  3. 易于扩展：通过定义新的 tag，可以轻松扩展新的组件和功能。
  4. 支持无限层级嵌套

# 如何安装依赖
## 安装collect-ui
```shell
npm i collect-ui
```
## 低代码组件：通过 JSON 配置实现动态页面生成
传统的页面开发方式通常需要编写大量的原生代码，例如：
```html
const App=()=>{
    return (
        <div>
            <label>低代码测试</label>
            <input class="ui-input" placeholder="请输入用户名"/>
        </div>
    )
}
```
而使用低代码组件，可以通过简洁的 JSON 配置实现相同的功能：
```javascript
import { Render } from "collect-ui/src/index"
const config={
    "tag":"div",
    "children":[
        {
            "tag":"label",
            "children":"低代码测试"
        },
        {
            "tag":"input",
            "className":"ui-input",
            "placeholder":"请输入用户名"
        }
    ]
}
const App = () => {
    return <Render {...config}/>
};
```
尽管 JSON 配置看起来可能比原生代码更冗长，但低代码组件的优势在于其灵活性和可维护性。通过后台返回的 JSON 配置，可以轻松实现页面的动态改动和新建，无需深入了解复杂的代码逻辑，从而大大提升了开发效率和灵活性。

# 示例
在 demo 目录下的 App.tsx 文件中，提供了一个用户增删改查的示例。该示例展示了如何通过配置 JSON 来生成一个完整的用户管理界面。

## 示例配置
以下是一个简化的示例配置，展示了如何通过 JSON 配置生成一个输入框组件：
```html
<input placeholder="请输入用户名" style="background:blue" className="ui-input"/>
```
对应配置，只有标签名input 需要写成tag:"input", 其他属性字段名称都不变。

```json
{
    "tag":"input",
    "className":"ui-input",
    "placeholder":"请输入用户名",
    "style":{
        "background":"blue"
    }
}
```
```javascript
import { Render } from "collect-ui/src/index"
const App = () => {
    return <Render {...config}/>
};

```
通过低代码组件的 JSON 配置，我们能够保持原始组件的风味，同时实现动态页面的生成。这种配置方式不仅能够完成原始组件的任何功能，还可以通过前端配置生成，未来甚至可以直接由后台返回。这意味着，一旦后台返回新的配置，页面的改动将无需重新打包，从而极大地提升了开发的灵活性和效率。

例如，tag 中注册的 input 标签实际上是基于 Ant Design 组件的二次封装，这使得我们能够在保持 Ant Design 风格的同时，通过简单的 JSON 配置实现复杂的功能。

### 关键优势：
   1. **保持原始组件风格** ：通过 JSON 配置，保持了原始组件的风格和功能。
   2. **动态页面配置** ：前端配置生成页面，未来可由后台动态返回配置，实现页面的实时更新。
   3. **无需重新打包** ：后台返回的配置更改无需重新打包，极大提升了开发效率和灵活性。
   4. **Ant Design 二次封装** ：通过二次封装的 Ant Design 组件，保持了组件的风格一致性，同时简化了配置过程。

无需重新打包：后台返回的配置更改无需重新打包，极大提升了开发效率和灵活性。

Ant Design 二次封装：通过二次封装的 Ant Design 组件，保持了组件的风格一致性，同时简化了配置过程。
# 如何本项目运行起来
## 安装
```shell
npm i
```
## 运行
``` shell
npm run dev
```


# 用户管理低代码示例
在 demo 目录下的 App.tsx 文件中，我们实现了一个用户管理的低代码示例。该示例展示了如何通过 JSON 配置与后端（使用 Go 语言编写的 collect 低代码后台）进行对接，实现用户的增删改查功能。为了简化演示，我们预先造了一些数据。
![image](https://github.com/user-attachments/assets/b2cee440-b930-45d1-bc7e-a12b03684379)

示例代码在demo文件夹下App.tsx中
