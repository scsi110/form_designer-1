import createGrid from '../utils'

const createDOM = obj => {
  if (obj.type === 'layout') {
    switch (obj.name) {
      case 'oneColumn':
        createDOM(1)
        break
      case 'twoColumn':
        createGrid(2)
        break
      case 'threeColumn':
        createGrid(3)
        break
      default:
        break
    }
  }
}

export default createDOM
