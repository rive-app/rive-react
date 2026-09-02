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
    config.resolve.alias['@rive-app/react-webgl2'] = path.resolve(
      __dirname,
      '../../'
    );

    /**
     * Every story renders on webgl2.
     *
     * The three aliases above all point at the rive-react root, whose
     * `dist/index.js` imports `@rive-app/canvas` unconditionally. So the
     * `@rive-app/react-*` name a story imports selects nothing: every story
     * shares one backend, and this is where it is chosen.
     *
     * webgl2 because the GPU Canvas stories need it — their .riv files are
     * shader-driven and canvas2d has no shader stage, so those canvases render
     * blank on canvas2d while still reporting deferred (see gpuCanvasShared.ts).
     * Every other story renders the same on either backend.
     *
     * To check something against canvas2d, drop this alias rather than adding a
     * flag — it is one line, and a half-configured backend is worse than an
     * edit.
     */
    config.resolve.alias['@rive-app/canvas'] = path.resolve(
      __dirname,
      '../../node_modules/@rive-app/webgl2'
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
