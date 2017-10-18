import { uuid } from '../common/utils'
import debounce from 'lodash.debounce'
import store from '../store/store'

class WidgetBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('WidgetBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.name
    this.id = uuid()
    this.tag
    this.attrs = {}
    this.config = {
      name: undefined
    }
    this.containerId
    this.elementRef
    this.type
  }

  transData() {
    return {
      name: this.name,
      id: this.id,
      tag: this.tag,
      attrs: this.attrs,
      config: this.config,
      containerId: this.containerId,
      elementRef: this.elementRef,
      type: this.type
    }
  }

  emitChange() {
    const self = this
    debounce(() => {
      store.changeConfig(self.config, self.id)
    }, 300)()
  }
}

class RowBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('RowBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.name = 'row'
    this.id = uuid()
    this.columns = []
  }

  transData() {
    return {
      id: this.id,
      name: this.name,
      columns: this.columns
    }
  }
}

class ColumnBase {
  constructor() {
    if (new.target === WidgetBase) {
      throw new Error('ColumnBase 作为基础类型，只能被继承后使用，无法实例化')
    }
    this.name = 'column'
    this.id = uuid()
    this.fields = []
  }

  transData() {
    return {
      id: this.id,
      name: this.name,
      fields: this.fields
    }
  }
}

export { WidgetBase, RowBase, ColumnBase }
