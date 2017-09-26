import bindColEvent from './col_event'
import AddRow from '../../../components/layout/layout'
import {
  column_one,
  column_two,
  column_three
} from '../../../components/dom/dom'

const rowInfo = {
  1: column_one,
  2: column_two,
  3: column_three
}

const rowHandler = (rowNum, container) => {
  const row = new AddRow(rowNum) // 实例化对象
  const rowId = row.getRowId() // 获取 Row 的 ID
  let columnOne = bindColEvent(rowInfo[rowNum]) // 给 column 绑定事件
  columnOne.data('id', rowId) // 在 DOM 标签上绑定 Row ID
  container.append(columnOne) // 生成 DOM 元素并添加到页面
}

export default rowHandler
