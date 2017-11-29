import store from '../../../store/store'
import { showConfigPanel } from '../../utils'

const bindModifyEvent = (elem, containerId) => {
  const widgetId = elem.data('id') // 获取 widget 的 ID

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
    store.removeField(widgetId, containerId)
    clearPanel()
  })

  return elem
}

export default bindModifyEvent
