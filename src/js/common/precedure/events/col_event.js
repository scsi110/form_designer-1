import $ from 'jquery'
import { text, button, textarea } from '../../../components/dom/dom'
import { Text } from '../../../components/widget_list'

const bindColEvent = col => {
  col.on('dragover', function(event) {
    event.preventDefault()
    event.stopPropagation()
    $(this).css('border', '1px solid gold')
  })

  col.on('dragleave', function(event) {
    event.preventDefault()
    event.stopPropagation()
    $(this).css('border', '1px solid rgba(128, 128, 128, 0.47)')
  })

  col.on('drop', function(event) {
    event.preventDefault()
    event.stopPropagation()
    const widgetType = event.originalEvent.dataTransfer.getData('type')
    $(this).css('border', '1px solid rgba(128, 128, 128, 0.47)')
    switch (widgetType) {
      case 'text':
        new Text($(this).data('id'))
        break
      case 'button':
        $(this).append(button)
        break
      case 'textarea':
        $(this).append(textarea)
      default:
        break
    }
  })

  return col
}

export default bindColEvent
