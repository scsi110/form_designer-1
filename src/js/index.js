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
  serverBaseUrl: 'http://192.168.1.237:8380/platform-base'
})

// form.getData();

// form.createForm(
//   '{"canvas":{"id":"d9cc7da62b9f46dda322d11a30d50a41","rows":["4ef74767dacc411fa03d4d9a6bfb4522","371eeeb1108a40edab281433c408872f","c653b9487cce4befb34ef12089d2f3a7"],"name":""},"rows":{"4ef74767dacc411fa03d4d9a6bfb4522":{"columns":["2fb499e996b943e4811716db884f7525"],"config":{"columnLen":1}},"371eeeb1108a40edab281433c408872f":{"columns":["1273079b784341599cb17b8151c1aa45","6e76b5056b9f41e0b27693f935beb550"],"config":{"columnLen":2}},"c653b9487cce4befb34ef12089d2f3a7":{"columns":["9cb5cafd0511492c9a51496d60409e63","be589fcaec154de8aba507ddd6c10bb0","1eec401e89e04ac285a79b52a876ae65"],"config":{"columnLen":3}}},"cols":{"2fb499e996b943e4811716db884f7525":{"fields":["56ca662bd543434bbd7af9cdf1ad1a8a"],"config":{"colSpan":"col-xs-24"}},"1273079b784341599cb17b8151c1aa45":{"fields":["7f3fa280a55e4bc3916392dcf8956af1"],"config":{"colSpan":"col-xs-12"}},"6e76b5056b9f41e0b27693f935beb550":{"fields":["ae9bfed307264d40aecd58e6dc8d8669"],"config":{"colSpan":"col-xs-12"}},"9cb5cafd0511492c9a51496d60409e63":{"fields":["614a3a1e9dc9408d88b47fdb7ae0ac2c"],"config":{"colSpan":"col-xs-8"}},"be589fcaec154de8aba507ddd6c10bb0":{"fields":["485de2e87fa241029857aaea7206c02b"],"config":{"colSpan":"col-xs-8"}},"1eec401e89e04ac285a79b52a876ae65":{"fields":["77c8861229bb4098a9ca58ae9df3cb99"],"config":{"colSpan":"col-xs-8"}}},"fields":{"56ca662bd543434bbd7af9cdf1ad1a8a":{"name":"multiLineInput","tag":"textarea","attrs":{},"config":{"label":"多行文本框","required":false,"rows":"2","placeholder":"请输入文本"},"containerId":"2fb499e996b943e4811716db884f7525","id":"56ca662bd543434bbd7af9cdf1ad1a8a","type":"textarea"},"7f3fa280a55e4bc3916392dcf8956af1":{"name":"singleLineInput","tag":"input","attrs":{"type":"text","required":true},"config":{"label":"输入框","placeholder":"请输入文字"},"containerId":"1273079b784341599cb17b8151c1aa45","id":"7f3fa280a55e4bc3916392dcf8956af1","type":"text"},"ae9bfed307264d40aecd58e6dc8d8669":{"name":"datepicker","tag":"input","attrs":{"type":"text"},"config":{"label":"选择日期","required":false,"pickerType":"date","placeholder":"请选择日期"},"containerId":"6e76b5056b9f41e0b27693f935beb550","id":"ae9bfed307264d40aecd58e6dc8d8669","type":"datepicker"},"614a3a1e9dc9408d88b47fdb7ae0ac2c":{"name":"radioGroup","tag":"input","attrs":{},"config":{"label":"单选组合","required":false,"inline":false,"defaultValue":"","options":[{"id":1,"label":"选项1","value":"值1"}]},"containerId":"9cb5cafd0511492c9a51496d60409e63","id":"614a3a1e9dc9408d88b47fdb7ae0ac2c","type":"radio"},"485de2e87fa241029857aaea7206c02b":{"name":"checkboxGroup","tag":"input","attrs":{},"config":{"label":"多选组合","required":false,"inline":false,"defaultValue":["值2"],"options":[{"id":1,"label":"选项1","value":"值1"},{"id":2,"label":"选项2","value":"值2"},{"id":3,"label":"选项3","value":"值3"}]},"containerId":"be589fcaec154de8aba507ddd6c10bb0","id":"485de2e87fa241029857aaea7206c02b","type":"checkbox"},"77c8861229bb4098a9ca58ae9df3cb99":{"name":"select","tag":"select","attrs":{},"config":{"dataFetchMethod":"defaultQuery","label":"考核类型","options":[{"label":"选项1","value":"值1","id":1},{"label":"选项2","value":"值2","id":2},{"label":"选项3","value":"值3","id":3},{"label":"选项4","value":"值4","id":4}],"multiple":false,"required":false,"dynamicOption":false,"allowClear":false,"defaultValue":[],"dictTypeCode":"100003"},"containerId":"1eec401e89e04ac285a79b52a876ae65","id":"77c8861229bb4098a9ca58ae9df3cb99","type":"select"}}}'
// )
