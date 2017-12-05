import { Row, Column, WidgetBox, Label } from '../components/dom/dom'
import bindColEvent from '../common/precedure/events/col_event'
import bindModifyEvent from '../common/precedure/events/modify_event'
import store from '../store/store'
import rowControl from '../common/precedure/events/row_control'
import { validate } from '../common/utils'

// 修改DOM的函数
const modify = (fieldId, removePrev) => {
  const field = store.data.fields[fieldId]
  const containerId = field.containerId
  const colContainer = $(`#${containerId}`)

  setTimeout(function() {
    if (removePrev) {
      $(`#${containerId}`).empty()
    }
    let $widgetBox = $(WidgetBox)
    let widget = store.pluginMap[fieldId].createDOM()
    let labelVal = field.config.label
    if (labelVal) {
      const $label = $(Label)
      if (labelVal.slice(-1) !== ':' || labelVal.slice(-1) !== '：') {
        labelVal = labelVal + '：'
      }
      $label.append(labelVal)
      $widgetBox.append($label)
    }
    $widgetBox.append(widget)
    if (
      store.pluginMap[fieldId].config.validate &&
      store.pluginMap[fieldId].config.validate.rule !== 'norule'
    ) {
      $widgetBox.append(
        `<span style="color:red;display:none;padding-left:1px;font-size:14px;" class="validate-error-msg">${
          store.pluginMap[fieldId].config.validate.errMsg
        }</span>`
      )
    }

    store.pluginMap[fieldId].elementRef = widget

    $widgetBox.data('id', fieldId)
    $widgetBox.attr('id', fieldId)
    $widgetBox = bindModifyEvent($widgetBox, containerId)

    colContainer.append($widgetBox)

    // console.log(colContainer.parents('.fd-row').children('.fd-col'))

    // 判断验证规则
    if (
      store.pluginMap[fieldId].config.validate &&
      store.pluginMap[fieldId].config.validate.rule !== 'norule'
    ) {
      // 取得当前组件的验证规则
      let customerRule = null
      let result = null
      const rule = store.pluginMap[fieldId].config.validate.rule
      // 如果这个规则为自定义，则获取组件的自定义规则 customerRule
      if (rule === 'customerRule') {
        customerRule = store.pluginMap[fieldId].config.validate.customer
      }
      // 绑定预览组件的input事件
      widget.on('input', e => {
        let val = e.target.value
        // 当有自定义规则，验证时传入自定义规则，若没有，则执行预定义验证
        if (customerRule) {
          result = validate(val, rule, customerRule)
        } else {
          result = validate(val, rule)
        }

        if (!result) {
          $widgetBox.find('.validate-error-msg').show()
          widget.css('border-color', 'red')
        } else {
          $widgetBox.find('.validate-error-msg').hide()
          widget.css('border-color', '#96a8b2')
        }
      })
    }

    if (store.pluginMap[fieldId].afterCreateDOM) {
      store.pluginMap[fieldId].afterCreateDOM()
    }
  }, 0)
}

const modifyDOM = ({ added, deleted, updated }) => {
  const fields = deleted.fields
  const cols = deleted.cols
  const canvas = deleted.canvas
  const rows = deleted.rows
  // 添加的情况
  if (!$.isEmptyObject(added)) {
    console.log('add', added)
    const isRowAdd = added.rows
    const isFieldAdd = added.fields && added.cols // 有 field 字段和 col 字段同时添加，说明有组件被拖拉到 col 中，属于「添加组件」的行为
    const isFiledConfig = added.fields && !added.cols // 如果只有 filed 一个字段，说明是 field 字段发生了 「增加」的变化，这时候需要重新渲染整个 col
    if (isRowAdd) {
      const rows = added.rows
      const cols = added.cols
      const seqRows = added.canvas.rows
      Object.values(seqRows).forEach(rowId => {
        const colArray = rows[rowId].columns
        let rowDom = $(Row)
        rowDom.data('id', rowId)
        rowDom.attr('id', rowId)
        const _rowDom = rowControl(rowDom, rowId)
        $('#fd-canvas').append(_rowDom)
        colArray.forEach(colId => {
          const { colSpan } = cols[colId].config
          let columnDom = $(Column) // 生成 column 的 JQ 对象
          columnDom = bindColEvent(columnDom) // 给column绑定事件
          columnDom.data('id', colId) // 给column绑定data-id
          columnDom.attr('id', colId) // 给column绑定id
          columnDom.addClass(colSpan) // 添加 col-xs-xx 的class，决定 column 的大小
          rowDom.append(columnDom) // 添加到 row 中
        })
      })
    }

    if (isFieldAdd) {
      const fields = added.fields
      Object.keys(fields).forEach(fieldId => {
        modify.call(this, fieldId)
      })
    }

    if (isFiledConfig) {
      const fields = added.fields
      Object.keys(fields).forEach(fieldId => {
        modify.call(this, fieldId, true)
      })
    }
  }

  const isDeleted = !$.isEmptyObject(deleted)
  const isUpdated = !$.isEmptyObject(updated)

  if (isDeleted && isUpdated) {
    // 如果 update 和 delete 同时发生
    if (canvas) {
      // 有canvas说明row被删除了，要执行删除命令
      deletedHandler()
    } else {
      updatedHandler()
    }
  } else if (isDeleted && !isUpdated) {
    // 如果只有 delete ，执行 delete 操作
    deletedHandler()
  } else if (isUpdated && !isDeleted) {
    // 如果只有 update , 执行 update 操作
    updatedHandler()
  }

  // 删除的情况
  function deletedHandler() {
    console.log('delete', deleted)
    if (cols && fields && !canvas) {
      // 同时出现 col 和fields，没有canvas，组件删除的情况
      Object.keys(fields).forEach(fieldId => {
        $(`#${fieldId}`).remove()
      })
    } else if (canvas && rows) {
      Object.keys(rows).forEach(rowId => {
        $(`#${rowId}`).remove()
      })
    }
  }

  function updatedHandler() {
    console.log('update', updated)
    const fields = updated.fields
    if (fields) {
      Object.keys(fields).forEach(fieldId => {
        modify.call(this, fieldId, true)
      })
    }
  }
}

export default modifyDOM
