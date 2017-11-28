import { WidgetBase } from '../widgetAPI'
import { handleCache, createOptions, restoreOptions } from '../../common/utils'
import store from '../../store/store'

class RadioGroup extends WidgetBase {
  constructor() {
    super()
    this.optionNum = 0
    this.tag = 'input'
    this.optionSize = 1
    this.config.name = undefined
    this.config.label = '单选组合'
    this.config.required = false
    this.config.inline = false
    this.config.defaultValue = ''
    this.config.dataFetchMethod = 'customer' // 获取选项的方法：1. customer 用户手动输入 2. defaultQuery 请求默认数据字典 3. customerQuery 自定义SQL查询
    this.config.options = [{ id: 1, label: '选项1', value: '值1' }]
    this.config.dictTypeCode
    this.config.dictTypeName
    this.config.customerQuery
    this.name = 'radioGroup'
    this.type = 'radio'
  }

  addOption() {
    const { options } = this.config
    let id = ++this.optionSize
    const newOption = {
      id,
      label: `选项${id}`,
      value: `值${id}`
    }
    options.push(newOption)
  }

  createDOM = () => {
    const {
      options,
      defaultValue,
      dataFetchMethod,
      inline,
      dictTypeCode,
      customerQuery
    } = this.config
    const element = $(
      `<fieldset class="o-fieldset ${
        inline ? 'c-list c-list--inline c-list--unstyled' : ''
      }"></fieldset>`
    )
    let optionsDOM = ''
    if (dataFetchMethod === 'customer') {
      options.forEach(option => {
        let { id, label, value } = option
        optionsDOM = `${optionsDOM}
        <label class="c-field c-field--choice c-label ${
          inline ? 'c-list__item' : ''
        }">
          <input type="radio" name="${this.id}" data-id=${id} value="${
          value ? value : ''
        }" ${defaultValue === value ? 'checked' : ''}>
          ${label ? label : ''}
        </label>
        `
      })
      element.append(optionsDOM)
    } else {
      // 请求远程数据走这里
      const { serverBaseUrl } = store.getConfig()

      let url =
        dataFetchMethod === 'defaultQuery'
          ? `${
              serverBaseUrl
            }/dynamicform/api/getDataDicts.action?dictTypeCode=${dictTypeCode}`
          : `${serverBaseUrl}/dynamicform/api/getSqlDictData.action?sql=${
              customerQuery
            }`

      $.ajax({
        url,
        cache: true,
        success: function(data) {
          const { result } = JSON.parse(data)
          if (!result) {
            return
          }
          result.map(option => {
            const { dictCode: value, dictName: label } = option
            optionsDOM = `${optionsDOM}
              <label class="c-field c-field--choice c-label ${
                inline ? 'c-list__item' : ''
              }">
                <input type="radio" name="${this.id}" value="${value}">
                ${label}
              </label>
              `
          })
          element.append(optionsDOM)
        }
      })
    }

    return element
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const {
      name,
      label,
      inline,
      required,
      options,
      defaultValue,
      dataFetchMethod
    } = this.config

    // 解析选项生成配置模版

    // 自定义选项值（第一个Tab）
    const _options = createOptions(this.config)
    // defaultQuery 的默认option（第二个Tab）
    let defaultQueryOption
    // 第三个Tab
    let defaultSQL = ''

    const { serverBaseUrl } = store.getConfig()
    const { dictTypeCode, dictTypeName, customerQuery } = this.config
    if (dictTypeCode && dictTypeName) {
      defaultQueryOption = `<option value=${dictTypeCode} selected="selected">${
        dictTypeName
      }</option>`
    } else if (customerQuery) {
      defaultSQL = customerQuery
    }

    const tpl = `
    <ul class="fd-widget-configs" id="fd-config-list">
      <li class="row fd-config-item prop-config-section">
            <div class="col-xs-24 col-sm-12">
              <label>标识</label>
              <input type="text" class="c-field u-small" data-type="name" value="${
                name === undefined ? '' : name
              }" />
            </div>
            <div class="col-xs-24 col-sm-12">
              <label>标签</label>
                <input type="text" class="c-field u-small" data-type="label" value="${
                  label === 0 ? '' : label
                }" />
            </div>
            <div class="col-xs-24 col-sm-12">
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="inline" ${
                  inline ? 'checked' : ''
                }> 单行显示
              </label>
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="required" ${
                  required ? 'checked' : ''
                } > 必填项
              </label>
            </div>  
      </li>

      <li class="fd-config-item option-control-section">
        <div class="layui-tab layui-tab-card radio-data-fetch-config" lay-filter="radioDataFetchTab">
          <ul class="layui-tab-title">
            ${
              dataFetchMethod === 'customer'
                ? '<li class="layui-this">自定义选项</li>'
                : '<li>自定义选项</li>'
            }
            ${
              dataFetchMethod === 'defaultQuery'
                ? '<li class="layui-this">远程字典</li>'
                : '<li>远程字典</li>'
            }
            ${
              dataFetchMethod === 'customerQuery'
                ? '<li class="layui-this">自定义查询</li>'
                : '<li>自定义查询</li>'
            }
          </ul>
          <div class="layui-tab-content" style="min-height: 200px;height:auto">
             ${
               dataFetchMethod === 'customer'
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
              dataFetchMethod === 'defaultQuery'
                ? '<div class="layui-tab-item layui-show">'
                : '<div class="layui-tab-item">'
            }
                <fieldset class="o-fieldset">
                  <legend class="o-fields
                  et__legend">获取远程数据：</legend>
                </fieldset>
                <select class="c-field u-medium radio-default-query">
                  ${defaultQueryOption}
                </select>
            </div>
             ${
               dataFetchMethod === 'customerQuery'
                 ? '<div class="layui-tab-item layui-show">'
                 : '<div class="layui-tab-item">'
             }
             <fieldset class="o-fieldset">
              <div class="col-xs-24 radio-custom-sql-fetch">
                <textarea class="c-field" placeholder="请输入自定义 SQL 语句" rows="4">${
                  defaultSQL
                }</textarea>
                <button type="button" class="c-button c-button--info u-large" style="float:right;margin-top:10px;width:100px;">
                  查询
                </button>
              </div>
            </fieldset>            
            </div>
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

    optionConfigSection.on('change', 'input:radio', function() {
      const $this = $(this)
      const options = curConfig.options
      const id = $this.data('index')
      let value = $this.is(':checked') ? true : false
      options.forEach(option => {
        if (option.id === id) {
          curConfig.defaultValue = option.value
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
          if (curConfig.defaultValue === prveVal) {
            curConfig.defaultValue = value
          }
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
          if (curConfig.defaultValue === option.value) {
            curConfig.defaultValue = ''
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
      const newOption = `
        <div class="optionsContainer">
          <input type="radio" name="optionRadioControl" data-index=${id} />
          <div class="c-input-group" style="width: calc(100% - 30px);display: inline-flex;">
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项名" data-type="label" value="${
                label ? label : ''
              }" data-index=${id} />
            </div>
            <div class="o-field">
              <input class="c-field u-xsmall" placeholder="选项值" data-type="value" value="${
                value ? value : ''
              }" data-index=${id} />
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
    let tabContent = ''

