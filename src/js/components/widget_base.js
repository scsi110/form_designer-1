import { uuid } from '../common/utils'

class WidgetBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('WidgetBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.id = uuid()
    this.type
    this.name
    this.config
    this.attrs
  }

  transData() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      config: this.config,
      attrs: this.attrs
    }
  }
}

export default WidgetBase
