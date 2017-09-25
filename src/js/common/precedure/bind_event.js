import $ from 'jquery'
import {
  column_one,
  column_two,
  column_three,
  text,
  button,
  textarea
} from '../../components/dom/dom'

const bindColEvent = column_str => {
  const row = $(column_str)
  const col = row.find('.fd-col')
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
        $(this).append(text)
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

  return row
}

const bindEvent = (widgetClass, canvasId) => {
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
        let columnOne = bindColEvent(column_one)
        canvas.append(columnOne)
        break
      case 'column_two':
        let columnTwo = bindColEvent(column_two)
        canvas.append(columnTwo)
        break
      case 'column_three':
        let columnThree = bindColEvent(column_three)
        canvas.append(columnThree)
      default:
        break
    }
  })
}

export default bindEvent
