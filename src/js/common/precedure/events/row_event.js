import $ from 'jquery'
import { AddRow } from '../../../components/widget_list'

const bindRowEvent = (widgetClass, canvasId) => {
  const widgets = $(`.${widgetClass}`)
  const canvas = $(`#${canvasId}`)

  $.each(widgets, function(index, elem) {
    $(elem).on('dragstart', function(event) {
      var widgetType = $(this).data('type')
      event.originalEvent.dataTransfer.setData('type', widgetType)
    })
  })

  canvas.on('dragover', function(event) {
    event.preventDefault()
    event.stopPropagation()
    canvas.css('border', '3px dashed gold')
  })

  canvas.on('dragleave', function(event) {
    event.preventDefault()
    event.stopPropagation()
    canvas.css('border', '3px solid #ffffff')
  })

  canvas.on('drop', function(event) {
    event.preventDefault()
    event.stopPropagation()
    canvas.css('border', '3px solid #ffffff')
    const widgetType = event.originalEvent.dataTransfer.getData('type')
    switch (widgetType) {
      case 'column_one':
        new AddRow(1, canvas)
        break
      case 'column_two':
        new AddRow(2, canvas)
        break
      case 'column_three':
        new AddRow(3, canvas)
        break
      case 'column_four':
        new AddRow(4, canvas)
        break
      default:
        break
    }
  })
}

export default bindRowEvent
