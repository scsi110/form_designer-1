import { WidgetBase } from '../widgetAPI'
import store from '../../store/store'
import { handleCache } from '../../common/utils'

class Select extends WidgetBase {
  constructor() {
    super()
    this.optionNum = 0
    this.tag = 'select'
    this.config.dataFetchMethod = 'customer' // 获取选项的方法：1. customer 用户手动输入 2. defaultQuery 请求默认数据字典 3. customerQuery 自定义SQL查询
    this.config.label = '下拉选项'
    this.config.name = undefined
    this.config.options = []
    this.config.multiple = false
    this.config.required = false
    this.config.dynamicOption = false
    this.config.allowClear = false
    this.config.defaultValue = []
    this.config.dictTypeCode
    this.config.customerQuery
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
      // option.selected = false
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

    if (required) {
      element.attr('required', required)
    }

    if (name) {
      element.attr('name', name)
    }

    if (this.config.dataFetchMethod === 'customer') {
      options.forEach(option => {
        const { label, value } = option
        const optionDOM = `<option value="${value}">${label}</option>`
        element.append(optionDOM)
      })
    }

    return element
  }

  // 生命周期函数
  afterCreateDOM = () => {
    let { dynamicOption, multiple, allowClear } = this.config
    let { dataFetchMethod } = this.config
    if (dataFetchMethod === 'customer') {
      const { serverBaseUrl } = store.getConfig()
      this.elementRef.select2({
        dropdownAutoWidth: true,
        selectOnClose: false,
        width: '100%',
        multiple, // 是否允许多选
        tags: dynamicOption, // 允许在输入框动态添加选项
        allowClear
      })

      if (this.config.defaultValue) {
        this.elementRef.val(this.config.defaultValue)
        this.elementRef.trigger('change')
      }
    } else {
      // 请求远程数据走这里
      const { serverBaseUrl } = store.getConfig()
      let url =
        dataFetchMethod === 'defaultQuery'
          ? `${
              serverBaseUrl
            }/dynamicform/api/getDataDicts.action?dictTypeCode=${
              this.config.dictTypeCode
            }`
          : `${serverBaseUrl}/dynamicform/api/getSqlDictData.action?sql=${
              this.config.customerQuery
            }`

      let searchTerm = dataFetchMethod === 'defaultQuery' ? 'dictName' : 'name'

      this.elementRef.select2({
        ajax: {
          url,
          dataType: 'json',
          processResults: function({ result }) {
            let results = result.map((obj, index) => {
              return { id: obj.dictCode, text: obj.dictName }
            })
            return { results }
          },
          delay: 300,
          data: params => {
            var query = {
              [searchTerm]: params.term
            }
            return query
          }
        },
        dropdownAutoWidth: true,
        selectOnClose: false,
        width: '100%',
        multiple, // 是否允许多选
        tags: dynamicOption, // 允许在输入框动态添加选项
        allowClear
      })
    }
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
      let { label, value, id } = option
      _options = `${_options}
                <div class="optionsContainer">
                  <input type="${
                    this.config.multiple ? 'checkbox' : 'radio'
                  }" ${
        this.config.defaultValue.indexOf(value) === -1 ? '' : 'checked'
      } name="optionsRadios" data-index=${id} />
                  <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
                    <div class="o-field">
                      <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value=${
                        label
                      } data-index=${id} />
                    </div>
                    <div class="o-field">
                      <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value=${
                        value
                      } data-index=${id} />
                    </div>
                    <i class="close icon" style="cursor:pointer;line-height:31px;color:red;" data-index=${
                      id
                    }></i>
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
          <label>标识:</label>
            <input type="text" class="c-field u-xsmall" data-type="name" value="${
              name === undefined ? '' : name
            }" />
          </div>
          <div class="col-xs-12">
            <label>标签:</label>
            <input type="text" class="c-field u-xsmall" data-type="label" value="${
              formLabel
            }" />
          </div>
        </div>
      </li>
      <li class="fd-config-item complex-config">
        <div class="layui-tab layui-tab-card select-data-fetch-config" lay-filter="selectDataFetchTab">
          <ul class="layui-tab-title">
            ${
              this.config.dataFetchMethod === 'customer'
                ? '<li class="layui-this">自定义选项</li>'
                : '<li>自定义选项</li>'
            }
            ${
              this.config.dataFetchMethod === 'defaultQuery'
                ? '<li class="layui-this">远程字典</li>'
                : '<li>远程字典</li>'
            }
            ${
              this.config.dataFetchMethod === 'customerQuery'
                ? '<li class="layui-this">自定义查询</li>'
                : '<li>自定义查询</li>'
            }
          </ul>
          <div class="layui-tab-content" style="min-height: 200px;height:auto">
             ${
               this.config.dataFetchMethod === 'customer'
                 ? '<div class="layui-tab-item layui-show">'
                 : '<div class="layui-tab-item">'
             }
                <fieldset class="o-fieldset">
                  ${_options}
                </fieldset>
                <div class="row">
                  <i class="plus icon pull-right" style="cursor:pointer;margin-right: 18px;"></i>
                </div>
            </div>
            ${
              this.config.dataFetchMethod === 'defaultQuery'
                ? '<div class="layui-tab-item layui-show">'
                : '<div class="layui-tab-item">'
            }
                <fieldset class="o-fieldset">
                  <legend class="o-fields
                  et__legend">获取远程数据：</legend>
                </fieldset>
                <select class="c-field u-medium select-default-query"></select>
            </div>
             ${
               this.config.dataFetchMethod === 'customerQuery'
                 ? '<div class="layui-tab-item layui-show">'
                 : '<div class="layui-tab-item">'
             }
              <div class="col-xs-24 select-custom-sql-fetch">
                <textarea class="c-field" placeholder="请输入自定义 SQL 语句" rows="4"></textarea>
                <button type="button" class="c-button c-button--info u-large" style="float:right;margin-top:10px;width:100px;">
                  查询
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="fd-config-item simple-config">
        <label>属性配置:</label>
        <div class="row">
          <div class="col-xs-12">
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="multiple" ${
                multiple ? 'checked' : ''
              }> 启用多选
            </label>
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="dynamicOption" ${
                dynamicOption ? 'checked' : ''
              }> 启用动态添加
            </label>
          </div>
          <div class="col-xs-12">
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="required" ${
                required ? 'checked' : ''
              }> 必填项
            </label>
            <label class="c-field c-field--choice">
              <input type="checkbox" data-type="allowClear" ${
                allowClear ? 'checked' : ''
              }> 允许清除
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
    const simpleConfigs = element.find('.simple-config')
    const simpleConfigs_text = element.find('.simple-config input:text')
    const simpleConfigs_checkbox = element.find('.simple-config input:checkbox')
    // 复杂的选项设置
    const complexConfigs = element.find('.complex-config')
    // 文本框
    simpleConfigs.on('input', 'input:text', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.val()
      curConfig[attrName] = value
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })
    // checkbox
    simpleConfigs.on('change', 'input:checkbox', function() {
      const $this = $(this)
      const attrName = $this.data('type')
      let value = $this.is(':checked') ? true : false
      curConfig[attrName] = value
      if (attrName === 'multiple') {
        const toChangeType = value ? 'checkbox' : 'radio' // 将要变成的type
        const curType = toChangeType === 'radio' ? 'checkbox' : 'radio' // 现在的type
        const curInput = complexConfigs.find(`input:${curType}`) // 选中现在的type
        curInput.attr('type', toChangeType) // 改变并重新生成
        // 每次切换多选/单选，清除所有默认值设置
        curConfig.defaultValue = []
        complexConfigs.find(`input:${toChangeType}`).prop('checked', false)
      }
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
          const prveVal = option[attrName]
          option[attrName] = value
          const index = curConfig.defaultValue.indexOf(prveVal)
          curConfig.defaultValue[index] = value
          self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
          return
        }
      })
    })

    complexConfigs.on('change', 'input:radio', function() {
      const $this = $(this)
      const options = curConfig.options
      const id = $this.data('index')
      let value = $this.is(':checked') ? true : false
      options.forEach(option => {
        if (option.id === id) {
          curConfig.defaultValue = [] // 重置默认值数组
          curConfig.defaultValue.push(option.value) // 修改默认值数组
          return
        }
      })
      self.emitChange() // 发送改变数据的指令，自动触发 DOM 修改
    })

    complexConfigs.on('change', 'input:checkbox', function() {
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
          <input type="${
            curConfig.multiple ? 'checkbox' : 'radio'
          }" name="optionsRadios" data-type="selected" data-index=${id} />
          <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value=${
                label
              } data-index=${id} />
            </div>
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value=${
                value
              } data-index=${id} />
            </div>
            <i class="close icon" style="cursor:pointer;line-height:31px;color:red;" data-index=${
              id
            }></i>
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
    const self = this
    const { serverBaseUrl } = store.getConfig()

    layui.use('element', () => {
      let element = layui.element
      let dataFetchMethodMap = {
        0: 'customer',
        1: 'defaultQuery',
        2: 'customerQuery'
      }
      element.on('tab(selectDataFetchTab)', function(data) {
        // 储存前一个Tab的数据到sessionStorage
        let { index } = data
        let prevTab = self.config.dataFetchMethod
        let curTab = dataFetchMethodMap[index]
        if (prevTab === curTab) {
          return false
        }

        handleCache(self, prevTab, curTab)

        self.config.dataFetchMethod = curTab
        self.emitChange()
      })
    })

    $('.select-default-query')
      .select2({
        width: '100%',
        ajax: {
          url: `${serverBaseUrl}/dynamicform/api/getDataDictTypes.action`,
          dataType: 'json',
          processResults: function({ result }) {
            let results = result.map((obj, index) => {
              return { id: obj.dictTypeCode, text: obj.dictTypeName }
            })
            return { results }
          },
          delay: 400,
          data: params => {
            var query = {
              name: params.term
            }
            return query
          }
        }
      })
      .on('select2:select', function() {
        const $this = $(this)
        self.config.dictTypeCode = $this.val()
        self.config.label = $this[0].lastChild.innerText
        self.emitChange()
      })

    $('.select-custom-sql-fetch button').on('click', function() {
      let sql = $(this)
        .prev('textarea')
        .val()
      self.config.customerQuery = sql
      self.emitChange()
    })
  }
}

Select.info = {
  name: 'select',
  displayName: '下拉选择器'
}

export default Select
