import $ from 'jquery'
import { Row, Column, WidgetBox, Label } from '../components/dom/dom'
import bindColEvent from '../common/precedure/events/col_event'
import bindModifyEvent from '../common/precedure/events/modify_event'
import store from '../store/store'

const modifyDOM = ({ added, deleted, updated }) => {
  // 添加的情况
  if (added) {
    const isRowAdd = added.rows
    const isFieldAdd = added.fields
    if (isRowAdd) {
      const rows = added.rows
      const cols = added.cols
      Object.keys(rows).forEach(rowId => {
        const colArray = rows[rowId].columns
        let rowDom = $(Row)
        rowDom.data('id', rowId)
        rowDom.attr('id', rowId)
        colArray.forEach(colId => {
          const { colSpan } = cols[colId].config
          let columnDom = $(Column) // 生成 column 的 JQ 对象
          columnDom = bindColEvent(columnDom) // 给column绑定事件
          columnDom.data('id', colId) // 给column绑定data-id
          columnDom.attr('id', colId) // 给column绑定data-id
          columnDom.addClass(colSpan) // 添加 col-xs-xx 的class，决定 column 的大小
          rowDom.append(columnDom) // 添加到 row 中
          $('#fd-canvas').append(rowDom)
        })
      })
    }

    if (isFieldAdd) {
      const fields = added.fields
      Object.keys(fields).forEach(fieldId => {
        // 循环生成 widget
        // const containerId = fields[fieldId].containerId
        let element
        let { tag, config, attrs, containerId } = fields[fieldId]

        let widgetBox = $(WidgetBox)
        let label = $(Label)

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
        if (config.defaultValue) {
          element.val(config.defaultValue)
        }

        if (config.row) {
          element.attr('row', config.row)
        }

        widgetBox.append(label)
        widgetBox.append(element)
        widgetBox.data('id', fieldId)
        widgetBox.attr('id', fieldId)
        widgetBox = bindModifyEvent(widgetBox, containerId)

        $(`#${containerId}`).append(widgetBox)
      })
    }
  }

  // 删除的情况
  if (deleted) {
    const isFieldDeleted = deleted.fields
    if (isFieldDeleted) {
      const fields = deleted.fields
      Object.keys(fields).forEach(fieldId => {
        $(`#${fieldId}`).remove()
      })
    }
  }

  // 更新的情况
  if (updated) {
    const isFieldUpdated = updated.fields
    if (isFieldUpdated) {
      const fields = updated.fields
      Object.keys(fields).forEach(fieldId => {
        let element
        let { tag, config, attrs, containerId } = store.data.fields[fieldId]

        let widgetBox = $(WidgetBox)
        let label = $(Label)

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
        if (config.defaultValue) {
          element.val(config.defaultValue)
        }

        widgetBox.append(label)
        widgetBox.append(element)
        widgetBox.data('id', fieldId)
        widgetBox.attr('id', fieldId)
        widgetBox = bindModifyEvent(widgetBox, containerId)

        $(`#${fieldId}`).remove()
        $(`#${containerId}`).append(widgetBox)
      })
    }
  }
}

export default modifyDOM
