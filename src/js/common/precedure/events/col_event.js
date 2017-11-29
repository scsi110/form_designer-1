import { text, button, textarea } from '../../../components/dom/dom'
import { createComponent } from '../../../components/widget_list'
import store from '../../../store/store'
import { showConfigPanel } from '../../utils'

const bindColEvent = col => {
  col.on('dragover', function(event) {
    event.preventDefault()
    event.stopPropagation()
    if (col.children().length > 0) {
      return
    }
    $(this).css('border', '1px solid gold')
  })

  col.on('dragleave', function(event) {
    event.preventDefault()
    event.stopPropagation()
    $(this).css('border', '1px dashed rgba(128, 128, 128, 0.47)')
  })

  col.on('drop', function(event) {
    event.preventDefault()
    event.stopPropagation()
    const $this = $(this)
    const colId = $this.data('id')
    $this.css('border', '1px dashed rgba(128, 128, 128, 0.47)')

    let widgetType = event.originalEvent.dataTransfer.getData('type')
    if (col.children().length > 0) {
      return
    }
    let pluginInstance = createComponent(widgetType, colId) // 创建 Plugin 的实例
    store.pluginMap[pluginInstance.id] = pluginInstance // 将 plugin 的实例保存到全局状态的 map 中

    showConfigPanel(pluginInstance.id)
  })

  return col
}

export default bindColEvent
