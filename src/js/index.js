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
  constructor(containerId = 'form-container', config = defaultConfig) {
    this.id = uuid()
    store.addCanvasId(this.id)
    this.config = assignin({}, defaultConfig, config)

    this.containerId = containerId
    initPage(this.containerId)
    $('#fd-form-edit-container')
      .find('input:text')
      .on('input', function() {
        store.addCanvasName($(this).val())
      })
    loadWidget()
    bindRowEvent('fd-widget', 'fd-canvas')
  }

  // FORM --> DATA 获取表单数据
  getData() {
    return JSON.stringify(toJS(store.data))
  }

  // DATA --> FORM 根据数据生成表单
  createForm(data) {
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
const form = new FormDesigner('container-id')

// form.getData();

// form.createForm(
//   '{"canvas":{"id":"51fb45fa3a5d4e2480dbe503a89036b1","rows":["a9961d4093834c81841c30c0c75ca8fb","6d045978bf134418a63f3567bb57e43f","5e31bd49083b49b486c56ed33cdbf980","26945a9385944852b899ac8b21c116f6"],"name":""},"rows":{"a9961d4093834c81841c30c0c75ca8fb":{"columns":["abc1dda943ee4bd399b9b5f862d2c330","d5453decef27465499aa76132e1f9627"],"config":{"columnLen":2}},"6d045978bf134418a63f3567bb57e43f":{"columns":["306d89c96b0744689d20ba35883a2e8c","8120748fc8eb45888738fc5079ffb3f5","f81b323d4dc043259fb041539c5ce8d2","448985295e0a40f9bf66b32858735ed5"],"config":{"columnLen":4}},"5e31bd49083b49b486c56ed33cdbf980":{"columns":["ad98185fc942400c82d7c63a61ab4194","d69560072112473d89866534ff5288e7","9ab144d55a7c4ed1abc6944bd7022396"],"config":{"columnLen":3}},"26945a9385944852b899ac8b21c116f6":{"columns":["0662b28a892a435b8a6f131bc85726d7","773d1dbd52e34ff8b6ca19082abf8b58"],"config":{"columnLen":2}}},"cols":{"abc1dda943ee4bd399b9b5f862d2c330":{"fields":["837231758b4b43cd92fd1aa1050cdbc5"],"config":{"colSpan":"col-xs-12"}},"d5453decef27465499aa76132e1f9627":{"fields":["edd93b588899495caaf21388db75cc8e"],"config":{"colSpan":"col-xs-12"}},"306d89c96b0744689d20ba35883a2e8c":{"fields":["221c8cc736cc4d30b76dc3145e9ac1d0"],"config":{"colSpan":"col-xs-6"}},"8120748fc8eb45888738fc5079ffb3f5":{"fields":["2184ebd5d3f84c6fb89efee03c5e3ad2"],"config":{"colSpan":"col-xs-6"}},"f81b323d4dc043259fb041539c5ce8d2":{"fields":[],"config":{"colSpan":"col-xs-6"}},"448985295e0a40f9bf66b32858735ed5":{"fields":[],"config":{"colSpan":"col-xs-6"}},"ad98185fc942400c82d7c63a61ab4194":{"fields":[],"config":{"colSpan":"col-xs-8"}},"d69560072112473d89866534ff5288e7":{"fields":["2a93bb2c2e3a4e82bbb6835feeade72d"],"config":{"colSpan":"col-xs-8"}},"9ab144d55a7c4ed1abc6944bd7022396":{"fields":[],"config":{"colSpan":"col-xs-8"}},"0662b28a892a435b8a6f131bc85726d7":{"fields":["dd0e79a79fb646879f97bca1f96f7c7e"],"config":{"colSpan":"col-xs-12"}},"773d1dbd52e34ff8b6ca19082abf8b58":{"fields":[],"config":{"colSpan":"col-xs-12"}}},"fields":{"837231758b4b43cd92fd1aa1050cdbc5":{"name":"checkboxGroup","tag":"input","attrs":{},"config":{"label":"多选组合:","required":false,"inline":false,"defaultValue":[],"options":[{"id":1,"label":"选项1","value":"值1"}]},"containerId":"abc1dda943ee4bd399b9b5f862d2c330","id":"837231758b4b43cd92fd1aa1050cdbc5","type":"checkbox"},"edd93b588899495caaf21388db75cc8e":{"name":"hiddenInput","tag":"input","attrs":{"type":"hidden"},"config":{},"containerId":"d5453decef27465499aa76132e1f9627","id":"edd93b588899495caaf21388db75cc8e","type":"hiddenInput"},"221c8cc736cc4d30b76dc3145e9ac1d0":{"name":"checkboxGroup","tag":"input","attrs":{},"config":{"label":"多选组合:","required":false,"inline":false,"defaultValue":[],"options":[{"id":1,"label":"选项1","value":"值1"}]},"containerId":"306d89c96b0744689d20ba35883a2e8c","id":"221c8cc736cc4d30b76dc3145e9ac1d0","type":"checkbox"},"2184ebd5d3f84c6fb89efee03c5e3ad2":{"name":"multiLineInput","tag":"textarea","attrs":{},"config":{"label":"多行文本框:","required":false,"rows":"2","placeholder":"请输入文本"},"containerId":"8120748fc8eb45888738fc5079ffb3f5","id":"2184ebd5d3f84c6fb89efee03c5e3ad2","type":"textarea"},"dd0e79a79fb646879f97bca1f96f7c7e":{"name":"radioGroup","tag":"input","attrs":{},"config":{"label":"单选组合:","required":false,"inline":false,"defaultValue":"","options":[{"id":1,"label":"选项1","value":"值1"}]},"containerId":"0662b28a892a435b8a6f131bc85726d7","id":"dd0e79a79fb646879f97bca1f96f7c7e","type":"radio"},"2a93bb2c2e3a4e82bbb6835feeade72d":{"name":"multiLineInput","tag":"textarea","attrs":{},"config":{"label":"多行文本框:","required":false,"rows":"2","placeholder":"请输入文本"},"containerId":"d69560072112473d89866534ff5288e7","id":"2a93bb2c2e3a4e82bbb6835feeade72d","type":"textarea"}}}'
// )
