import { uuid } from '../common/utils'

class WidgetBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('WidgetBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.id = uuid()
    this.tag
    this.attrs = {}
    this.config = {}
    this.containerId
  }

  transData() {
    return {
      id: this.id,
      tag: this.tag,
      attrs: this.attrs,
      config: this.config,
      containerId: this.containerId
    }
  }
}

class RowBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('RowBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.id = uuid()
    this.columns = []
  }

  transData() {
    return {
      id: this.id,
      columns: this.columns
    }
  }
}

class ColumnBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('ColumnBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.id = uuid()
    this.fields = []
  }

  transData() {
    return {
      id: this.id,
      fields: this.fields
    }
  }
}

export { WidgetBase, RowBase, ColumnBase }
