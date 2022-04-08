module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 192,
      propList: ['!box-shadow', '!-webkit-box-shadow', '!border-radius', '*'],
      selectorBlackList: ['.ig-']
    }
  }
}
