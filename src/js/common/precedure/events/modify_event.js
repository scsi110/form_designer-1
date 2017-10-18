import $ from 'jquery'
import store from '../../../store/store'
import { toJS } from 'mobx'

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
    $(this).addClass('highlight-widget')
  })

  elem.on('mouseleave', function(event) {
    $(this).removeClass('highlight-widget')
  })

  // 点击出现属性面板
  elem.find('.widget-edit').on('click', function() {
    const curElem = $(this).parents('.widget-box')
    if (curElem.hasClass('configing')) {
      return
    }
    $('.configing').removeClass('configing')
    curElem.addClass('configing')

    // 如果面板里已经有内容了，清除掉
    clearPanel()

    // 加载属性面板
    // 生成属性面板的 DOM,绑定属性修改时的触发事件，给全局 DATA 发送修改指令，返回 DOM
    let widgetConfigs = store.data.fields[widgetId].config
    let editPanel = store.pluginMap[widgetId].createConfigPanel()
    editContainer.append(editPanel)
    if (store.pluginMap[widgetId].afterConfigPanelInit()) {
      store.pluginMap[widgetId].afterConfigPanelInit()
    }
  })

  // 点击删除组件
  elem.find('.widget-delete').on('click', function() {
    store.removeField(widgetId, containerId)
    clearPanel()
  })

  return elem
}

export default bindModifyEvent
