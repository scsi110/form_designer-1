import { WidgetBase } from '../base'
import store from '../../store/store'

class Text extends WidgetBase {
  constructor(containerId) {
    super()
    this.tag = 'input'
    this.attrs.type = 'text'
    this.attrs.required = true
    this.config.label = '输入框:'
    this.config.placeholder = '请输入文字'
    this.config.defaultValue = undefined
    this.containerId = containerId
    this.name = 'input-text'

    const data = this.transData()

    store.addField(data)
  }
}

export default Text
