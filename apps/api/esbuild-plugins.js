const alias = require('esbuild-plugin-alias');
const path = require('node:path');

module.exports = [
  alias({
    '#node-web-compat': path.join(path.dirname(path.dirname(require.resolve('aws-jwt-verify'))), 'esm', 'node-web-compat-node.js')
  })
];
