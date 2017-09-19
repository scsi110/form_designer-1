module.exports = {
  plugins: [
    require('cssnano')({
      preset: 'default'
    }),
    require('autoprefixer')({
      browserslist: ['> 1%', 'last 2 versions', 'Edge', 'ie >= 9']
    }),
    require('postcss-flexibility'),
    require('postcss-color-rgba-fallback'),
    require('postcss-opacity')
  ]
}
