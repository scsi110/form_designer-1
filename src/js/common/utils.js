import uuidv4 from 'uuid-v4'
import store from '../store/store'

const uuid = elem => {
  let id
  if (elem) {
    let { attrs = {} } = elem
    id = attrs.id || elem.id || uuidv4()
    elem.id = id
  } else {
    id = uuidv4()
  }
  id = id.replace(/-/g, '')
  return id
}

const clone = obj => {
  let copy

  // Handle the 4 simple types, and null or undefined
  if (null === obj || 'object' !== typeof obj) {
    return obj
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr])
      }
    }
    return copy
  }

  throw new Error('Unable to copy Object, type not supported.')
}

const createGrid = cols => {
  switch (col) {
    case 1:
      return $(
        `<div class="row">
          <div class="col-xs-24"></div>
        </div>`
      )
      break
    case 2:
      return $(
        `<div class="row">
          <div class="col-xs-12"></div>
          <div class="col-xs-12"></div>
        </div>`
      )
      break
    case 3:
      return $(
        `<div class="row">
          <div class="col-xs-8"></div>
          <div class="col-xs-8"></div>
          <div class="col-xs-8"></div>
        </div>`
      )
      break
  }
}

const handleCache = (widgetRef, prevTab, curTab) => {
  let prevVal = {
    dataFetchMethod: widgetRef.config.dataFetchMethod
      ? widgetRef.config.dataFetchMethod
      : '',
    defaultValue: widgetRef.config.defaultValue
      ? widgetRef.config.defaultValue
      : [],
    dictTypeCode: widgetRef.config.dictTypeCode
      ? widgetRef.config.dictTypeCode
      : '',
    dictTypeName: widgetRef.config.dictTypeName
      ? widgetRef.config.dictTypeName
      : '',
    options: widgetRef.config.options ? widgetRef.config.options : [],
    customerQuery: widgetRef.config.customerQuery
      ? widgetRef.config.customerQuery
      : ''
  }
  sessionStorage.setItem(
    `${widgetRef.id}_tab_${prevTab}`,
    JSON.stringify(prevVal)
  )
  // 清空当前 data 的数据
  widgetRef.config.dataFetchMethod = undefined
  widgetRef.config.defaultValue = []
  widgetRef.config.dictTypeCode = undefined
  widgetRef.config.dictTypeName = undefined
  widgetRef.config.options = []
  widgetRef.config.customerQuery = ''

  // 触发数据的变化（切换tab，改变数据获取方式）
  if (sessionStorage.getItem(`${widgetRef.id}_tab_${curTab}`)) {
    let prevVal = JSON.parse(
      sessionStorage.getItem(`${widgetRef.id}_tab_${curTab}`)
    )
    widgetRef.config.dataFetchMethod = prevVal.dataFetchMethod
    widgetRef.config.defaultValue = prevVal.defaultValue
    widgetRef.config.dictTypeCode = prevVal.dictTypeCode
    widgetRef.config.dictTypeName = prevVal.dictTypeName
    widgetRef.config.options = prevVal.options
    widgetRef.config.customerQuery = prevVal.customerQuery
  }
}

const validate = (value, rule, customerRule) => {
  let _rule = null
  const rules = {
    email: /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    number: /^[0-9]*$/g,
    url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    cellphone: /^1[34578]\d{9}$/,
    IPAddress: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    chinese: /^[\u4e00-\u9fa5]*$/,
    english: /^[A-Za-z]+$/,
    enAndNum: /^[A-Za-z0-9]+$/,
    IDNumber: /^[1-8](\d{14})$|^[1-8](\d{16})[0-9xX]$/
  }

  if (customerRule) {
    _rule = customerRule
  } else {
    _rule = rules[rule]
  }

  const reg = new RegExp(_rule, 'g')
  return reg.test(value)
}

function createOptions({ config, type }) {
  const { options, defaultValue } = config

  let _options = ''
  if (type === 'select') {
    options.forEach(option => {
      let { label, value, id } = option
      _options = `${_options}
                <div class="optionsContainer">
                  <input type="${config.multiple ? 'checkbox' : 'radio'}" ${
        config.defaultValue.indexOf(value) === -1 ? '' : 'checked'
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
    return _options
  }
  options.forEach(option => {
    let { label, value, id } = option
    _options = `${_options}
                <div class="optionsContainer">
                  <input type="${
                    type === 'radio' ? 'radio' : 'checkbox'
                  }" name="${
      type === 'radio' ? 'optionRadioControl' : 'optionCheckboxControl'
    }" data-index=${id} ${defaultValue === value ? 'checked' : ''} />
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
  })
  return _options
}

const showConfigPanel = widgetId => {
  const editContainer = $('#fd-widget-edit-container') // 获取容器
  const clearPanel = () => {
    // 清除 panel 的方法
    if (editContainer.children().length > 0) {
      editContainer
        .children()
        .animate({ height: '0', opacity: 0 }, 500, function() {
          $(this).remove() // 淡出动画，并移除 DOM
        })
    }
  }

  // 如果面板里已经有内容了，清除掉
  clearPanel()

  // 加载属性面板
  // 生成属性面板的 DOM,绑定属性修改时的触发事件，给全局 DATA 发送修改指令，返回 DOM
  let widgetConfigs = store.data.fields[widgetId].config
  let editPanel = store.pluginMap[widgetId].createConfigPanel()
  editContainer.append(editPanel)
  store.pluginMap[widgetId].configPanelRef = editPanel // 创建配置面板的dom引用加入实例化对象的属性中
  if (store.pluginMap[widgetId].afterConfigPanelInit) {
    store.pluginMap[widgetId].afterConfigPanelInit()
  }

  $('.fd-col').removeClass('configing')

  setTimeout(() => {
    $(`#${widgetId}`)
      .parent('.fd-col')
      .addClass('configing')
  }, 0)
}

const onRowHeightChange = callback => {
  let widgetHeightAry = []
  const $canvas = $('#fd-canvas')
  $canvas.find('.fd-row').each(function(i, row) {
    let $row = $(row)
    let curRowHeight = $row.height() // 扣除2px的边框
    // console.log('curRowHeight', curRowHeight)
    let widgets = $row.find('.widget-box')
    if (widgets.length > 0) {
      widgets.each(function(i, widget) {
        let widgetH = $(widget).height() + 2
        widgetHeightAry.push(widgetH)
      })
      let maxHeight = Math.max(...widgetHeightAry)
      $row.find('.fd-col').css('height', maxHeight)
      widgetHeightAry.length = 0
    } else {
      $row.find('.fd-col').css('min-height', '68px')
      $row.find('.fd-col').css('height', '68px')
    }
  })
}

const colSync = row => {
  let widgetHeightAry = []
  let curRowHeight = row.height() // 扣除2px的边框
  let widgets = row.find('.widget-box')
  if (widgets.length > 0) {
    widgets.each(function(i, widget) {
      let widgetH = $(widget).height() + 2
      widgetHeightAry.push(widgetH)
    })
    let maxHeight = Math.max(...widgetHeightAry)
    row.find('.fd-col').css('height', maxHeight)
    widgetHeightAry.length = 0
  } else {
    row.find('.fd-col').css('min-height', '68px')
    row.find('.fd-col').css('height', '68px')
  }
}

export {
  uuid,
  clone,
  createGrid,
  handleCache,
  validate,
  createOptions,
  showConfigPanel,
  onRowHeightChange,
  colSync
}
