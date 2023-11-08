# @rive-app/react-canvas-lite

Output for `rive-react` using the backing `@rive-app/canvas-lite` JS runtime.

## Why Lite?

The current `@rive-app/react-canvas` dependency supports all Rive features and contains the necessary backing dependencies to render those graphics. This `lite` version has the same API, but does not compile and build with certain dependencies in order to keep the package size as small as possible.

At this time, this lite version of `@rive-app/react-canvas-lite` will not render [Rive Text](https://help.rive.app/editor/text) onto the canvas. Note however, that even if your Rive file may include Rive Text components when using this package, the canvas will still render the graphic without the Rive Text components.
