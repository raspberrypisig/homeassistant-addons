module.exports = function override(config, env) {
    config.optimization.minimize = false;
    config.optimization.splitChunks = {
        cacheGroups: {
          default: false,
        },
      };
      // Move runtime into bundle instead of separate file
      config.optimization.runtimeChunk = false;
      
      // JS
      config.output.filename = '[name].js';
      // CSS. "5" is MiniCssPlugin
      config.plugins[5].options.filename = '[name].css';
      config.plugins[5].options.publicPath = '../';
      config.plugins.splice(1, 1);
      config.plugins.splice(2, 1);
    console.log(config);
    return config;
  }