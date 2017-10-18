import { WidgetBase } from '../widgetAPI'

class Select extends WidgetBase {
  constructor() {
    super()
    this.optionNum = 0
    this.tag = 'select'
    this.config.label = '下拉选项:'
    this.config.name = undefined
    this.config.options = []
    this.config.multiple = false
    this.config.required = false
    this.config.dynamicOption = false
    this.config.allowClear = false
    this.name = 'select'
    this.addOption(4)
    this.type = 'select'
  }

  addOption = (size = 1) => {
    let optionArray = this.config.options

    for (var i = 0; i < size; i++) {
      let optionNum = ++this.optionNum
      let option = {}
      option.label = `选项${optionNum}`
      option.value = `值${optionNum}`
      option.selected = false
      option.id = optionNum
      optionArray.push(option)
    }
  }

  createDOM = () => {
    let { tag, attrs, containerId } = this
    let { options, name, required } = this.config

    let element = $(`<${tag} class="c-field u-medium"></${tag}>`)
    Object.keys(attrs).forEach(attr => {
      if (attrs[attr]) {
        element.attr(attr, attrs[attr])
      }
    })

    if (name) {
      element.attr('name', name)
    }

    if (required) {
      element.attr('required', required)
    }

    options.forEach(option => {
      const { label, value, selected } = option
      const optionDOM = `<option value="${value}" ${selected
        ? 'selected'
        : ''}>${label}</option>`
      element.append(optionDOM)
    })

    return element
  }

  // 生命周期函数
  afterCreateDOM = () => {
    let { dynamicOption, multiple, allowClear } = this.config
    this.elementRef.select2({
      dropdownAutoWidth: true,
      selectOnClose: false,
      width: '100%',
      multiple, // 是否允许多选
      tags: dynamicOption, // 允许在输入框动态添加选项
      allowClear
    })
  }

  createConfigPanel = () => {
    let {
      options,
      name,
      label: formLabel,
      required,
      multiple,
      dynamicOption,
      allowClear
    } = this.config
    // 解析选项生成配置模版
    let _options = ''
    options.forEach(option => {
      let { label, value, selected, id } = option
      _options = `${_options}
                <div class="optionsContainer">
                  <input type="radio" name="optionsRadios" data-type="selected" data-index=${id} />
                  <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
                    <div class="o-field">
                      <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value=${label} data-index=${id} />
                    </div>
                    <div class="o-field">
                      <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value=${value} data-index=${id} />
                    </div>
                    <i class="close icon" style="cursor:pointer;line-height:31px;color:red;" data-index=${id}></i>
                  </div>
                </div>
              `
    })
    // 配置模版
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
      <li class="fd-config-item simple-config">
        <div class="row">
          <div class="col-xs-12">
          <label>表单标识:</label>
            <input type="text" class="c-field u-xsmall" data-type="name" value="${name ===
            undefined
              ? ''
              : name}" />
          </div>
          <div class="col-xs-12">
            <label>标签:</label>
            <input type="text" class="c-field u-xsmall" data-type="label" value="${formLabel}" />
          </div>
        </div>
      </li>
      <li class="fd-config-item complex-config">
      <fieldset class="o-fieldset">
        <legend class="o-fieldset__legend">选项：</legend>
        ${_options}
      </fieldset>
        <div class="row">
          <i class="plus icon pull-right" style="cursor:pointer;margin-right: 18px;"></i>
        </div>
        </div> 
      </li>
      <li class="fd-config-item simple-config">
        <label>属性配置:</label>
        <div class="row">
          <div class="col-xs-12">
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="multiple" ${multiple
                ? 'checked'
                : ''}> 启用多选
            </label>
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="dynamicOption" ${dynamicOption
                ? 'checked'
                : ''}> 启用动态添加
            </label>
          </div>
          <div class="col-xs-12">
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="required" ${required
                ? 'checked'
                : ''}> 必填项
            </label>
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="allowClear" ${allowClear
                ? 'checked'
                : ''}> 允许清除
            </label>
          </div>
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
    // const curConfig = getCurrentConfig(widgetId)
    const curConfig = this.config
    const element = $(template)
    const simpleConfigs_text = element.find('.simple-config input:text')
    const simpleConfigs_checkbox = element.find('.simple-config input:checkbox')
    // 复杂的选项设置
    const complexConfigs = element.find('.complex-config')
    // 文本框
    simpleConfigs_text.on('input', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.val()
      curConfig[attrName] = value
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })
    // checkbox
    simpleConfigs_checkbox.on('change', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.is(':checked') ? true : false
      curConfig[attrName] = value
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    complexConfigs.on('input', 'input:text', function() {
      const $this = $(this)
      const options = curConfig.options
      const attrName = $this.data('type')
      const id = $this.data('index')
      let value = $this.val()
      options.forEach(option => {
        if (option.id === id) {
          option[attrName] = value
          return
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    complexConfigs.on('change', 'input:radio', function() {
      const $this = $(this)
      const options = curConfig.options
      const attrName = $this.data('type')
      const id = $this.data('index')
      let value = $this.is(':checked') ? true : false
      options.forEach(option => {
        option.selected = false
        if (option.id === id) {
          option[attrName] = value
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    complexConfigs.on('click', 'i.close', function() {
      const $this = $(this)
      let options = curConfig.options
      const id = $this.data('index')
      options.forEach((option, index) => {
        if (option.id === id) {
          options.splice(index, 1)
          $this.parents('div.optionsContainer').remove()
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    complexConfigs.on('click', 'i.plus', function() {
      self.addOption()
      const $this = $(this)
      let option = curConfig.options[curConfig.options.length - 1]
      let { value, label, id } = option
      const newOption = `
        <div class="optionsContainer">
          <input type="radio" name="optionsRadios" data-type="selected" data-index=${id} />
          <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value=${label} data-index=${id} />
            </div>
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value=${value} data-index=${id} />
            </div>
            <i class="close icon" style="cursor:pointer;line-height:31px;color:red;" data-index=${id}></i>
          </div>
        </div>
      `
      $this
        .parent('div')
        .prev('fieldset')
        .append(newOption)
      self.emitChange()
    })

    return element
  }
}

Select.info = {
  name: 'select',
  displayName: '下拉选项'
}

export default Select
