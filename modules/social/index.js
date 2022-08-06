const path = require('path');

export default function socialModule(_moduleOptions) {
  const { nuxt, addPlugin } = this;

  // Combine options
  const options = {
    ...nuxt.options.social,
    ..._moduleOptions,
  };

  // Register plugin
  addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'social.js',
    options,
  });
}
