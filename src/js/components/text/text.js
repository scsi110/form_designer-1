import { WidgetBase } from '../base'

class Text extends WidgetBase {
  constructor() {
    super()
    this.type = 'text'
    this.name = 'input'
  }
}

export default Text
