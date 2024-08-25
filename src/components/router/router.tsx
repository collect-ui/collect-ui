import transferProp from "../../utils/transferProp";

import {
    createBrowserRouter,
    RouterProvider,
    redirect

} from "react-router-dom"
import Render from "../render/render";
function resolvePath(basePath, relativePath) {
    return basePath+"/"+relativePath;
}
 function handlerRouter(router:any,home:string): any {
    const newList = []
    for (const item of router) {
        const lazy = async () => {
            const p =resolvePath(home,item.data);
            let dataJson=null;
            try{
                dataJson = await import(p)
                dataJson= dataJson.default
            }catch(err){
                console.error(`load router ${p} error`,err)
            }
            return { element:<Render {...dataJson}/>}
        }
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
                    dataJson = await import(p)
                    dataJson= dataJson.default
                }catch(err){
                    console.error(`load router ${p} error`,err)
                }
                return { element:<Render {...dataJson}/>}
            }
            //@ts-ignore
            newItem.lazy=lazy
        }
        if(item.redirect){
            //@ts-ignore
            newItem.loader=() => redirect(item.redirect)
        }
        if(item.children){
            newItem.children=handlerRouter(item.children,home)
        }
        newList.push(newItem)
    }
    return newList

}

export default function(props:any){
    const { router,basename,data_home,...rest } = props
    const newProps = transferProp(rest, "router")
    const list = handlerRouter(router,data_home)
    const  newRouter = createBrowserRouter(list,{
        basename: basename,
    })
    // return <div>test</div>
    return <RouterProvider {...newProps} router={newRouter}></RouterProvider>
}