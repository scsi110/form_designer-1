import { WidgetBase } from '../widgetAPI'

class Text extends WidgetBase {
  constructor() {
    super()
    this.tag = 'input'
    this.attrs.type = 'text'
    this.attrs.required = true
    this.config.label = '输入框:'
    this.config.placeholder = '请输入文字'
    this.config.defaultValue = undefined
    this.config.name = undefined
    this.name = 'singleLineInput'
    this.type = 'text'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs, containerId } = this
    let element = $(`<${tag} class="c-field u-small"></${tag}>`)

    Object.keys(attrs).forEach(attr => {
      element.attr(attr, attrs[attr])
    })

    if (config.placeholder) {
      element.attr('placeholder', config.placeholder)
    }
    if (config.defaultValue) {
      element.val(config.defaultValue)
    }
    if (config.name) {
      element.attr('name', config.name)
    }

    return element
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const { placeholder, label, defaultValue, name } = this.config
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
    <li class="fd-config-item">
          <div class="ui form field">
            <label>表单标识</label>
            <input type="text" class="c-field" data-type="name" value="${name ===
            undefined
              ? ''
              : name}" />
          </div>
        </li>
      <li class="fd-config-item">
          <div class="ui form field">
            <label>文字占位</label>
            <input type="text" class="c-field" data-type="placeholder" value='${placeholder}' />
          </div>
        </li>
        <li class="fd-config-item">
          <div class="ui form field">
            <label>标签</label>
            <input type="text" class="c-field" data-type="label" value="${label}" />
          </div>
        </li>
        <li class="fd-config-item">
          <div class="ui form field">
            <label>默认值</label>
            <input type="text" class="c-field" data-type="defaultValue" value="${defaultValue ===
            undefined
              ? ''
              : defaultValue}" />
          </div>
        </li>
    </ul>
    `
    return this.bingConfigEvent(tpl)
  }

  // 绑定改变属性的事件
  bingConfigEvent = template => {
    const self = this
    const widgetId = this.id
    const element = $(template)
    const curConfig = this.config
    const inputs = element.find('input')
    inputs.on('input', function() {
      const attrName = $(this).data('type')
      let value = $(this).val()
      curConfig[attrName] = value
      self.emitChange()
    })
    return element
  }
}

Text.info = {
  name: 'text',
  displayName: '单行文本框'
}

export default Text
