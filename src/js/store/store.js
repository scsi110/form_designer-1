import { observable, action, autorun, toJS } from 'mobx'

class Store {
  @observable
  data = {
    canvas: {
      id: '',
      rows: []
    },
    rows: {},
    cols: {},
    fields: {}
  }

  @action // 给画布添加 ID
  addCanvasId = id => {
    this.data.canvas.id = id
  }
}

const store = new Store()

autorun(() => {
  let _store = toJS(store.data)
  console.log(JSON.stringify(_store))
})

export default store
