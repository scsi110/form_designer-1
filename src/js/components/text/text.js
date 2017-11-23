import { WidgetBase } from '../widgetAPI'
import store from '../../store/store'
class Text extends WidgetBase {
  constructor() {
    super()
    this.tag = 'input'
    this.attrs.type = 'text'
    this.attrs.required = false
    this.config.label = '输入框'
    this.config.placeholder = '请输入文字'
    this.config.defaultValue = undefined
    this.config.name = undefined
    this.config.readonly = false
    this.config.validate = {
      rule: 'norule',
      errMsg: '请输入正确的格式'
    }
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
    const {
      placeholder,
      label,
      defaultValue,
      name,
      readonly,
      required,
      validate
    } = this.config
    const formSign = store.getConfig().formDescriber
      ? `<div class="ui form field">
              <label>标识</label>
              <input type="text" class="c-field u-small" data-type="name" value="${
                name === undefined ? '' : name
              }" />
            </div>`
      : ''
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
        <li class="fd-config-item">
          ${formSign}
        </li>
        <li class="fd-config-item">
          <div class="ui form field">
            <label>标签</label>
            <input type="text" class="c-field" data-type="label" value="${
              label
            }" />
          </div>
        </li>
        <li class="fd-config-item row">
          <div class="ui form field">
            <label>文字占位</label>
            <input type="text" class="c-field" data-type="placeholder" value='${
              placeholder
            }' />
          </div>
        </li>

        <li class="fd-config-item">
          <div class="ui form field">
            <label>默认值</label>
            <input type="text" class="c-field" data-type="defaultValue" value="${
              defaultValue === undefined ? '' : defaultValue
            }" />
          </div>
        </li>

         <li class="fd-config-item">
          <div class="ui form field">
            <label>验证规则</label>
            <select type="text" class="c-field" id="singleline-input-type-select">
              <option value="" ${
                validate.rule === 'norule' ? 'selected' : ''
              } data-type="norule">无限制</option>

              <option value="email" ${
                validate.rule === 'email' ? 'selected' : ''
              } data-type="email">邮箱</option>

              <option value="number" ${
                validate.rule === 'number' ? 'selected' : ''
              } data-type="number">数字</option>

              <option value="url" ${
                validate.rule === 'url' ? 'selected' : ''
              } data-type="url">网址</option>

              <option value="cellphone" ${
                validate.rule === 'cellphone' ? 'selected' : ''
              } data-type="cellphone">手机号码</option>

              <option value="IDNumber" ${
                validate.rule === 'IDNumber' ? 'selected' : ''
              } data-type="IDNumber">身份证</option>

              <option value="IPAddress" ${
                validate.rule === 'IPAddress' ? 'selected' : ''
              } data-type="IPAddress">IP地址</option>

              <option value="chinese" ${
                validate.rule === 'chinese' ? 'selected' : ''
              } data-type="chinese">中文</option>

              <option value="english" ${
                validate.rule === 'english' ? 'selected' : ''
              } data-type="english">英文</option>

              <option value="enAndNum" ${
                validate.rule === 'enAndNum' ? 'selected' : ''
              } data-type="enAndNum">英文与数字混合</option>
              
            </select>
          </div>
        </li>

        <li class="fd-config-item">
          <div class="ui form field">
            <label>自定义规则</label>
            <input type="text" class="c-field" data-type="defaultValue" value="${
              validate.rule === 'norule' ? '' : validate.rule
            }" />
          </div>
        </li>

        <li class="fd-config-item row">
          <div class="ui form field col-xs-12">
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="readonly" ${
                  readonly ? 'checked' : ''
                }> 只读
              </label>
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="required" ${
                  required ? 'checked' : ''
                } > 必填项
              </label>
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
    const input_select = element.find('select')
    inputs.on('input', function() {
      const attrName = $(this).data('type')
      let value = $(this).val()
      curConfig[attrName] = value
      self.emitChange()
    })
    // console.log($('#singleline-input-type-select'))
    input_select.on('change', function() {
      const $this = $(this)
      const rule = $this.val()
      curConfig.validate.rule = rule
      self.emitChange()
    })
    return element
  }

  afterConfigPanelInit() {
    $('#singleline-input-type-select').select2({
      width: '100%'
    })
  }
}

Text.info = {
  name: 'text',
  displayName: '单行文本框'
}

export default Text
