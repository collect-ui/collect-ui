import { types, flow } from "mobx-state-tree"
const routerType = types.model("router",{
    name: types.string,
    path: types.string,
})
const App = types
  .model("AppStore", {
    data: types.optional(types.frozen(), {}),
    state: "",
    loading: false,
    currentRouter: types.safeReference(routerType,{}) ,
  })
  .views((self) => {
    return {}
  })
  .actions((self) => {
    return {
      setCurrentRouter(router) {
        self.currentRouter = routerType.create(router)
        // self.currentRouter = router
      },
    }
  })
export default App
