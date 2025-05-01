import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    config.resolve.alias['react'] = path.resolve(
      __dirname,
      '../../node_modules/react'
    );
    config.resolve.alias['react-dom'] = path.resolve(
      __dirname,
      '../../node_modules/react-dom'
    );

    config.resolve.alias['@rive-app/react-canvas'] = path.resolve(
      __dirname,
      '../../'
    );
    config.resolve.alias['@rive-app/react-canvas-lite'] = path.resolve(
      __dirname,
      '../../'
    );
    config.resolve.alias['@rive-app/react-webgl'] = path.resolve(
      __dirname,
      '../../'
    );
    config.resolve.alias['@rive-app/react-webgl2'] = path.resolve(
      __dirname,
      '../../'
    );

    config.module?.rules?.push({
      test: /\.(ts|tsx|js|jsx)$/,
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../../'),
      ],
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
            require.resolve('@babel/preset-typescript'),
          ],
        },
      },
    });

    config.watchOptions = {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
};

export default config;
