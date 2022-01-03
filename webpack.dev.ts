import { merge } from 'webpack-merge';

import common from './webpack.common';

// Config
export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 4000,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:5000',
      }
    }
  }
});
