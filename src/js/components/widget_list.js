import Text from './text/text'
import Select from './select'
import DatePicker from './datepicker'
import AddRow from './layout/layout'
import store from '../store/store'

const PLUGINS = {
  text: Text,
  select: Select,
  datepicker: DatePicker
}

const createComponent = (type, containerId) => {
  let plugin = new PLUGINS[type]() // 实例化对象
  plugin.containerId = containerId // 添加容器的 id
  store.addField(plugin.transData()) // 发送数据改变指令
  return plugin
}

const createInstance = type => {
  let instance = new PLUGINS[type]() // 实例化对象
  return instance
}

export { createComponent, createInstance, AddRow, PLUGINS }
