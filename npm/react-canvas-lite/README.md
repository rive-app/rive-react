# @rive-app/react-canvas-lite

The React runtime for [Rive](https://rive.app), using the `@rive-app/canvas-lite` JS runtime. Docs and examples: [rive-react](https://github.com/rive-app/rive-react) and the [React docs](https://rive.app/docs/runtimes/react/react).

[Rive](https://rive.app) is an agent-native 2D and 3D engine for games, apps, and interactive UI. Use it as your whole engine, or add it to the products you already have. Build with your coding agent through the [Rive CLI](https://rive.app/agents), or draw, rig, and animate by hand with the professional design and animation tools in the [Rive Editor](https://rive.app/editor). Both work on the same files. Open-source runtimes, no royalties or runtime fees. Rive files (`.riv`) play natively on web, mobile, desktop, game engines, consoles, smart TVs, and cars.

## Why Lite?

The current `@rive-app/react-canvas` dependency supports all Rive features and contains the necessary backing dependencies to render those graphics. This `lite` version has the same API, but does not compile and build with certain dependencies in order to keep the package size as small as possible.

At this time, this lite version of `@rive-app/react-canvas-lite` will not render Rive Text onto the canvas or play Rive Audio. Note however, that even if your Rive file may include Rive Text components, rendering the graphic should not cause any app errors, or cease to render. The same is true for playing audio.

## Build with your agent

Paste this into Claude Code, Codex, Cursor, or any agent that runs commands on your computer:

```text
Install the Rive CLI from rive.app/cli. Build an interactive hero as a Rive file and add it to my React app with the Rive React runtime.
```

Your agent installs the [Rive CLI](https://rive.app/agents), writes the scene, and opens a preview window that rebuilds every time it saves. Keep giving it notes, or open the same file in the [Rive Editor](https://editor.rive.app/) and shape it by hand. Trying it needs no account. Writing the `.riv` that ships in your app needs a free Rive account. See [Getting started with the Rive CLI](https://rive.app/docs/cli/getting-started).
