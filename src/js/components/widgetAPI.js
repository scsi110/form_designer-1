import { WidgetBase } from '../components/base'
import store from '../store/store'
import debounce from 'lodash.debounce'
import { toJS } from 'mobx'

const changeConfig = debounce((config, widgetId) => {
  store.changeConfig(config, widgetId)
}, 300)

const getCurrentConfig = widgetId => {
  return toJS(store.data.fields[widgetId].config)
}

export { changeConfig, WidgetBase, getCurrentConfig }
