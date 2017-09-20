import '../style/grid24.css'
import '../style/index.scss'

import { TwoColumn } from './components/widget_list'
import initPage from './common/precedure/init_page'

class FormDesigner {
  constructor(containerId) {
    this.containerId = containerId
    initPage(this.containerId)
  }
}

const form = new FormDesigner('container-id')
