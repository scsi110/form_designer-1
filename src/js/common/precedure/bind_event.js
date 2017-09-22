import $ from 'jquery'
import {
  column_one,
  column_two,
  column_three,
  text,
  button,
  textarea
} from '../../components/dom/dom'

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
    setTimeout(function() {
      const columns = $('.fd-col')
      $.each(columns, function(index, col) {
        $(col).on('dragover', function(event) {
          event.preventDefault()
          event.stopPropagation()
          $(col).css('border', '1px solid gold')
        })
        $(col).on('dragleave', function(event) {
          event.preventDefault()
          event.stopPropagation()
          $(col).css('border', '1px solid rgba(128, 128, 128, 0.47)')
        })
        $(col).on('drop', function(event) {
          event.preventDefault()
          event.stopPropagation()
          const widgetType = event.originalEvent.dataTransfer.getData('type')
          $(col).css('border', '1px solid rgba(128, 128, 128, 0.47)')
          switch (widgetType) {
            case 'text':
              $(col).append(text)
              break
            case 'button':
              $(col).append(button)
              break
            default:
              break
          }
        })
      })
    }, 0)
    canvas.css('border', '3px solid #ffffff')
    const widgetType = event.originalEvent.dataTransfer.getData('type')
    switch (widgetType) {
      case 'column_one':
        canvas.append(column_one)
        break
      case 'column_two':
        canvas.append(column_two)
        break
      case 'column_three':
        canvas.append(column_three)
      default:
        break
    }
  })
}

export default bindEvent
