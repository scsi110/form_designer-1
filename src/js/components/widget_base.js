class WidgetFactory {
  id
  name
  type
  config
  attrs

  constructor() {
    if (new.target === WidgetFactory) {
      throw new Error('WidgetFactory 作为基础类型，只能被继承后使用，无法实例化')
    }
  }

  domToJson() {}
  jsonToDom() {}
}

export default WidgetFactory
