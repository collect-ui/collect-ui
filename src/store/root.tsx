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
      // 设置store
      setStore(name, store) {
        self.storeMap = { ...self.storeMap, [name]: store }
      },

      addRouterTab(tab) {
        let path = tab.path
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
