const path = require('path');
const child_process = require('child_process');
const Handlebars = require('handlebars');
const uuid = require('uuid');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const getUniqueIDOfCurSourceCode = () => {
  try {
    const out = child_process.execSync('git log --abbrev-commit HEAD -1').toString();
    const outAsArr = out.replace(/\n/g, ' ').replace(/\t/g, ' ').split(' ');

    const latestCommitID = outAsArr[outAsArr.indexOf('commit') + 1];

    return latestCommitID;
  } catch (err) {
    console.error(err.message);
  }

  // if getting unique ID Git commit fails, use UUID v4 with 'u' prefix
  return `u${uuid.v4()}`;
};

const cache_version = getUniqueIDOfCurSourceCode();

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  watch: true,

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html',
            },
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attributes: false,
              preprocessor: (content, loaderContext) => {
                let result;

                try {
                  result = Handlebars.compile(content)({
                    cache_version,
                  });
                } catch (error) {
                  loaderContext.emitError(error);
                  return content;
                }

                return result;
              },
            },
          },
        ],
      },
    ],
  },
};
