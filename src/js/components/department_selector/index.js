import { WidgetBase } from '../widgetAPI'
import store from '../../store/store'
import { handleCache, createOptions, restoreOptions } from '../../common/utils'

class DepartmentSelector extends WidgetBase {
  constructor() {
    super()
    this.tag = 'div'
    this.config.name = undefined // 设定文件域的字段名
    this.config.label = '科室选择器'
    this.config.required = true
    this.config.multiple = true
    this.config.readonly = false
    this.config.defaultDept = false // 默认选中登录用户的主部门
    this.name = 'departmentSelector'
    this.type = 'departmentSelector'
  }

  createDOM = () => {
    const self = this
    const { tag } = this

    const element = `
      <${
        tag
      } style="height:30px;background:orange;color: #fff;text-align:center;line-height:30px;border-radius:3px;">科室选择器</${
      tag
    }>
    `

    return element
  }

  // 定义元素配置面板的模版，并绑定配置修改事件，在元素配置图标点击时触发（见 modify_event.js 文件）
  createConfigPanel = () => {
    const { readonly, label, required, defaultDept, multiple } = this.config

    // 解析选项生成配置模版
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
      <li class="row fd-config-item prop-config-section">
            ${formSign}
            <div class="col-xs-24">
              <label>标签</label>
                <input type="text" class="c-field u-small" data-type="label" value="${
                  label === 0 ? '' : label
                }" />
            </div>
            <div class="col-xs-24">
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
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="multiple" ${
                  multiple ? 'checked' : ''
                } > 选择多个科室
              </label>
              <label class="c-field c-field--choice">
                <input type="checkbox" data-type="defaultDept" ${
                  defaultDept ? 'checked' : ''
                } > 默认选中登录用户的主部门
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
    const propConfigSection = element.find('.prop-config-section')

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
      element.on('tab(checkboxDataFetchTab)', function(data) {
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
            tabContent = createOptions(self)
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

    $('.checkbox-default-query')
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
        self.config.dictTypeName = $.trim($this[0].lastChild.innerText)
        self.config.label = $.trim($this[0].lastChild.innerText)
        self.emitChange()
      })

    $('.checkbox-custom-sql-fetch button').on('click', function() {
      let sql = $(this)
        .prev('textarea')
        .val()
      self.config.customerQuery = sql
      self.emitChange()
    })
  }
}

DepartmentSelector.info = {
  name: 'departmentSelector',
  displayName: '科室选择器'
}

export default DepartmentSelector
