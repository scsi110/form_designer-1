import $ from 'jquery'

const loadWidget = ({ widgets }) => {
  const widgetContainer = $('#fd-widget-list')
  widgets.forEach(widget => {
    switch (widget) {
      case 'text':
        const text = $(
          '<li id="fd-text" class="fd-widget" draggable=true data-type="text">输入框</li>'
        )
        widgetContainer.append(text)
        break
      case 'button':
        const button = $(
          '<li id="fd-button" class="fd-widget" draggable=true data-type="button">按钮</li>'
        )
        widgetContainer.append(button)
        break
      case 'textarea':
        const textarea = $(
          '<li id="fd-textarea" class="fd-widget" draggable=true data-type="textarea">文本框</li>'
        )
        widgetContainer.append(textarea)
        break
      default:
        break
    }
  })
}

export default loadWidget
