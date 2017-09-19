class WidgetBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('WidgetBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.id
    this.name
    this.type
    this.config
    this.attrs
    this.createDOM
  }
}

export default WidgetBase
