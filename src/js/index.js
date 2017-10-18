import '../style/index.scss'
import assignin from 'lodash.assignin'
import defaultConfig from './common/config' // default config
import { uuid } from './common/utils'
import { toJS } from 'mobx'
import store from './store/store' // 引入全局数据结构
import initPage from './common/precedure/init_page'
import loadWidget from './common/precedure/load_widget'
import bindEvent from './common/precedure/events/row_event'

import AddRow from './components/layout/layout'
import { createInstance } from './components/widget_list'

class FormDesigner {
  constructor(containerId = 'form-container', config = defaultConfig) {
    this.id = uuid()
    store.addCanvasId(this.id)
    this.config = assignin({}, defaultConfig, config)

    this.containerId = containerId
    initPage(this.containerId)
    loadWidget()
    bindEvent('fd-widget', 'fd-canvas')
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
//   '{"canvas":{"id":"f5257ec469ce4f8c88fedd48c107ddc5","rows":["6a3b73789bc74c66969de5a9c1745d0e","53c4b3c712db49c48f7f68e92217a769","635aa6ecb2e44a9d849ce66fb97d3117"]},"rows":{"6a3b73789bc74c66969de5a9c1745d0e":{"columns":["42c2084c1ede459b8a260a5ec1cc536b","17294a2b0ec840fd8c85ecd10b560f9f","694efd9f19c043ebbfb2b819aff06c3c","b6fc9f9baefb4321b67a946248bcdf74"],"config":{"columnLen":4}},"53c4b3c712db49c48f7f68e92217a769":{"columns":["c14915bae312427790c12be67609f597","f4fd4a3d739249c58e20bff644debf5d","cefc705148764820a6c6c115f601ec44"],"config":{"columnLen":3}},"635aa6ecb2e44a9d849ce66fb97d3117":{"columns":["d59619597667426f8f6d3f3c2969fa55","0046d5a02cff423db711b5b1da2d0e0b","ac8709b06b7c4ca9815e0cf99e2b578d"],"config":{"columnLen":3}}},"cols":{"42c2084c1ede459b8a260a5ec1cc536b":{"fields":["3c2ddb551a544229a1739b15f89ee427"],"config":{"colSpan":"col-xs-6"}},"17294a2b0ec840fd8c85ecd10b560f9f":{"fields":["b18f5c5f504e410dba26fa9e10d2cd66"],"config":{"colSpan":"col-xs-6"}},"694efd9f19c043ebbfb2b819aff06c3c":{"fields":["e3b2650732544400ba7c0bdca55f3cb9"],"config":{"colSpan":"col-xs-6"}},"b6fc9f9baefb4321b67a946248bcdf74":{"fields":["7240ad65b3894ca6b17947fc5df95f18"],"config":{"colSpan":"col-xs-6"}},"c14915bae312427790c12be67609f597":{"fields":["a56b4d1e3be8414b986af9321665b398"],"config":{"colSpan":"col-xs-8"}},"f4fd4a3d739249c58e20bff644debf5d":{"fields":["a29e57de6bc847cd9a4ded72298d9db1"],"config":{"colSpan":"col-xs-8"}},"cefc705148764820a6c6c115f601ec44":{"fields":["99a4846180564a54acb0dfe1d3a5b87d"],"config":{"colSpan":"col-xs-8"}},"d59619597667426f8f6d3f3c2969fa55":{"fields":["a912b0d69c3843f785a007c37d0759d8"],"config":{"colSpan":"col-xs-8"}},"0046d5a02cff423db711b5b1da2d0e0b":{"fields":["bba02509769b4c6aa478396285ea72c7"],"config":{"colSpan":"col-xs-8"}},"ac8709b06b7c4ca9815e0cf99e2b578d":{"fields":["c8eb54dd97a64b91be15d66a69fd6bff"],"config":{"colSpan":"col-xs-8"}}},"fields":{"3c2ddb551a544229a1739b15f89ee427":{"name":"select","tag":"select","attrs":{},"config":{"label":"下拉选项:","options":[{"label":"选项1","value":"值1","selected":false,"id":1},{"label":"选项2","value":"值2","selected":false,"id":2},{"label":"选项3","value":"值3","selected":false,"id":3},{"label":"选项4","value":"值4","selected":false,"id":4}],"multiple":false,"required":false,"dynamicOption":false,"allowClear":false},"containerId":"42c2084c1ede459b8a260a5ec1cc536b","id":"3c2ddb551a544229a1739b15f89ee427","type":"select"},"b18f5c5f504e410dba26fa9e10d2cd66":{"name":"select","tag":"select","attrs":{},"config":{"label":"下拉选项:","options":[{"label":"选项1","value":"值1","selected":false,"id":1},{"label":"选项2","value":"值2","selected":false,"id":2},{"label":"选项3","value":"值3","selected":false,"id":3},{"label":"选项4","value":"值4","selected":false,"id":4}],"multiple":false,"required":false,"dynamicOption":false,"allowClear":false},"containerId":"17294a2b0ec840fd8c85ecd10b560f9f","id":"b18f5c5f504e410dba26fa9e10d2cd66","type":"select"},"e3b2650732544400ba7c0bdca55f3cb9":{"name":"singleLineInput","tag":"input","attrs":{"type":"text","required":true},"config":{"label":"输","placeholder":"请输"},"containerId":"694efd9f19c043ebbfb2b819aff06c3c","id":"e3b2650732544400ba7c0bdca55f3cb9","type":"text"},"7240ad65b3894ca6b17947fc5df95f18":{"name":"select","tag":"select","attrs":{},"config":{"label":"下拉选项:","options":[{"label":"选项1","value":"值1","selected":false,"id":1},{"label":"选项2","value":"值2","selected":false,"id":2},{"label":"选项3","value":"值3","selected":false,"id":3},{"label":"选项4","value":"值4","selected":false,"id":4}],"multiple":false,"required":false,"dynamicOption":false,"allowClear":false},"containerId":"b6fc9f9baefb4321b67a946248bcdf74","id":"7240ad65b3894ca6b17947fc5df95f18","type":"select"},"a56b4d1e3be8414b986af9321665b398":{"name":"singleLineInput","tag":"input","attrs":{"type":"text","required":true},"config":{"label":"输入框:","placeholder":"请输入文字"},"containerId":"c14915bae312427790c12be67609f597","id":"a56b4d1e3be8414b986af9321665b398","type":"text"},"a29e57de6bc847cd9a4ded72298d9db1":{"name":"select","tag":"select","attrs":{},"config":{"label":"下拉选项:","options":[{"label":"选项1","value":"值1","selected":false,"id":1},{"label":"选项2","value":"值2","selected":false,"id":2},{"label":"选项3","value":"值3","selected":false,"id":3},{"label":"选项4","value":"值4","selected":false,"id":4}],"multiple":false,"required":false,"dynamicOption":false,"allowClear":false},"containerId":"f4fd4a3d739249c58e20bff644debf5d","id":"a29e57de6bc847cd9a4ded72298d9db1","type":"select"},"99a4846180564a54acb0dfe1d3a5b87d":{"name":"singleLineInput","tag":"input","attrs":{"type":"text","required":true},"config":{"label":"输入框:","placeholder":"请输入文字"},"containerId":"cefc705148764820a6c6c115f601ec44","id":"99a4846180564a54acb0dfe1d3a5b87d","type":"text"},"a912b0d69c3843f785a007c37d0759d8":{"name":"singleLineInput","tag":"input","attrs":{"type":"text","required":true},"config":{"label":"输入框:","placeholder":"请输入"},"containerId":"d59619597667426f8f6d3f3c2969fa55","id":"a912b0d69c3843f785a007c37d0759d8","type":"text"},"bba02509769b4c6aa478396285ea72c7":{"name":"select","tag":"select","attrs":{},"config":{"label":"下拉选项:","options":[{"label":"选项1","value":"值1","selected":false,"id":1},{"label":"选项2","value":"值2","selected":false,"id":2},{"label":"选项3","value":"值3","selected":false,"id":3},{"label":"选项4","value":"值4","selected":false,"id":4}],"multiple":true,"required":false,"dynamicOption":false,"allowClear":false},"containerId":"0046d5a02cff423db711b5b1da2d0e0b","id":"bba02509769b4c6aa478396285ea72c7","type":"select"},"c8eb54dd97a64b91be15d66a69fd6bff":{"name":"singleLineInput","tag":"input","attrs":{"type":"text","required":true},"config":{"label":"输","placeholder":"请输入文字","defaultValue":"666"},"containerId":"ac8709b06b7c4ca9815e0cf99e2b578d","id":"c8eb54dd97a64b91be15d66a69fd6bff","type":"text"}}}'
// )
