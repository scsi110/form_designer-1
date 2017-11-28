import uuidv4 from 'uuid-v4'

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

function createOptions(config) {
  const { options, defaultValue, type } = config
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
      type === 'radio' ? 'optionRadioControl' : 'checkboxRadioControl'
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

export { uuid, clone, createGrid, handleCache, validate, createOptions }
