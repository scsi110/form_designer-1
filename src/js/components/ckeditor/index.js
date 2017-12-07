import { WidgetBase } from '../widgetAPI'
import store from '../../store/store'

class CKEditor extends WidgetBase {
  constructor() {
    super()
    this.tag = 'textarea'
    this.config.label = '富文本编辑器'
    this.config.name = undefined
    this.config.required = false
    this.config.defaultValue = undefined
    this.config.width = 'auto'
    this.config.height = 'auto'
    this.name = 'ckeditor'
    this.type = 'ckeditor'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs } = this
    let element = $(`<${tag} class="ckeditor"></${tag}>`)

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

    return element
  }

  // 生命周期函数
  afterCreateDOM = () => {
    const self = this
    this.elementRef.ckeditor({
      height: this.config.height,
      width: this.config.width,
      toolbar: [
        { name: 'document', items: ['Print'] },
        { name: 'clipboard', items: ['Undo', 'Redo'] },
        { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
        {
          name: 'basicstyles',
          items: [
            'Bold',
            'Italic',
            'Underline',
            'Strike',
            'RemoveFormat',
            'CopyFormatting'
          ]
        },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        {
          name: 'align',
          items: [
            'JustifyLeft',
            'JustifyCenter',
            'JustifyRight',
            'JustifyBlock'
          ]
        },
        { name: 'links', items: ['Link', 'Unlink'] },
        {
          name: 'paragraph',
          items: [
            'NumberedList',
            'BulletedList',
            '-',
            'Outdent',
            'Indent',
            '-',
            'Blockquote'
          ]
        },
        { name: 'insert', items: ['Image', 'Table'] },
        { name: 'tools', items: ['Maximize'] },
        { name: 'editing', items: ['Scayt'] }
      ]
    })

    CKEDITOR.on('instanceReady', function() {
      self.reborder()
    })
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
      height,
      width,
      required
    } = this.config

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
          <label>标签</label>
          <input type="text" class="c-field u-small" data-type="label" value="${
            label
          }" />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24">
          <label>宽度</label>
          <input type="text" class="c-field u-small" data-type="width" value="${
            width
          }" />
        </div>
        
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24">
          <label>高度</label>
          <input type="text" class="c-field u-small" data-type="height" value="${
            height
          }" />
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

    return element
  }
}

CKEditor.info = {
  name: 'ckeditor',
  displayName: '富文本编辑器'
}

export default CKEditor
