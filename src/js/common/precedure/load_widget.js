import { PLUGINS } from '../../components/widget_list'

const loadWidget = () => {
  const widgetContainer = $('#fd-widget-list')
  Object.keys(PLUGINS).forEach(plugin => {
    const widget = `<li id="fd-text" class="fd-widget" draggable=true data-type='${plugin}'>${PLUGINS[
      plugin
    ].info.displayName}</li>`

    widgetContainer.append(widget)
  })
}

export default loadWidget
