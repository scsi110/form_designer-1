import $ from 'jquery'

const column_one = `
  <div class="row fd-row">
    <div class="col-xs-24 fd-col"></div>
  </div>
`

const column_two = `
  <div class="row fd-row">
    <div class="col-xs-12 fd-col"></div>
    <div class="col-xs-12 fd-col"></div>
  </div>
`

const column_three = `
  <div class="row fd-row">
    <div class="col-xs-8 fd-col"></div>
    <div class="col-xs-8 fd-col"></div>
    <div class="col-xs-8 fd-col"></div>
  </div>
`

const text = `
  <div class="fd-input-container">
    <label fd-input-label>输入框</label>
    <input type="text" class="fd-input-body" placeholder="请输入" />
  </div>
`

const button = `
  <button class="fd-button">按钮</button>
`

const textatrea = `
  <textarea class="fd-textarea" placeholder="请输入文字"></textarea>
`

export { column_one, column_two, column_three, text, button, textatrea }
