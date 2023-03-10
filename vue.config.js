module.exports = {
  devServer: {
    host: 'localhost',
  },

  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/performance/t5',

  transpileDependencies: [
    'vuetify'
  ]
};
