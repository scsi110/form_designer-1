import { WidgetBase } from '../widgetAPI'

class RadioGroup extends WidgetBase {
  constructor() {
    super()
    this.optionNum = 0
    this.tag = 'input'
    this.optionSize = 1
    this.config.name = undefined // 设定文件域的字段名
    this.config.label = '多选组合:'
    this.config.required = false
    this.config.inline = false
    this.config.defaultValue = []
    this.config.options = [{ id: 1, label: '选项1', value: '值1' }]
    this.name = 'checkboxGroup'
    this.type = 'checkbox'
  }

  addOption() {
    const { options } = this.config
    let id = ++this.optionSize
    const newOption = {
      id,
      label: undefined,
      value: undefined
    }
    options.push(newOption)
  }

  createDOM = () => {
    const { options, defaultValue } = this.config
    let optionsDOM = ''
    options.forEach(option => {
      let { id, label, value } = option
      optionsDOM = `${optionsDOM}
        <label class="c-field c-field--choice c-label ${this.config.inline
          ? 'c-list__item'
          : ''}">
          <input type="checkbox" data-id=${id} value="${value
        ? value
        : ''}" ${defaultValue.indexOf(value) === -1 ? '' : 'checked'}>
          ${label ? label : ''}
        </label>
        `
    })

    const element = $(
      `<fieldset class="o-fieldset ${this.config.inline
        ? 'c-list c-list--inline c-list--unstyled'
        : ''}"></fieldset>`
    )
    element.append(optionsDOM)

    return element
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const { name, label, inline, required, options } = this.config
    // 解析选项生成配置模版
    let _options = ''
    options.forEach(option => {
      let { label, value, id } = option
      _options = `${_options}
                <div class="optionsContainer">
                  <input type="checkbox" data-index=${id} />
                  <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
                    <div class="o-field">
                      <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value="${label
                        ? label
                        : ''}" data-index=${id} />
                    </div>
                    <div class="o-field">
                      <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value="${value
                        ? value
                        : ''}" data-index=${id} />
                    </div>
                    <i class="close icon" style="cursor:pointer;line-height:31px;color:red;" data-index=${id}></i>
                  </div>
                </div>
              `
    })
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
      <li class="row fd-config-item prop-config-section">
            <div class="col-xs-24 col-sm-12">
              <label>文件标识</label>
              <input type="text" class="c-field u-small" data-type="name" value="${name ===
              undefined
                ? ''
                : name}" />
            </div>
            <div class="col-xs-24 col-sm-12">
              <label>标签</label>
                <input type="text" class="c-field u-small" data-type="label" value="${label ===
                0
                  ? ''
                  : label}" />
            </div>
            <div class="col-xs-24 col-sm-12">
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="inline" ${inline
                  ? 'checked'
                  : ''}> 单行显示
              </label>
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="required" ${required
                  ? 'checked'
                  : ''} > 必填项
              </label>
            </div>  
      </li>
      <li class="row fd-config-item option-control-section">
        <fieldset class="o-fieldset">
          <legend class="o-fieldset__legend">选项：</legend>
          ${_options}
        </fieldset>
        <div class="row">
          <i class="plus icon pull-right" style="cursor:pointer;margin-right: 18px;"></i>
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
    const propConfigSection = element.find('.prop-config-section')
    const optionConfigSection = element.find('.option-control-section')

    propConfigSection.on('input', 'input:text', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.val()
      curConfig[attrName] = value
      self.emitChange()
    })

    propConfigSection.on('change', 'input:checkbox', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.is(':checked') ? true : false
      curConfig[attrName] = value
      self.emitChange()
    })

    optionConfigSection.on('change', 'input:checkbox', function() {
      const $this = $(this)
      const options = curConfig.options
      const id = $this.data('index')
      let value = $this.is(':checked') ? true : false
      options.forEach(option => {
        if (option.id === id) {
          // 如果值是true，说明需要添加新的默认值，否则，需要把该值从默认值数组中去除
          if (value) {
            curConfig.defaultValue.push(option.value)
          } else {
            let targetIndex = curConfig.defaultValue.indexOf(option.value)
            curConfig.defaultValue.splice(targetIndex, 1)
          }
          return
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    optionConfigSection.on('input', 'input:text', function() {
      const $this = $(this)
      const options = curConfig.options
      const attrName = $this.data('type')
      const id = $this.data('index')
      let value = $this.val()
      options.forEach(option => {
        if (option.id === id) {
          const prveVal = option[attrName]
          option[attrName] = value
          const index = curConfig.defaultValue.indexOf(prveVal)
          curConfig.defaultValue[index] = value
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    optionConfigSection.on('click', 'i.close', function() {
      const $this = $(this)
      let options = curConfig.options
      const id = $this.data('index')
      options.forEach((option, index) => {
        if (option.id === id) {
          options.splice(index, 1)
          let targetIndex = curConfig.defaultValue.indexOf(option.value)
          if (targetIndex != -1) {
            curConfig.defaultValue.splice(targetIndex, 1)
          }
          $this.parents('div.optionsContainer').remove()
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    optionConfigSection.on('click', 'i.plus', function() {
      self.addOption()
      const $this = $(this)
      let option = curConfig.options[curConfig.options.length - 1]
      let { value, label, id } = option
      console.log(value, label, id)
      const newOption = `
        <div class="optionsContainer">
          <input type="checkbox" name="optionscheckbox" data-type="selected" data-index=${id} />
          <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value="${label
                ? label
                : ''}" data-index=${id} />
            </div>
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value="${value
                ? value
                : ''}" data-index=${id} />
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

  afterConfigPanelInit() {
    $('#fileUploadAcceptTypeChoice').select2({
      width: '100%'
    })
  }
}

RadioGroup.info = {
  name: 'radio',
  displayName: '单选组合（radio）'
}

export default RadioGroup
