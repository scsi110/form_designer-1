import '../style/grid24.css'
import '../style/index.scss'
import '../style/icon.min.css'
import assignin from 'lodash.assignin'
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
    this.config = assignin({}, defaultConfig, config)

    this.containerId = containerId
    initPage(this.containerId)
    loadWidget()
    bindEvent('fd-widget', 'fd-canvas')
  }
}

const form = new FormDesigner('container-id')
