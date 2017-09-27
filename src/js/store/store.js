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
    let columnLen = columns.length // 这个 Row 里有多少 column
    this.data.rows[id] = {
      columns,
      config: {
        columnLen
      }
    }

    columns.forEach(columnId => {
      this.addColumn(columnId, columnLen) // 循环调用 addColumn 方法（定义在下面）
    })
  }

  // 添加一个 Column
  @action
  addColumn = (columnId, columnLen) => {
    const colSpan = `col-xs-${24 / columnLen}`
    this.data.cols[columnId] = {
      fields: new Array(),
      config: {
        colSpan
      }
    }
  }
}

const store = new Store()

autorun(() => {
  // let _store = toJS(store.data)
  // console.log(JSON.stringify(_store))
  console.log(toJS(store.data))
  alert(1)
})

export default store
