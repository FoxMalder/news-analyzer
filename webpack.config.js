const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    index: './src/pages/main/index.js',
    analytics: './src/pages/analytics/index.js',
    about: './src/pages/about/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      images: path.resolve(__dirname, 'src/images'),
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        sideEffects: true,
        use: [
          (isDev ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif|ico|svg)$/i,
        use: [{
            loader: 'file-loader',
            options: {
              name: './images/[name].[ext]',
              esModule: false,
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 90
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
            }
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=./vendor/[name].[ext]'
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default'],
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/main/index.html',
      inject: false,
      hash: true,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/about/about.html',
      inject: false,
      hash: true,
      chunks: ['about'],
      filename: 'about.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/analytics/analytics.html',
      inject: false,
      hash: true,
      chunks: ['analytics'],
      filename: 'analytics.html'
    }),
    new WebpackPwaManifest({
      name: 'NewsAnalyzer – сервис анализа новостей',
      short_name: 'NewsAnalyzer',
      icons: [{
          src: path.resolve(__dirname, 'src/images/favicon/android-chrome-192x192.png'),
          sizes: '192x192',
          type: 'image/png',
          destination: path.join('favicons'),
        },
        {
          src: path.resolve(__dirname, 'src/images/favicon/android-chrome-512x512.png'),
          sizes: '512x512',
          type: 'image/png',
          destination: path.join('favicons'),
        },
        {
          src: path.resolve(__dirname, 'src/images/favicon/apple-touch-icon.png'),
          sizes: '180x180',
          type: 'image/png',
          destination: path.join('favicons'),
        },
        {
          src: path.resolve(__dirname, 'src/images/favicon/favicon-16x16.png'),
          sizes: '16x16',
          type: 'image/png',
          destination: path.join('favicons'),
        },
        {
          src: path.resolve(__dirname, 'src/images/favicon/favicon-32x32.png'),
          sizes: '32x32',
          type: 'image/png',
          destination: path.join('favicons'),
        }
      ],
      theme_color: '#fff',
      background_color: '#fff',
      display: 'standalone',
    }),
    new WebpackMd5Hash(),
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
}