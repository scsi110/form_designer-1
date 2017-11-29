import store from '../../../store/store'
import { showConfigPanel } from '../../utils'

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
    const curElem = $(this).parents('.fd-col')
    if (curElem.hasClass('configing')) {
      return
    }
    showConfigPanel(widgetId)
  })

  // 点击删除组件
  elem.find('.widget-delete').on('click', function() {
    const curElem = $(this).parents('.fd-col')
    if (curElem.hasClass('configing')) {
      curElem.removeClass('configing')
      clearPanel()
    }
    store.removeField(widgetId, containerId)
  })

  return elem
}

export default bindModifyEvent
