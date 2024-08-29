# @rive-app/react-canvas-lite

Output for `rive-react` using the backing `@rive-app/canvas-lite` JS runtime.

## Why Lite?

The current `@rive-app/react-canvas` dependency supports all Rive features and contains the necessary backing dependencies to render those graphics. This `lite` version has the same API, but does not compile and build with certain dependencies in order to keep the package size as small as possible.

At this time, this lite version of `@rive-app/react-canvas-lite` will not render Rive Text onto the canvas or play Rive Audio. Note however, that even if your Rive file may include Rive Text components, rendering the graphic should not cause any app errors, or cease to render. The same is true for playing audio.
