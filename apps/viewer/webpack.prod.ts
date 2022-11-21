import { merge } from 'webpack-merge';

import common from './webpack.common';

// Config
export default async function prod() {
  return merge(await common(), {
    mode: 'production',
    devtool: 'source-map',
  });
}
