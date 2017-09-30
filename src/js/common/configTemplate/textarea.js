const Textarea = ({ rows }) => {
  return `
  <ul class="fd-widget-configs" id="fd-config-list">
    <li class="fd-config-item">
        <div class="ui form field">
          <label></label>
          <input type="text" data-type="placeholder" value='${placeholder}' />
        </div>
      </li>
      <li class="fd-config-item">
        <div class="ui form field">
          <label>标签</label>
          <input type="text" data-type="label" value="${label}" />
        </div>
      </li>
      <li class="fd-config-item">
        <div class="ui form field">
          <label>默认值</label>
          <input type="text" data-type="defaultValue" value="${defaultValue ===
          undefined
            ? ''
            : defaultValue}" />
        </div>
      </li>
  </ul>
  `
}
