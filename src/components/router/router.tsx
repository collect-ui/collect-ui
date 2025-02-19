import transferProp from "../../utils/transferProp";

import {
    createBrowserRouter,
    RouterProvider,
    redirect, createHashRouter

} from "react-router-dom"
import ScopedRender from "../../utils/scopedRender";
import {ajaxAction} from "../../register_utils/actionUtils";
import {App} from "antd";
function resolvePath(basePath, relativePath) {
    return basePath+"/"+relativePath;
}
 function handlerRouter(router:any,home:string,store:any,rootStore:any,useApp:any): any {
     const ajax = ajaxAction()
    const newList = []
    for (const item of router) {
        const newItem = {
            lazy: undefined,
            loader:undefined,
            ...item,
            
            children:[],
            // lazy
        }
        if (item.data||item.api){

            const lazy = async () => {
                const p =resolvePath(home,item.data);
                let dataJson=null;
                if (item.api){
                    const action={api:item.api}
                    const data = await ajax(action, store, rootStore,useApp)
                    dataJson = data.data
                }else{
                    try{
                        const response = await fetch(p)
                        dataJson = await response.json();
                    }catch(err){
                        console.error(`load router ${p} error`,err)
                    }
                }
                //@ts-ignore
                const menu_code = item.menu_code
                return { element:<ScopedRender {...dataJson} store={store} rootStore={rootStore} namespace={menu_code}/>}
            }
            //@ts-ignore
            newItem.lazy=lazy
        }
        if(item.redirect){
            //@ts-ignore
            newItem.loader=() => redirect(item.redirect)
        }
        if(item.children){
            newItem.children=handlerRouter(item.children,home,store,rootStore,useApp)
        }
        newList.push(newItem)
    }
    return newList

}

export default function(props:any){
    const {hash,basename,data_home,...rest } = props
    const {router,...newProps} = transferProp(rest, "router")
    const routerList = props.store.router
    const useApp = App.useApp()
    if (router.length<=0){
        return <div
            style={{
                padding: '400px 0px 0px',
                backgroundColor: '#f0f4f8', // 添加背景色
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 添加阴影
                color: '#333', // 文字颜色
                fontSize: '18px', // 字体大小
                fontWeight: '500', // 字体粗细
                textAlign: 'center', // 文字居中
                border: '1px solid #e0e0e0', // 边框
                transition: 'all 0.3s ease', // 添加过渡效果
                height: "100%",
            }}
        >
            路由数量【{routerList.length}】数据加载中...
        </div>
    }
    const list = handlerRouter(router,data_home,props.store,props.rootStore,useApp)
    let  newRouter =null
    if(hash){
        newRouter = createHashRouter(list,{
            // basename: basename,
        })
    }else{
        newRouter = createBrowserRouter(list,{
            basename: basename,
        })
    }
    // return <div>test</div>
    return <RouterProvider {...newProps} router={newRouter}></RouterProvider>
}