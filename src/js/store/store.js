import { observable, action, autorun, toJS } from 'mobx'

class Store {
  // 定义可观察的数据结构
  @observable
  data = {
    canvas: {
      id: '',
      rows: new Array()
    },
    rows: {},
    cols: {},
    fields: {}
  }

  // 定义方法：

  // 给画布添加 ID
  @action
  addCanvasId = id => {
    this.data.canvas.id = id
  }

  // 添加一个 Row
  @action
  addRow = ({ id, columns }) => {
    this.data.canvas.rows.push(id)
    this.data.rows[id] = {
      columns: columns
    }
    columns.forEach(columnId => {
      this.addColumn(columnId)
    })
  }

  // 添加一个 Column
  @action
  addColumn = columnId => {
    this.data.cols[columnId] = {
      fields: new Array()
    }
  }
}

const store = new Store()

autorun(() => {
  // let _store = toJS(store.data)
  // console.log(JSON.stringify(_store))
  console.log(toJS(store.data))
})

export default store
