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
      customer: '',
      errMsg: '请输入正确的格式'
    }
    this.name = 'singleLineInput'
    this.type = 'text'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs, containerId } = this
    let element = $(
      `<${tag} class="c-field u-small" ${
        this.config.readonly ? 'readonly' : ''
      }></${tag}>`
    )

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
              <input type="text" class="c-field u-small base-input" data-type="name" value="${
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
            <input type="text" class="c-field base-input" data-type="label" value="${label}" />
          </div>
        </li>
        <li class="fd-config-item row">
          <div class="ui form field">
            <label>文字占位</label>
            <input type="text" class="c-field base-input" data-type="placeholder" value='${placeholder}' />
          </div>
        </li>

        <li class="fd-config-item">
          <div class="ui form field">
            <label>默认值</label>
            <input type="text" class="c-field base-input" data-type="defaultValue" value="${
              defaultValue === undefined ? '' : defaultValue
            }" />
          </div>
        </li>

         <li class="fd-config-item">
          <div class="ui form field">
            <label>验证规则</label>
            <select type="text" class="c-field singleline-input-type-select">
              <option value="norule" ${
                validate.rule === 'norule' ? 'selected' : ''
              } data-type="norule">无限制</option>

              <option value="email" ${
                validate.rule === 'email' ? 'selected' : ''
              } data-type="email">邮箱</option>

              <option value="number" ${
                validate.rule === 'number' ? 'selected' : ''
              } data-type="number">数字</option>

              <option value="url" ${
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

              <option value="customerRule" ${
                validate.rule === 'customerRule' ? 'selected' : ''
              } data-type="customerRule">自定义规则</option>
              
            </select>
          </div>
        </li>

        <li class="fd-config-item input_customer_reg" style="display:${
          validate.rule === 'customerRule' ? 'block' : 'none'
        }">
          <div class="ui form field">
            <label>自定义规则</label>
            <input type="text" class="c-field" placeholder="请输入自定义的正则表达式" />
          </div>
        </li>

        <li class="fd-config-item">
          <div class="ui form field">
            <label>错误提示</label>
            <input type="text" class="c-field input_error-message" placeholder="请输入错误提示" value=${
              validate.errMsg ? validate.errMsg : ''
            } />
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
    const inputs = element.find('.base-input')
    const checkboxes = element.find('input:checkbox')

    inputs.on('input', function() {
      const attrName = $(this).data('type')
      let value = $(this).val()
      curConfig[attrName] = value
      self.emitChange()
    })

    checkboxes.on('change', function(e) {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.is(':checked') ? true : false
      curConfig[attrName] = value
      self.emitChange()
    })

    return element
  }

  afterConfigPanelInit() {
    $('.singleline-input-type-select').select2({
      width: '100%'
    })
    const self = this
    const { configPanelRef } = this
    const curConfig = this.config
    const input_select = configPanelRef.find('select')
    const input_customer_reg = configPanelRef.find('.input_customer_reg')
    const input_error_message = configPanelRef.find('.input_error-message')
    input_select.on('change', function() {
      const $this = $(this)
      const rule = $this.val()
      if (rule === 'customerRule') {
        input_customer_reg.show()
      } else {
        input_customer_reg.hide()
      }
      curConfig.validate.rule = rule
      self.emitChange()
    })

    input_customer_reg.on('input', 'input', function() {
      const $this = $(this)
      const rule = $this.val()
      curConfig.validate.customer = rule
      self.emitChange()
    })

    input_error_message.on('input', function() {
      const $this = $(this)
      const msg = $this.val()
      curConfig.validate.errMsg = msg
      self.emitChange()
    })
  }
}

Text.info = {
  name: 'text',
  displayName: '单行文本框',
  icon: '<i class="terminal icon"></i>'
}

export default Text
