import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

// Config
const config: webpack.Configuration = {
  entry: {
    main: './src/index'
  },
  output: {
    clean: true,
    publicPath: '/ants/',
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 1000000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'swc-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_URL: 'http://localhost:3000',
      AUTH_DOMAIN: 'ants-dev.auth.eu-west-3.amazoncognito.com',
      AUTH_IDENTITY_POOL_ID: 'eu-west-3:49a54efc-2d14-4e4f-8f79-483333afa4bf',
      AUTH_USER_POOL_ID: 'eu-west-3_3GnLIjjNo',
      AUTH_CLIENT_ID: '18n89po3rl347oi32ibir91t0t',
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**',
          context: path.resolve(__dirname, 'public'),
          globOptions: { ignore: ['**/public/index.html'] }
        },
      ]
    }),
    new ForkTsCheckerWebpackPlugin()
  ],
};

export default config;
