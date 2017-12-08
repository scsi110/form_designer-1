import store from '../../store/store'

const initPage = containerId => {
  // 设置总体布局为 container-fluid
  const mainContainer = $(`#${containerId}`).addClass('container-fluid')
  const wrapperRow = $('<div class="fd-wrapper"></div>')
  // 生成页面的主体元素
  const header = `<div class="row">
        <div class="col-xs-24">
          <h1 id="form-designer-logo">表单设计器</h1>
        </div>
      </div>`

  const widgetPanel = `
    <div class="fd-panel mCustomScrollbar" id="fd-widget-panel" data-mcs-theme="minimal-dark">
      <h2>布局</h2>
      <ul class="widget-panel-menu" id="fd-layout-list">
        <li id="single-column" class="fd-widget" draggable=true data-type='column_one'>单列布局</li>
        <li id="two-collumn" class="fd-widget" draggable=true data-type="column_two">双列布局</li>
        <li id="three-column" class="fd-widget" draggable=true data-type="column_three">三列布局</li>
        <li id="four-column" class="fd-widget" draggable=true data-type="column_four">四列布局</li>
      </ul>
      <h2>组件</h2>
      <ul class="widget-panel-menu" id="fd-widget-list">
      </ul>     
    </div>`

  /*
    表单信息面板
    ${store.formConfig.formDescriber
        ? '<div class="col-xs-24 edit-panel-wrapper form-info"><h2>表单信息</h2><div id="fd-form-edit-container"><label>表单名称：</label><input class="c-field" /></div></div>'
        : ''}
  */

  const editPanel = `
      <div id="fd-edit-panel">
        <div class="edit-panel-wrapper widget-edit mCustomScrollbar" data-mcs-theme="minimal-dark">
          <h2>组件编辑面板</h2>
          <div id="fd-widget-edit-container"></div>
        </div>
      </div>`

  const canvas = `
      <div class="fd-panel canvas-container mCustomScrollbar" data-mcs-theme="minimal-dark">
        <div id="fd-canvas"></div>
      </div>`

  // 组合元素
  wrapperRow.append(widgetPanel)
  wrapperRow.append(canvas)
  wrapperRow.append(editPanel)

  // mainContainer.append(header)
  mainContainer.append(wrapperRow)

  const $canvasContainer = $('.canvas-container')

  const setContainerHeight = () => {
    let clientHeight = document.documentElement.clientHeight
    $canvasContainer.height(clientHeight - 10)
  }
  setContainerHeight()

  window.onresize = function() {
    setContainerHeight()
  }
}

export default initPage
