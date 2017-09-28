import { extendObservable, observable, action, autorun, toJS } from 'mobx'
import createDOM from '../common/create_dom'
import clonedeep from 'lodash.clonedeep'

import $ from 'jquery'

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
    // this.data.rows[id] = {
    //   columns,
    //   config: {
    //     columnLen
    //   }
    // }

    extendObservable(this.data.rows, {
      [id]: {
        columns,
        config: {
          columnLen
        }
      }
    })

    columns.forEach(columnId => {
      this.addColumn(columnId, columnLen) // 循环调用 addColumn 方法（定义在下面）
    })
  }

  // 添加一个 Column
  @action
  addColumn = (columnId, columnLen) => {
    const colSpan = `col-xs-${24 / columnLen}`
    // this.data.cols[columnId] = {
    //   fields: new Array(),
    //   config: {
    //     colSpan
    //   }
    // }

    extendObservable(this.data.cols, {
      [columnId]: {
        fields: new Array(),
        config: {
          colSpan
        }
      }
    })
  }

  // 添加一个 Field
  @action
  addField = data => {
    const widgetId = data.id
    const containerId = data.containerId

    const field = {
      name: data.name,
      tag: data.tag,
      attrs: data.attrs,
      config: data.config
    }

    this.data.cols[containerId].fields.push(widgetId)
    extendObservable(this.data.fields, {
      [widgetId]: field
    })
    // this.data = Object.assign({}, deepCopy, this.data)
  }

  // 修改 Field 的属性
  @action
  changeInputText = (attrName, value, widgetId) => {
    this.data.fields[widgetId].config[attrName] = value
    this.data = Object.assign({}, this.data, this.data)

    // extendObservable(this.data.fields[widgetId].config, {
    //   attrName: value
    // })
  }

  // 移除 Field
  @action
  removeField = (fieldId, containerId) => {
    this.data.cols[containerId].fields = []
    delete this.data.fields[fieldId]
  }
}

const store = new Store()

autorun(() => {
  let data = toJS(store.data)

  createDOM(data)

  // $('#fd-canvas').append(dom)
  console.log(data)
})

export default store
