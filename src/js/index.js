import '../style/grid24.css'
import '../style/index.scss'
import DATA from './common/data'
import { Text } from './components/widget_list'
import defaultConfig from './common/config' // default config
import { uuid } from './common/utils'

import initPage from './common/precedure/init_page'
import loadWidget from './common/precedure/load_widget'
import bindEvent from './common/precedure/bind_event'

import AddRow from './components/layout/layout'

class FormDesigner {
  constructor(containerId = 'form-container', config = defaultConfig) {
    this.id = uuid()
    DATA['canvas']['id'] = this.id

    this.config = Object.assign({}, defaultConfig, config)

    this.containerId = containerId
    initPage(this.containerId)
    loadWidget(this.config)
    bindEvent('fd-widget', 'fd-canvas')
  }
}

const form = new FormDesigner('container-id')
