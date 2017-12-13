import { WidgetBase } from '../widgetAPI'
import store from '../../store/store'
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
    this.config.readonly = false
    this.config.validate = {
      rule: 'norule',
      customer: '',
      errMsg: '请输入正确的格式'
    }
    this.name = 'multiLineInput'
    this.type = 'textarea'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs } = this
    let element = $(
      `<${tag} class="c-field" ${
        this.config.readonly ? 'readonly' : ''
      }></${tag}>`
    )

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
      maxlength,
      validate,
      readonly,
      required
    } = this.config

    const formSign = store.getConfig().formDescriber
      ? `<div class="col-xs-24 col-sm-24">
              <label>标识</label>
              <input type="text" class="c-field u-small" data-type="name" value="${
                name === undefined ? '' : name
              }" />
            </div>`
      : ''

    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">

      <li class="row fd-config-item">
          ${formSign}
      </li>

      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-24">
          <label>标签</label>
          <input type="text" class="c-field u-small" data-type="label" value="${label}" />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-12">
              <label>文字占位</label>
              <input type="text" class="c-field u-small" data-type="placeholder" value='${placeholder}' />
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
          <label>行数(文本框宽度)</label>
          <input type="text" class="c-field u-small" data-type="rows" value="${rows}" />
        </div>
        <div class="col-xs-24 col-sm-12">
          <label>最大字数限制</label>
          <input type="text" class="c-field u-small" data-type="maxlength" value="${
            maxlength === undefined ? '' : maxlength
          }" />
        </div>
      </li>

      <li class="row fd-config-item">
        
        <div class="col-xs-24 col-sm-12">
            <label>验证规则</label>
            <select type="text" class="c-field u-small multiline-input-type-select">
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
      <div class="ui form field col-xs-12">
          <label>错误提示</label>
            <input type="text" class="c-field u-small input_error-message" placeholder="请输入错误提示" value=${
              validate.errMsg ? validate.errMsg : ''
            } />
          </div>
      </li>

      <li class="fd-config-item row input_customer_reg" style="display:${
        validate.rule === 'customerRule' ? 'block' : 'none'
      }">
          <div class="col-xs-24 col-sm-24">
            <label>自定义规则</label>
            <input type="text" class="c-field u-small" placeholder="请输入自定义的正则表达式" />
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
    const inputText = element.find('input')
    const inputCheckbox = element.find('input:checkbox')
    inputText.on('input', function() {
      const attrName = $(this).data('type')
      let value = $(this).val()
      curConfig[attrName] = value
      self.emitChange()
    })

    inputCheckbox.on('change', function(e) {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.is(':checked') ? true : false
      curConfig[attrName] = value
      self.emitChange()
    })

    return element
  }

  afterConfigPanelInit() {
    $('.multiline-input-type-select').select2({
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

Textarea.info = {
  name: 'Textarea',
  displayName: '多行文本框',
  icon: '<i class="file text outline icon"></i>'
}

export default Textarea
