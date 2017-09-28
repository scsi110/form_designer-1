import $ from 'jquery'
import store from '../../../store/store'
import { toJS } from 'mobx'
import { InputText } from '../../../common/configTemplate'
import configing from './configing'

const bindModifyEvent = (elem, containerId) => {
  const widgetId = elem.data('id') // 获取 widget 的 ID
  const editContainer = $('#fd-widget-edit-container') // 获取容器
  const clearPanel = () => {
    // 清除 panel 的方法
    if (editContainer.children().length > 0) {
      editContainer
        .children()
        .animate({ height: '0', opacity: 0 }, 500, function() {
          $(this).remove() // 淡出动画，并移除 DOM
        })
    }
  }
  elem.on('mouseenter', function(event) {
    $(this)
      .find('.widget-action-bar')
      .show()
    $(this).css(
      'box-shadow',
      'inset 0 1px 1px rgba(0,0,0,.1), 0 0 8px rgba(20, 122, 204, 0.73)'
    )
  })

  elem.on('mouseleave', function(event) {
    $(this)
      .find('.widget-action-bar')
      .hide()
    $(this).css('box-shadow', 'none')
  })

  // 点击出现属性面板
  elem.find('.widget-edit').on('click', function() {
    // 如果面板里已经有内容了，清除掉
    clearPanel()
    let config = toJS(store.data.fields[widgetId].config) // 获取 widget 的 config
    let widgetName = toJS(store.data.fields[widgetId].name) // 获取 widget 的名称
    let editPanel
    // 加载属性面板
    switch (widgetName) { // 根据 widget 类型选取属性面板
      case 'input-text':
        editPanel = InputText(config) // 生成属性面板的 DOM
        editPanel = configing(widgetName, widgetId, editPanel) // [configing 函数]绑定属性修改时的触发事件，给全局 DATA 发送修改指令，返回 DOM
        break
      case 'button':
      // let editPanel = Button()
      default:
        break
    }

    editContainer.append(editPanel)
  })

  // 点击删除组件
  elem.find('.widget-delete').on('click', function() {
    store.removeField(widgetId, containerId)
    clearPanel()
  })

  return elem
}

export default bindModifyEvent
