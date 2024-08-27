import { types } from "mobx-state-tree"
const routeTab = types.model("RootTab", {
  key: types.string,
  path: types.string,
  name: types.string,
})
const Root = types
  .model("RootStore", {
    currentRouterPath: "",
    routerTabs: types.array(routeTab),
    storeMap: types.optional(types.frozen(), {}),
  })
  .views((self) => {
    return {
      getValue(key: string) {
        return self[key]
      },
      // 获取当前激活的tab
      activeTab() {
        return self.routerTabs.find(
          (item) => item.path === self.currentRouterPath,
        )
      },
      // 根据key 获取路由标签
      getRouterTabByKey(key) {
        return self.routerTabs.find((item) => item.key === key)
      },
      // 根据path 获取路由标签
      getRouterTabByPath(path) {
        return self.routerTabs.find((item) => item.path === path)
      },
      // 获取store
      getStore(name) {
        return self.storeMap[name] ?? null
      },

    }
  })
  .actions((self) => {
    return {
      getValue(key: string) {
        return self[key]
      },
      // 设置store
      setStore(name, store) {
        self.storeMap = { ...self.storeMap, [name]: store }
      },
      removeRouterTab(key){
        // 删除之前先获取数据
        let currentRemove = self.getRouterTabByKey(key)
        // 执行删除并且获取下标
        let index=0
        for(let i=0;i<self.routerTabs.length;i++){
          if(self.routerTabs[i].key===key){
            index=i
            self.routerTabs.splice(i,1)
            break
          }
        }
        //todo 清理keepalive 的数据
       // 如果删除的数据，正好是当前数据，则下标前移一位
        let  current=null
        if (currentRemove.path==self.currentRouterPath){
          // 往前移动一位
          index=index-1
          // 前面没有，则是第一个
          if(index<0){
            index=0
          }
          current = self.routerTabs[index]
          //设置当前路由
          self.currentRouterPath = current.path
        }
        return current

      },
      addRouterTab(tab) {
        let path = tab.path
        if(self.currentRouterPath==path){
          return
        }
        let hasTab = false
        self.routerTabs.forEach((item) => {
          if (item.path === path) {
            hasTab = true
          }
        })
        if (!hasTab) {
          const newTab = routeTab.create({ ...tab })
          self.routerTabs = [...self.routerTabs, newTab]
        }
        self.currentRouterPath = path
      },
    }
  })
export default Root
