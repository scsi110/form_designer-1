import { RowBase, ColumnBase } from '../base'

class Row extends RowBase {}
class Column extends ColumnBase {}

class AddRow {
  constructor(cols) {
    this.row = new Row()
    this.rowData = row.transData()

    for (var i = 0; i < cols; i++) {
      let col = new Column()
      let colData = col.transData()
      this.rowData[columns].push(colData)
    }
  }

  transData() {
    return this.rowData
  }
}

// const createLayoutData = cols => {
//   const row = new Row()
//   const rowData = row.transData()

//   for (let i = 0; i < cols; i++) {
//     const col = new column()
//     const colData = col.transData()
//     rowData[columns].push(colData)
//   }

//   return rowData
// }

// const addRow = createLayoutData

export default addRow
