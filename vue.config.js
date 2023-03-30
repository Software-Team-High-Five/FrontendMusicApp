module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080
  },

  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/performance/t5',

  transpileDependencies: [
    'vuetify'
  ]
};
