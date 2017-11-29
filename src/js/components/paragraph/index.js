import { WidgetBase } from '../widgetAPI'

class Paragraph extends WidgetBase {
  constructor() {
    super()
    this.tag = 'p'
    this.config.content = '这是一个段落'
    this.config.css = {
      color: '#000000',
      'font-size': '14px',
      background: 'none',
      display: 'inline',
      padding: '2px 0',
      'word-wrap': 'break-all',
      'border-radius': '1px'
    }
    this.name = 'paragraph'
    this.type = 'paragraph'
  }

  // 界面新增元素或元素发生更改重绘时，调用此方法生成元素的DOM（见 modify_dom.js 文件）
  createDOM = () => {
    let { tag, config, attrs } = this
    let element = $(`<${tag}></${tag}>`)

    if (config.content) {
      element.text(config.content)
    }

    element.css(config.css)

    return element
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const { content, css } = this.config
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
      <li class="row fd-config-item">
            <div class="col-xs-24 col-sm-24">
              <label>文本内容</label>
              <textarea class="c-field" rows="5" placeholder="请输入文字">${
                content
              }</textarea>
            </div>
      </li>
      <li class="row fd-config-item paragraph-text-color">
        <div class="col-xs-24 col-sm-12">
              <label>文字颜色:</label>
              <input type="color" data-type="color" value='${
                css['color']
              }' style="width:100%;height:30px;" />
        </div>
        <div class="col-xs-24 col-sm-12">
          <label>背景颜色:</label>
          <input type="color" data-type="background-color" style="width:100%;height:30px;" value="${
            css['background-color']
          }" />
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-24 paragraph-font-size">
          <label>字体大小:</label>
          <input type="range" class="c-range c-range--info" min="12" max="30" data-type="font-size" value="${parseInt(
            css['font-size']
          )}" />
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
    const textarea = element.find('textarea')
    const paragraphInputColor = element.find('input[type=color]')
    const paragraphInputRange = element.find('input[type=range]')

    textarea.on('input', function() {
      const attrName = $(this).data('type')
      let value = $(this).val()
      curConfig.content = value
      self.emitChange()
    })

    paragraphInputColor.on('change', function() {
      const attrName = $(this).data('type')
      let value = $(this).val()
      curConfig.css[attrName] = value
      self.emitChange()
    })

    paragraphInputRange.on('input', function() {
      const attrName = $(this).data('type')
      let value = $(this).val() + 'px'
      curConfig.css[attrName] = value
      self.emitChange()
    })

    return element
  }
}

Paragraph.info = {
  name: 'paragraph',
  displayName: '文字段落'
}

export default Paragraph
