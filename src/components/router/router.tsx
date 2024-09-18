import transferProp from "../../utils/transferProp";

import {
    createBrowserRouter,
    RouterProvider,
    redirect, createHashRouter

} from "react-router-dom"
import ScopedRender from "../../utils/scopedRender";
function resolvePath(basePath, relativePath) {
    return basePath+"/"+relativePath;
}
 function handlerRouter(router:any,home:string,store:any,rootStore:any): any {
    const newList = []
    for (const item of router) {
        const newItem = {
            lazy: undefined,
            loader:undefined,
            ...item,
            
            children:[],
            // lazy
        }
        if (item.data){
            const lazy = async () => {
                const p =resolvePath(home,item.data);
                let dataJson=null;
                try{
                    const response = await fetch(p)
                    dataJson = await response.json();
                }catch(err){
                    console.error(`load router ${p} error`,err)
                }
                return { element:<ScopedRender {...dataJson} store={store} rootStore={rootStore}/>}
            }
            //@ts-ignore
            newItem.lazy=lazy
        }
        if(item.redirect){
            //@ts-ignore
            newItem.loader=() => redirect(item.redirect)
        }
        if(item.children){
            newItem.children=handlerRouter(item.children,home,store,rootStore)
        }
        newList.push(newItem)
    }
    return newList

}

export default function(props:any){
    const {hash,basename,data_home,...rest } = props
    const {router,...newProps} = transferProp(rest, "router")
    const routerList = props.store.router
    console.log(routerList)
    if (router.length<=0){
        return <div style={{padding:'40px'}}>{routerList.length}数据加载中...</div>
    }
    const list = handlerRouter(router,data_home,props.store,props.rootStore)
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