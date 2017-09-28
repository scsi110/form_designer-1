import $ from 'jquery'
import store from '../../../store/store'

const configing = (widgetName, widgetId, panel) => {
  const element = $(panel)
  switch (widgetName) {
    case 'input-text': // 输入框
      const inputs = element.find('input')
      inputs.on('input', function() {
        let value
        switch ($(this).data('type')) {
          case 'placeholder':
            value = $(this).val()
            store.changeInputText('placeholder', value, widgetId)
            break
          case 'label':
            value = $(this).val()
            store.changeInputText('label', value, widgetId)
            break
          case 'defaultValue':
            value = $(this).val()
            store.changeInputText('defaultValue', value, widgetId)
            break
          default:
            break
        }
      })
      break

    default:
      break
  }
  return element
}

export default configing
