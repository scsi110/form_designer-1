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

export { uuid, clone, createGrid }
