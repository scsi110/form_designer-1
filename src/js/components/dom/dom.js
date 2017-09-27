import $ from 'jquery'

const Row = `
  <div class="row fd-row"></div>
`

const Column = `
  <div class="fd-col"></div>
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

const Label = `
  <label></label>
`

const input = `
  <input />
`

const WidgetBox = `
  <div class="widget-box"></div>
`

export { Text, button, textatrea, Column, Row, WidgetBox, input, Label }
