import { WidgetBase } from '../base'
import store from '../../store/store'

class Textarea extends WidgetBase {
  constructor(containerId) {
    super()
    this.tag = 'textarea'
    this.attrs.rows = '3'
    this.config.label = '文本框:'
    this.config.defaultValue = undefined
    this.containerId = containerId
    this.name = 'textarea'

    const data = this.transData()

    store.addField(data)
  }
}

export default Textarea
