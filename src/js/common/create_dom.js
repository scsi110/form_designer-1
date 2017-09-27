import $ from 'jquery'
import { Row, Column, WidgetBox, Label } from '../components/dom/dom'
import bindColEvent from '../common/precedure/events/col_event'

const createDOM = data => {
  const rows = data.canvas.rows
  let rowArray = []
  if (rows) {
    rows.forEach(rowId => {
      // 循环每一个 Row Id
      let rowDom = $(Row)
      rowDom.data('id', rowId)
      let columns = data.rows[rowId].columns
      columns.forEach(columnId => {
        let { colSpan } = data.cols[columnId].config // 从数据中取得 colSpan 配置
        let columnDom = $(Column) // 生成 column 的 JQ 对象
        columnDom = bindColEvent(columnDom) // 给column绑定事件
        columnDom.data('id', columnId) // 给column绑定data-id
        columnDom.addClass(colSpan) // 添加 col-xs-xx 的class，决定 column 的大小

        // -------------------循环解析 Fields------------------------------
        let fields = data.cols[columnId].fields

        if (fields.length >= 1) {
          let widgetBox // 定义 widget 的容器 div
          fields.forEach(fieldId => {
            let element
            widgetBox = $(WidgetBox)
            let label = $(Label)
            let { tag, config, attrs } = data.fields[fieldId]
            if (tag in ['input']) {
              element = $(`<${tag} />`)
            } else {
              element = $(`<${tag}></${tag}>`)
            }

            Object.keys(attrs).forEach(attr => {
              element.attr(attr, attrs[attr])
            })

            label.append(config.label)
            if (config.placeholder) {
              element.attr('placeholder', config.placeholder)
            }

            widgetBox.append(label)
            widgetBox.append(element)
          })
          columnDom.append(widgetBox)
        }

        // -----------------------------------------------------------------
        rowDom.append(columnDom) // 添加到 row 中
        rowArray.push(rowDom)
      })
    })
  }
  $('#fd-canvas').empty()
  rowArray.forEach(row => {
    $('#fd-canvas').append(row)
  })
}

export default createDOM
