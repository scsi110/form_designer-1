import $ from 'jquery'
import { RowBase, ColumnBase } from '../base'
import store from '../../store/store'
import bindColEvent from '../../common/precedure/events/col_event'
import { rowInfo } from '../dom/dom.js'

class Row extends RowBase {}
class Column extends ColumnBase {}

class AddRow {
  constructor(cols, canvas) {
    this.row = new Row()
    this.rowData = this.row.transData()

    for (var i = 0; i < cols; i++) {
      let col = new Column()
      let colData = col.transData()
      this.rowData['columns'].push(colData.id)
    }

    this.createDOM(cols, canvas)
  }

  createDOM(colNum, container) {
    let curRow = bindColEvent(rowInfo[colNum]) // 给 column 绑定事件
    curRow.data('id', this.row.id) // 在 DOM 标签上绑定 Row ID
    container.append(curRow) // 生成 DOM 元素并添加到页面
    store.addRow(this.rowData) // 更新数据
  }
}

export default AddRow
