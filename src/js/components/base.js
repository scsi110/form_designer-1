import { uuid } from '../common/utils'
import store from '../store/store'
import debounce from 'lodash.debounce'

class WidgetBase {
  constructor() {
    // if (new.target === WidgetBase) {
    //   throw new Error('WidgetBase 作为基础类型，只能被继承后使用，无法实例化')
    // }
    this.name
    this.id = uuid()
    this.tag
    this.attrs = {}
    this.config = {
      name: undefined
    }
    this.containerId
    this.elementRef
    this.configPanelRef
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
      configPanelRef: this.configPanelRef,
      type: this.type
    }
  }

  emitChange = debounce(() => {
    store.changeConfig(this.config, this.id)
  }, 300)
}

class RowBase {
  constructor() {
    // if (new.target === RowBase) {
    //   throw new Error('RowBase 作为基础类型，只能被继承后使用，无法实例化')
    // }
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
    // if (new.target === ColumnBase) {
    //   throw new Error('ColumnBase 作为基础类型，只能被继承后使用，无法实例化')
    // }
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