    layui.use('element', () => {
      let element = layui.element
      let dataFetchMethodMap = {
        0: 'customer',
        1: 'defaultQuery',
        2: 'customerQuery'
      }
      element.on('tab(radioDataFetchTab)', function(data) {
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

        switch (index) {
          case 0:
            tabContent = createOptions(self.config)
            self.configPanelRef
              .find('.layui-show fieldset')
              .empty()
              .append(tabContent)
            break
          case 1:
            const { dictTypeCode, dictTypeName } = self.config
            if (dictTypeCode && dictTypeName) {
              tabContent = `<option value=${dictTypeCode} selected="selected">${
                dictTypeName
              }</option>`
              self.configPanelRef
                .find('.layui-show select')
                .empty()
                .append(tabContent)
            }
            break
          case 2:
            const { customerQuery } = self.config
            if (customerQuery) {
              self.configPanelRef
                .find('.layui-show textarea')
                .text(customerQuery)
            }
            break
        }
      })
    })

    $('.radio-default-query')
      .select2({
        width: '100%',
        ajax: {
          url: `${serverBaseUrl}/dynamicform/api/getDataDictTypes.action`,
          dataType: 'json',
          processResults: function({ result }) {
            let results = result.map((obj, index) => {
              return {
                id: obj.dictTypeCode,
                text: obj.dictTypeName
              }
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
        self.config.dictTypeName = $this[0].lastChild.innerText
        self.config.label = $this[0].lastChild.innerText
        self.emitChange()
      })

    $('.radio-custom-sql-fetch button').on('click', function() {
      let sql = $(this)
        .prev('textarea')
        .val()
      self.config.customerQuery = sql
      self.emitChange()
    })
  }
}

RadioGroup.info = {
  name: 'radio',
  displayName: '单选组合（radio）'
}

export default RadioGroup
