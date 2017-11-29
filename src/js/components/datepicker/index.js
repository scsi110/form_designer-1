import { WidgetBase } from '../widgetAPI'
import store from '../../store/store'

class DatePicker extends WidgetBase {
  constructor() {
    super()
    this.tag = 'input'
    this.attrs.type = 'text'
    this.config.label = '选择日期'
    this.config.name = undefined
    this.config.required = false
    this.config.pickerType = 'date'
    this.config.placeholder = '请选择日期'
    this.config.defaultValue = undefined
    this.name = 'datepicker'
    this.type = 'datepicker'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs } = this
    let element = $(`<${tag} class="c-field u-small"></${tag}>`)

    Object.keys(attrs).forEach(attr => {
      element.attr(attr, attrs[attr])
    })

    if (config.name) {
      element.attr('name', config.name)
    }

    if (config.required) {
      element.attr('required', true)
    }

    if (config.placeholder) {
      element.attr('placeholder', config.placeholder)
    }

    return element
  }

  // 生命周期函数
  afterCreateDOM = () => {
    let { pickerType } = this.config
    laydate.render({
      elem: this.elementRef[0],
      type: this.config.pickerType,
      value: this.config.defaultValue
    })
    const pickerBox = $(`<div class="o-field o-field--icon-right">
                          <i class="calendar icon" style="font-size: 1em;position: absolute;top: 8px;right: 4px;"></i>
                        </div>`)
    pickerBox.append(this.elementRef)
    $(`#${this.containerId}`).append(pickerBox)
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const { placeholder, label, defaultValue, name, required } = this.config

    const formSign = store.getConfig().formDescriber
      ? `<div class="col-xs-24">
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
        <div class="col-xs-24">
          <label>文字占位</label>
          <input type="text" class="c-field u-small" data-type="placeholder" value='${
            placeholder
          }' />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24">
          <label>标签</label>
          <input type="text" class="c-field u-small" data-type="label" value="${
            label
          }" />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24">
          <label>默认值</label>
          <input type="text" class="c-field u-small" placeholder="年-月-日" data-type="defaultValue" value="${
            defaultValue === undefined ? '' : defaultValue
          }" />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24">
          <label>选择器类型</label>
          <select type="text" class="c-field" data-type="pickerType" value="${
            label
          }" id="datePickerTypeChoice">
            <option value="date">日期选择器</option>
            <option value="year">年选择器</option>
            <option value="month">月选择器</option>
            <option value="time">时间选择器</option>
            <option value="datetime">日期时间选择器</option>
          </select>
        </div>
      </li>

      <li class="row fd-config-item">
        <div class="col-xs-24">
          <label class="c-field c-field--choice">
                <input type="checkbox" data-type="required" ${
                  required ? 'checked' : ''
                } > 必填
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
    const select = element.find('select')
    const inputCheckbox = element.find('input:checkbox')
    inputs.on('input', function() {
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

    select.on('change', function() {
      const value = $(this).val()
      curConfig.pickerType = value
      self.emitChange()
    })
    return element
  }

  afterConfigPanelInit() {
    $('#datePickerTypeChoice').select2({
      width: '100%'
    })
  }
}

DatePicker.info = {
  name: 'datepicker',
  displayName: '日期选择器'
}

export default DatePicker
