module.exports = {
  "stories": [
    "../examples/**/*.stories.mdx",
    "../examples/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  staticDirs: ['../examples/stories/assets'],
}