import { WidgetBase } from '../widgetAPI'

class FileUpload extends WidgetBase {
  constructor() {
    super()
    this.optionNum = 0
    this.config.name = 'file' // 设定文件域的字段名
    this.config.size = 0 // 文件大小限制,0 为不限制
    this.config.accept = 'file'
    this.config.url = undefined
    this.config.placeholder = '点击上传，或将文件拖拽到此处'
    this.config.auto = true
    this.config.drag = true
    this.config.multiple = false
    this.config.required = false
    this.name = 'fileUpload'
    this.type = 'fileUpload'
  }

  createDOM = () => {
    let element = $(
      `<div class="layui-upload-drag">
        <i class="cloud upload icon layui-icon"></i>
        <p>${this.config.placeholder}</p>
      </div>
      `
    )
    return element
  }

  // 生命周期函数
  afterCreateDOM = () => {
    const { size, accept, url, name, auto, drag, multiple } = this.config
    var elem = this.elementRef
    layui.use('upload', function() {
      var upload = layui.upload
      upload.render({
        elem,
        accept: 'file',
        url, //上传接口
        field: name,
        auto,
        drag,
        multiple,
        done: function(res) {
          //上传完毕回调
        },
        error: function() {
          //请求异常回调
        }
      })
    })
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const {
      placeholder,
      size,
      accept,
      url,
      name,
      auto,
      drag,
      multiple
    } = this.config
    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
      <li class="row fd-config-item">
            <div class="col-xs-24 col-sm-12">
              <label>文件标识</label>
              <input type="text" class="c-field u-small" data-type="name" value="${name ===
              undefined
                ? ''
                : name}" />
            </div>
            <div class="col-xs-24 col-sm-12">
              <label>文本占位</label>
              <input type="text" class="c-field u-small" data-type="placeholder" value="${placeholder}" />
            </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-12">
          <label>文件大小限制（KB）</label>
          <input type="text" class="c-field u-small" data-type="size" value="${size ===
          0
            ? ''
            : size}" />
        </div>
        <div class="col-xs-24 col-sm-12">
          <label>文件类型限制</label>
          <select type="text" class="c-field" data-type="accept" value="${accept}" id="fileUploadAcceptTypeChoice">
            <option value="file">所有文件</option>
            <option value="images">图片</option>
            <option value="audio">音频</option>
            <option value="video">视频</option>
          </select>
        </div>
      </li>
      <li class="row fd-config-item">
        <div class="col-xs-24 col-sm-12">
          <label>上传地址(url)</label>
          <input type="text" class="c-field u-small" data-type="url" value="${url
            ? url
            : ''}" />
        </div>
      </li>
      <li class="row fd-config-item checkbox-config">
        <div class="col-xs-24 col-sm-12">
          <label class="c-field c-field--choice">
            <input type="checkbox" data-type="multiple" ${multiple
              ? 'checked'
              : ''}> 允许多选
          </label>
          <label class="c-field c-field--choice">
            <input type="checkbox" data-type="required" ${multiple
              ? 'required'
              : ''} > 必填项
          </label>
        </div>
        <div class="col-xs-24 col-sm-12">
          <label class="c-field c-field--choice">
            <input type="checkbox" data-type="auto" ${auto
              ? 'checked'
              : ''}> 自动上传
          </label>
          <label class="c-field c-field--choice">
            <input type="checkbox" data-type="drag" ${drag
              ? 'checked'
              : ''}> 拖拽上传
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
    const input_text = element.find('input:text')
    const input_checkbox = element.find('input:checkbox')
    const input_select = element.find('select')
    input_text.on('input', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.val()
      curConfig[attrName] = value
      self.emitChange()
    })

    input_checkbox.on('change', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.is(':checked') ? true : false
      curConfig[attrName] = value
      self.emitChange()
    })

    input_select.on('change', function() {
      const value = $(this).val()
      curConfig.accept = value
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

FileUpload.info = {
  name: 'fileUpload',
  displayName: '文件上传器'
}

export default FileUpload
