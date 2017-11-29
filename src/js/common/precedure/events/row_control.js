import store from '../../../store/store'

const rowControl = (row, id) => {
  let timer
  row.on('mouseenter', function(e) {
    let $this = $(this)
    timer = setTimeout(function() {
      e.preventDefault()
      $this.find('.row-control').animate({ opacity: 1, left: '-30px' }, 500)
    }, 380)
  })
  row.on('mouseleave', function(e) {
    clearTimeout(timer)
    e.preventDefault()
    let $this = $(this)
    $this.find('.row-control').animate({ opacity: 0, left: '0' }, 400)
  })

  row.find('i').on('click', function() {
    if ($(`#${id}`).find('.configing').length > 0) {
      $('#fd-widget-edit-container').empty()
    }
    store.removeRow(id)
  })

  return row
}

export default rowControl
