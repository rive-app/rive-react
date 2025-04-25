const path = require('path');

module.exports = {
  // other settings...
  resolve: {
    alias: {
      '@rive-app/react-canvas': path.resolve(__dirname, '../'),
      '@rive-app/react-webgl': path.resolve(__dirname, '../'),
      '@rive-app/react-webgl2': path.resolve(__dirname, '../'),
      '@rive-app/react-canvas-lite': path.resolve(__dirname, '../'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../'),
        ],
        use: 'babel-loader',
      },
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
