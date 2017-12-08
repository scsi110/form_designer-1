import Text from './text/text'
import Select from './select'
import DatePicker from './datepicker'
import Textarea from './textarea'
import CKEditor from './ckeditor'
import FileUpload from './fileupload'
import CheckboxGroup from './checkbox_group'
import RadioGroup from './radio_group'
import HiddenInput from './hidden_input'
import Paragraph from './paragraph'
import PeopleSelector from './people_selector'
import DepartmentSelector from './department_selector'
import AddRow from './layout/layout'
import store from '../store/store'

const PLUGINS = {
  checkbox: CheckboxGroup,
  radio: RadioGroup,
  hiddenInput: HiddenInput,
  text: Text,
  textarea: Textarea,
  ckeditor: CKEditor,
  select: Select,
  datepicker: DatePicker,
  fileUpload: FileUpload,
  paragraph: Paragraph,
  peopleSelector: PeopleSelector,
  departmentSelector: DepartmentSelector
}

const createComponent = (type, containerId) => {
  let plugin = new PLUGINS[type]() // 实例化对象
  plugin.containerId = containerId // 添加容器的 id
  store.addField(plugin.transData()) // 发送数据改变指令
  return plugin
}

const createInstance = type => {
  let instance = new PLUGINS[type]() // 实例化对象
  return instance
}

export { createComponent, createInstance, AddRow, PLUGINS }
