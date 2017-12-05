import { AddRow } from '../../../components/widget_list'
import { autoHigher } from '../../utils'

// 自动延伸画布高度，在每次 drop 时触发
// const autoHigher = () => {
//   const canvas = $('#fd-canvas')
//   const rowNum = canvas.find('.fd-row').length
//   const singleRowHeight = 82
//   const curRowHeight = singleRowHeight * rowNum
//   const curCanvasHeight = $('#fd-canvas').height()
//   // console.log('curCanvasHeight', curCanvasHeight)
//   // console.log('curRowHeight', curRowHeight)
//   const deltaHeight = curCanvasHeight - curRowHeight
//   if (deltaHeight < singleRowHeight * 2) {
//     $('#fd-canvas').height(curCanvasHeight + singleRowHeight * 2)
//   }
// }

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
    canvas.css('border', '1px dashed gold')
  })

  canvas.on('dragleave', function(event) {
    event.preventDefault()
    event.stopPropagation()
    canvas.css('border', '1px dashed #ddd')
  })

  canvas.on('drop', function(event) {
    event.preventDefault()
    event.stopPropagation()
    canvas.css('border', '1px dashed #ddd')
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

    autoHigher()
  })
}

export default bindRowEvent
