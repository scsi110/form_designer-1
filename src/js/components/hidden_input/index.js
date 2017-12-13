import { WidgetBase } from '../widgetAPI'

class HiddenInput extends WidgetBase {
  constructor() {
    super()
    this.tag = 'input'
    this.attrs.type = 'hidden'
    this.config.defaultValue = undefined
    this.config.name = undefined
    this.name = 'hiddenInput'
    this.type = 'hiddenInput'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs, containerId } = this
    let element = $(`<${tag} type="hidden" class="c-field" />`)

    Object.keys(attrs).forEach(attr => {
      element.attr(attr, attrs[attr])
    })

    if (config.defaultValue) {
      element.val(config.defaultValue)
    }

    if (config.name) {
      element.attr('name', config.name)
    }

    let container = $(
      `<div style="width:100%;height:30px;background:gray;border:none;border-radius:3px;color:#fff;text-align:center;line-height:30px;opacity: 0.6;">
        隐藏域
      </div>`
    )

    container.append(element)

    return container
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const { placeholder, label, defaultValue, name } = this.config
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
    <li class="fd-config-item">
          <div class="ui form field">
            <label>标识</label>
            <input type="text" class="c-field" data-type="name" value="${
              name === undefined ? '' : name
            }" />
          </div>
        </li>
        <li class="fd-config-item">
          <div class="ui form field">
            <label>值</label>
            <input type="text" class="c-field" data-type="defaultValue" value="${
              defaultValue === undefined ? '' : defaultValue
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

HiddenInput.info = {
  name: 'hiddenInput',
  displayName: '隐藏域',
  icon: '<i class="hide icon"></i>'
}

export default HiddenInput
