import '../style/index.scss'
import assignin from 'lodash.assignin'
import defaultConfig from './common/config' // default config
import { uuid } from './common/utils'
import { toJS } from 'mobx'
import store from './store/store' // 引入全局数据结构
import initPage from './common/precedure/init_page'
import loadWidget from './common/precedure/load_widget'
import bindRowEvent from './common/precedure/events/row_event'

import AddRow from './components/layout/layout'
import { createInstance } from './components/widget_list'

class FormDesigner {
  constructor(config) {
    this.id = uuid()
    store.addCanvasId(this.id)
    store.setConfig(config)
    let { containerId, formDescriber } = store.formConfig
    this.containerId = containerId
    initPage(this.containerId)
    // 如果配置显示表单信息（标识），就绑定相关事件
    if (formDescriber) {
      $('#fd-form-edit-container')
        .find('input:text')
        .on('input', function() {
          store.addCanvasName($(this).val())
        })
    }
    loadWidget()
    bindRowEvent('fd-widget', 'fd-canvas')
  }

  // FORM --> DATA 获取表单数据
  getData() {
    return JSON.stringify(toJS(store.data))
  }

  // DATA --> FORM 根据数据生成表单
  createForm(data) {
    store.data = {}
    store.pluginMap = {}
    const _data = JSON.parse(data)
    const fields = _data.fields
    Object.keys(fields).forEach(fieldId => {
      const curField = fields[fieldId]
      const pluginType = curField.type
      const instance = createInstance(pluginType)
      Object.keys(curField).forEach(fieldAttr => {
        const fieldValue = curField[fieldAttr]
        instance[fieldAttr] = fieldValue
      })
      store.pluginMap[fieldId] = instance
    })
    store.data = _data
  }
}

window.FormDesigner = FormDesigner

const form = new FormDesigner({
  containerId: 'container-id',
  serverBaseUrl: 'http://192.168.1.237:8380/platform-base',
  formDescriber: true
})

window.onbeforeunload = function() {
  sessionStorage.setItem('formData', form.getData())
}

window.onload = function() {
  const formData = sessionStorage.getItem('formData')
  if (formData && form) {
    form.createForm(formData)
  }
}
