import { extendObservable, observable, action, autorun, toJS } from 'mobx'
import clonedeep from 'lodash.clonedeep'
import assignin from 'lodash.assignin'
import { detailedDiff } from 'deep-object-diff'
import modifyDOM from '../common/modify_dom'

class Store {
  // 定义可观察的数据结构
  @observable
  data = {
    canvas: {
      id: '',
      rows: new Array(),
      name
    },
    rows: {},
    cols: {},
    fields: {}
  }

  _data = {
    canvas: {
      id: '',
      rows: new Array()
    },
    rows: {},
    cols: {},
    fields: {}
  }

  pluginMap = {}

  // 定义方法：

  // 给画布添加 ID
  @action
  addCanvasId = id => {
    this.data.canvas.id = id
  }

  @action
  addCanvasName = name => {
    this.data.canvas.name = name
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

  @action
  removeRow = id => {
    const canvas_rows_idx = this.data.canvas.rows.indexOf(id)
    this.data.canvas.rows.splice(canvas_rows_idx, 1)

    this.data.rows[id].columns.forEach(colId => {
      this.data.cols[colId].fields.forEach(fieldId => {
        delete this.data.fields[fieldId]
      })
      delete this.data.cols[colId]
    })
    delete this.data.rows[id]
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
      config: data.config,
      containerId,
      id: data.id,
      elementRef: data.elementRef,
      type: data.type
    }

    this.data.cols[containerId].fields.push(widgetId)
    extendObservable(this.data.fields, {
      [widgetId]: field
    })
    // this.data = Object.assign({}, deepCopy, this.data)
  }

  // 修改 Field 的属性
  @action
  changeConfig = (config, widgetId) => {
    extendObservable(this.data.fields[widgetId].config, config)
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
  let data = toJS(store.data) // 获取实时数据（after））
  let _data = store._data // 获取参照数据（before）

  let diffInfo = detailedDiff(_data, data) // 前后数据对比，生成 DIFF 结果
  modifyDOM(diffInfo) // 将 DIFF 结果作为参数传入解析函数生成 DOM
  // createDOM(data)
  console.log('数据', data)

  store._data = clonedeep(data) // 深复制当前数据后替换原 before 数据，保证每次 DIFF 对比「这一次」和「前一次」
})

export default store
