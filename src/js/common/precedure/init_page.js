import $ from 'jquery'

const initPage = containerId => {
  // 设置总体布局为 container-fluid
  const mainContainer = $(`#${containerId}`).addClass('container-fluid')
  // 生成页面的主体元素
  const header = $(
    `<div class="row">
        <div class="col-xs-24">
          <h1 id="form-designer-logo">Form Designer</h1>
        </div>
      </div>`
  )
  const wrapperRow = $('<div class="row fd-wrapper"></div>')
  const widgetPanel = $(
    `<div class="col-xs-4 fd-panel" id="fd-widget-panel">
      <h2>布局</h2>
      <ul class="widget-panel-menu" id="fd-layout-list">
        <li id="single-column" class="fd-widget" draggable=true data-type='column_one'>单列布局</li>
        <li id="two-collumn" class="fd-widget" draggable=true data-type="column_two">双列布局</li>
        <li id="three-column" class="fd-widget" draggable=true data-type="column_three">三列布局</li>
      </ul>
      <h2>组件</h2>
      <ul class="widget-panel-menu" id="fd-widget-list">
      </ul>     
    </div>`
  )
  const editPanel = $(
    '<div class="col-xs-6 fd-panel" id="fd-edit-panel"></div>'
  )
  const canvas = $(
    `<div class="col-xs-14 fd-panel canvas-container">
        <div id="fd-canvas"></div>
      </div>`
  )
  // 组合元素
  wrapperRow.append(widgetPanel)
  wrapperRow.append(canvas)
  wrapperRow.append(editPanel)

  mainContainer.append(header)
  mainContainer.append(wrapperRow)
}

export default initPage
