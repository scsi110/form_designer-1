import { WidgetBase } from '../widgetAPI'

class Textarea extends WidgetBase {
  constructor() {
    super()
    this.tag = 'textarea'
    this.config.label = '多行文本框'
    this.config.name = undefined
    this.config.required = false
    this.config.rows = '2'
    this.config.placeholder = '请输入文本'
    this.config.defaultValue = undefined
    this.config.maxlength = undefined
    this.name = 'multiLineInput'
    this.type = 'textarea'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs } = this
    let element = $(`<${tag} class="c-field"></${tag}>`)

    Object.keys(attrs).forEach(attr => {
      element.attr(attr, attrs[attr])
    })

    if (config.name) {
      element.attr('name', config.name)
    }

    if (config.required) {
      element.attr('required', true)
    }

    if (config.defaultValue) {
      element.text(config.defaultValue)
    }

    if (config.placeholder) {
      element.attr('placeholder', config.placeholder)
    }

    if (config.rows) {
      element.attr('rows', config.rows)
    }

    if (config.maxlength) {
      element.attr('maxlength', config.maxlength)
    }

    return element
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const {
      placeholder,
      label,
      defaultValue,
      name,
      rows,
      maxlength
    } = this.config
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
      <li class="row fd-config-item">
            <div class="col-xs-24 col-sm-12">
              <label>标识</label>
              <input type="text" class="c-field u-small" data-type="name" value="${
                name === undefined ? '' : name
              }" />
            </div>
            <div class="col-xs-24 col-sm-12">
          <label>标签</label>
          <input type="text" class="c-field u-small" data-type="label" value="${
            label
          }" />
        </div>
            
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-12">
              <label>文字占位</label>
              <input type="text" class="c-field u-small" data-type="placeholder" value='${
                placeholder
              }' />
            </div>
        <div class="col-xs-24 col-sm-12">
          <label>默认值</label>
          <input type="text" class="c-field u-small" data-type="defaultValue" value="${
            defaultValue === undefined ? '' : defaultValue
          }" />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-12">
          <label>行数(文本宽度)</label>
          <input type="text" class="c-field u-small" data-type="rows" value="${
            rows
          }" />
        </div>
        <div class="col-xs-24 col-sm-12">
          <label>最大字数限制</label>
          <input type="text" class="c-field u-small" data-type="maxlength" value="${
            maxlength === undefined ? '' : maxlength
          }" />
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

Textarea.info = {
  name: 'Textarea',
  displayName: '多行文本框'
}

export default Textarea
