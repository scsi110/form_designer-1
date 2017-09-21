import createGrid from '../utils'

const createDOM = obj => {
  if (obj.type === 'layout') {
    switch (obj.name) {
      case 'oneColumn':
        return createDOM(1)
        break
      case 'twoColumn':
        return createGrid(2)
        break
      case 'threeColumn':
        return createGrid(3)
        break
      default:
        break
    }
  }
}

export default createDOM
