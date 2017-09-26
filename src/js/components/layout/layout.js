import { RowBase, ColumnBase } from '../base'
import store from '../../store/store'

class Row extends RowBase {}
class Column extends ColumnBase {}

class AddRow {
  constructor(cols) {
    this.row = new Row()
    this.rowData = this.row.transData()

    for (var i = 0; i < cols; i++) {
      let col = new Column()
      let colData = col.transData()
      this.rowData['columns'].push(colData.id)
    }
    store.addRow(this.rowData)
  }
  getRowId() {
    return this.row.id
  }
}

export default AddRow
