const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CURRENT_WORKING_DIR = process.cwd();

module.exports = {
  // Entry point for the application
  entry: [path.join(CURRENT_WORKING_DIR, 'app/index.js')],
  resolve: {
    // File extensions to resolve
    extensions: ['.js', '.json', '.css', '.scss', '.html'],
    alias: {
      // Alias for app directory
      app: 'app'
    }
  },
  module: {
    rules: [
      {
        // Process JavaScript and JSX files with Babel
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    // Copy static files from public directory to output directory
    new CopyWebpackPlugin([
      {
        from: 'public'
      }
    ])
  ]
};
