import { WidgetBase } from '../components/base'
import { WidgetBox, Label } from '../components/dom/dom'
import store from '../store/store'
import $ from 'jquery'

const changeConfig = (attrName, value, widgetId) => {
  store.changeConfig(attrName, value, widgetId)
}

export { changeConfig, WidgetBox, Label, WidgetBase, $ }
