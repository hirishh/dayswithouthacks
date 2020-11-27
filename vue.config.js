module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Days Without Eth Hacks!';
        return args;
      });
  },

  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    hasTypescript: true,
    express: {
      shouldServeApp: true,
      serverDir: './server',
    },
  },
};
