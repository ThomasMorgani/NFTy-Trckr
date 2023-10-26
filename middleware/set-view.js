export default ({ route, store }) => {
  //hacky way to track view within components w.o manually hooking into router
  const pathArr = route.path.split('/')
  const [view, subview] = pathArr.slice(1)
  // console.log(pathArr.slice(1))
  // console.log(view)
  // console.log(subview)
  store.dispatch('setView', view)
  store.dispatch('setSubView', subview)
}
