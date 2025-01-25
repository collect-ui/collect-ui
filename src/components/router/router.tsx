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
        return <div style={{padding:'40px'}}>{routerList.length}数据加载中...</div>
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