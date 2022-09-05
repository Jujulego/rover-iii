import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

// Utils
async function loadParameters() {
  try {
    const client = new SSMClient({ region: 'eu-west-3' });
    const parameters = await client.send(new GetParametersByPathCommand({ Path: '/ants/dev' }));

    return new Map(parameters.Parameters?.map((p) => [p.Name, p.Value]));
  } catch (err) {
    console.warn('Failed to load SSM Parameters', err);
    return new Map();
  }
}

// Config
export default async function common(): Promise<webpack.Configuration> {
  const ssm = await loadParameters();

  return {
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
            name(module: webpack.Module) {
              if (module.identifier().match(/[\\/](@aws|amazon)/)) {
                return 'aws.vendors';
              }

              if (module.identifier().match(/[\\/](@mui|@emotion)/)) {
                return 'mui.vendors';
              }

              return 'vendors';
            },
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
        AUTH_DOMAIN: ssm.get('/ants/dev/auth-domain') ?? 'AUTH_DOMAIN',
        AUTH_IDENTITY_POOL_ID: ssm.get('/ants/dev/identity-pool-id') ?? 'AUTH_IDENTITY_POOL_ID',
        AUTH_USER_POOL_ID: ssm.get('/ants/dev/user-pool-id') ?? 'AUTH_USER_POOL_ID',
        AUTH_CLIENT_ID: ssm.get('/ants/dev/client-id') ?? 'AUTH_CLIENT_ID',
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
}
