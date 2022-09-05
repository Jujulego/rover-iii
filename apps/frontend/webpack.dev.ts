import { merge } from 'webpack-merge';
import 'webpack-dev-server';

import common from './webpack.common';

// Config
export default async function dev() {
  return merge(await common(), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      port: 4000,
      hot: true,
      historyApiFallback: true,
      open: ['/ants/']
    }
  });
}
