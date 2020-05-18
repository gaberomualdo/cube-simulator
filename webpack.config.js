const path = require('path');
const childProcess = require('child_process');
const uuid = require('uuid');
const config = require('config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Handlebars = require('handlebars');

const handlebarsInput = JSON.parse(JSON.stringify(config.get('hbs')));

const sourceCodeVersionUniqueID = (() => {
  try {
    const out = childProcess.execSync('git log --abbrev-commit HEAD -1').toString();
    const outAsArr = out.replace(/\n/g, ' ').replace(/\t/g, ' ').split(' ');

    const latestCommitID = outAsArr[outAsArr.indexOf('commit') + 1];

    return latestCommitID;
  } catch (err) {
    console.error(err.message);
  }

  // if getting unique ID Git commit fails, use UUID v4 with 'u' prefix
  return `u${uuid.v4()}`;
})();

handlebarsInput.cacheVersion = sourceCodeVersionUniqueID;

Handlebars.registerHelper('times', function (n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('generateMovesMarkup', function (moves, block) {
  let rows = 4;
  let cols = 3;

  let accum = '';

  for (let row = 0; row < rows; row++) {
    accum += "<ul class='row'>";
    for (let item = 0; item < cols; item++) {
      block.data.move = moves[row * cols + item];
      accum += block.fn(this);
    }
    accum += '</ul>';
  }
  return accum;
});

Handlebars.registerHelper('replace', function (target, replacement, block) {
  return new Handlebars.SafeString(block.fn(this).split(target).join(replacement));
});

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
                  result = Handlebars.compile(content)(handlebarsInput);
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
