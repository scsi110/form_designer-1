import '../style/grid24.css'
import '../style/index.scss'
import '../style/form.min.css'
import '../style/button.min.css'
import '../style/icon.min.css'

import defaultConfig from './common/config' // default config
import { uuid } from './common/utils'

import store from './store/store' // 引入全局数据结构
import initPage from './common/precedure/init_page'
import loadWidget from './common/precedure/load_widget'
import bindEvent from './common/precedure/events/row_event'

import AddRow from './components/layout/layout'

class FormDesigner {
  constructor(containerId = 'form-container', config = defaultConfig) {
    this.id = uuid()

    store.addCanvasId(this.id)

    this.config = Object.assign({}, defaultConfig, config)

    this.containerId = containerId
    initPage(this.containerId)
    loadWidget(this.config)
    bindEvent('fd-widget', 'fd-canvas')
  }
}

const form = new FormDesigner('container-id')
