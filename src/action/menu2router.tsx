import { result } from "../types/result"
import {getErrorResult, getResult} from "../utils/result"
import { App } from "antd"
import tree2Array from "../utils/tree2Array"

/**
 *
 *  {
 *           "menu_code": "first",
 *           "menu_name":"简介",
 *           "is_index": "1",
 *           "router_group": "",
 *           "group_path": "/framework",
 *           "group_data": "framework.json",
 *           "data": "framework/home.json",
 *           "url": "/framework/"
 *         },
 *         {
 *           "menu_code": "second",
 *           "menu_name":"安装",
 *           "router_group": "/framework",
 *           "url": "/framework/install",
 *           "data": "framework/install.json"
 *         }
 *         先简单处理一下，将is_index 设置为根路由
 *         在根路由有个framework 分组，最终形成这样一个结构
 *          const router =  [
 *      {
 *        "path": "/",
 *        "redirect": "/framework/"
 *      },
 *      {
 *        "path": "/framework",
 *        "data": "framework.json",
 *       "children": [
 *          {
 *           "path": "/framework/",
 *           "data": "framework/home.json"
 *         },
 *          {
 *            "path": "/framework/install",
 *            "data": "framework/install.json"
 *         },
 *          {
 *            "path": "/framework/layout-fit",
 *            "data": "framework/layout-fit.json"
 *          },
 *          {
 *           "path": "/framework/layout",
 *            "data": "framework/layout.json"
 *          },
 *          {
 *            "path": "/framework/divider",
 *           "data": "framework/divider.json"
 *          },
 *          {
 *            "path": "/framework/user",
 *            "data": "framework/user.json"
 *          },
 *          {
 *           "path": "/framework/role",
 *           "data": "framework/role.json"
 *          }
 *       ]
 *      }
 *    ]
 * 将menu转路由
 * 数组中添加一个子项，item
 * @param api
 * @param storeData
 * @param options
 */
export default async function (
  action: object,
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
): Promise<result> {
  const { from, to } = action
  const menuTree= store.getValue(from)
  const menuList = tree2Array(menuTree)
  // 找都根路由
  const indexRouter = menuList.find(item=>item.is_index==="1")
  if(!indexRouter){
    return getErrorResult("未找到根路由")
  }
  const routerIndex={
    path: "/",
    redirect: indexRouter.url,

  }
  const fullList=[]
  const subList = []
  menuList.filter(item=>item.is_index!=="1" && item.url).forEach(item=>{
    if(item.router_group){// 带框架的路由
      subList.push({
        path:item.url,
        data:item.data
      })
    }else{// 全路由
      fullList.push({
        path:item.url,
        data:item.data
      })
    }

  })
  const newRouter=[
    routerIndex,
    ...fullList,
    {
      path: indexRouter["group_path"],
      data:indexRouter["group_data"],
      children:[
        {
          path:indexRouter["url"],
          data:indexRouter["data"]
        },
        ...subList

      ]
    }
  ]
  store.setValue(to,newRouter)
  return getResult(true)
}
