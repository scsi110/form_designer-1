import $ from 'jquery'
import { Row, Column, WidgetBox, Label } from '../components/dom/dom'
import bindColEvent from '../common/precedure/events/col_event'
import bindModifyEvent from '../common/precedure/events/modify_event'
import store from '../store/store'
import { createInstance } from '../components/widget_list'

// 修改DOM的函数
const modify = (fieldId, removePrev) => {
  const field = store.data.fields[fieldId]
  const containerId = field.containerId

  setTimeout(function() {
    if (removePrev) {
      $(`#${containerId}`).empty()
    }
    let $widgetBox = $(WidgetBox)
    let widget = store.pluginMap[fieldId].createDOM()
    if (field.config.label) {
      const $label = $(Label)
      $label.append(field.config.label)
      $widgetBox.append($label)
    }

    $widgetBox.append(widget)
    store.pluginMap[fieldId].elementRef = widget

    $widgetBox.data('id', fieldId)
    $widgetBox.attr('id', fieldId)
    $widgetBox = bindModifyEvent($widgetBox, containerId)

    $(`#${containerId}`).append($widgetBox)
    if (store.pluginMap[fieldId].afterCreateDOM) {
      store.pluginMap[fieldId].afterCreateDOM()
    }
  }, 0)
}

const modifyDOM = ({ added, deleted, updated }) => {
  // 添加的情况
  if (!$.isEmptyObject(added)) {
    console.log('add', added)
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
          columnDom.attr('id', colId) // 给column绑定id
          columnDom.addClass(colSpan) // 添加 col-xs-xx 的class，决定 column 的大小
          rowDom.append(columnDom) // 添加到 row 中
          $('#fd-canvas').append(rowDom)
        })
      })
    }

    if (isFieldAdd) {
      const fields = added.fields
      Object.keys(fields).forEach(fieldId => {
        modify.call(this, fieldId, true)
      })
    }
  }

  // 删除的情况
  if (!$.isEmptyObject(deleted)) {
    console.log('delete', deleted)
    const fields = deleted.fields
    const cols = deleted.cols
    if (cols && fields) {
      Object.keys(fields).forEach(fieldId => {
        $(`#${fieldId}`).remove()
      })
    }
    if (fields && !cols) {
      Object.keys(fields).forEach(fieldId => {
        modify.call(this, fieldId, true)
      })
    }
  }

  // 更新的情况
  if (!$.isEmptyObject(updated)) {
    console.log('update')
    const fields = updated.fields
    if (fields) {
      Object.keys(fields).forEach(fieldId => {
        modify.call(this, fieldId, true)
      })
    }
  }
}

export default modifyDOM
