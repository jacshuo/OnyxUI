/**
 * Webpack — Demo production build (for GitHub Pages)
 *
 * Usage: webpack --config webpack.demo.config.cjs
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: false,

  entry: path.resolve(__dirname, 'demo/main.tsx'),

  output: {
    path: path.resolve(__dirname, 'dist-demo'),
    filename: 'assets/[name].[contenthash:8].js',
    publicPath: '/OnyxUI/',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'demo/index.html'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'demo/404.html'),
      filename: '404.html',
      inject: false,
    }),
    {
      // Inject <base href="/OnyxUI/"> and SPA redirect handler into index.html
      apply(compiler) {
        compiler.hooks.compilation.tap('InjectBase', (compilation) => {
          HtmlWebpackPlugin.getCompilationHooks(compilation).beforeEmit.tapAsync(
            'InjectBase',
            (data, cb) => {
              if (data.outputName === 'index.html') {
                // Add <base> tag
                data.html = data.html.replace('<head>', '<head>\n    <base href="/OnyxUI/" />');
                // Add SPA redirect handler (receives path from 404.html redirect)
                const spaScript = `<script>(function(){var r=window.location.search.match(/^\?\/(.+)$/);if(r){window.history.replaceState(null,null,'/OnyxUI/'+r[1].replace(/~and~/g,'&'))}})()</script>`;
                data.html = data.html.replace('</head>', spaScript + '\n  </head>');
              }
              cb(null, data);
            },
          );
        });
      },
    },
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash:8].css',
    }),
  ],

  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
