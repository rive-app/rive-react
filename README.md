![Build Status](https://github.com/rive-app/rive-react/actions/workflows/tests.yml/badge.svg)
![Discord badge](https://img.shields.io/discord/532365473602600965)
![Twitter handle](https://img.shields.io/twitter/follow/rive_app.svg?style=social&label=Follow)

# Rive React

![Rive hero image](https://cdn.rive.app/rive_logo_dark_bg.png)

Rive React is the React runtime for [Rive](https://rive.app).

This library is a wrapper around the [JS/Wasm runtime](https://github.com/rive-app/rive-wasm), giving full control over the JS/Wasm runtime while providing components and hooks for React applications.

For more information, check out the following resources:

- [Homepage](https://rive.app/)
- [General Docs](https://rive.app/docs/)
- [React Docs](https://rive.app/docs/runtimes/react/react)
- [Rive Community / Support](https://community.rive.app/c/support/)

## Table of contents

- :star: [Rive Overview](#rive-overview)
- 🤖 [Build with your agent](#build-with-your-agent)
- 🚀 [Getting Started & API docs](#getting-started)
- :mag: [Supported Versions](#supported-versions)
- :books: [Examples](#examples)
- :runner: [Migration Guides](#migration-guides)
- 👨‍💻 [Contributing](#contributing)
- :question: [Issues](#issues)

## Rive overview

[Rive](https://rive.app) is an agent-native 2D and 3D engine for games, apps, and interactive UI. Use it as your whole engine, or add it to the products you already have. Build with your coding agent through the [Rive CLI](https://rive.app/agents), or draw, rig, and animate by hand with the professional design and animation tools in the [Rive Editor](https://rive.app/editor). Both work on the same files. The open-source runtimes play those files (`.riv`) natively on web, mobile, desktop, game engines, consoles, smart TVs, and cars, with no royalties or runtime fees.

:house_with_garden: [Homepage](https://rive.app/)

:blue_book: [General help docs](https://rive.app/community/doc/)

🛠 [Rive Forums](https://rive.app/community/forums/home)

## Build with your agent

Paste this into Claude Code, Codex, Cursor, or any agent that runs commands on your computer:

```text
Install the Rive CLI from rive.app/cli. Build an interactive hero as a Rive file and add it to my React app with the Rive React runtime.
```

Your agent installs the [Rive CLI](https://rive.app/agents), writes the scene, and opens a preview window that rebuilds every time it saves. Keep giving it notes, or open the same file in the [Rive Editor](https://editor.rive.app/) and shape it by hand. Trying it needs no account. Writing the `.riv` that ships in your app needs a free Rive account. See [Getting started with the Rive CLI](https://rive.app/docs/cli/getting-started).

## Getting started

Follow along with the link below for a quick start in getting Rive React integrated into your React apps.

- [Getting Started with Rive in React](https://rive.app/community/doc/react/docRfaSQ0eaE)
- [API documentation](https://rive.app/community/doc/parameters-and-return-values/docJlDMNulDh)

For more information, see the Runtime sections of the Rive help documentation:

- [Animation Playback](https://rive.app/community/doc/animation-playback/docDKKxsr7ko)
- [Layout](https://rive.app/community/doc/layout/docBl81zd1GB)
- [State Machines](https://rive.app/community/doc/state-machines/docxeznG7iiK)
- [Rive Text](https://rive.app/community/doc/text/docn2E6y1lXo)
- [Rive Events](https://rive.app/community/doc/rive-events/docbOnaeffgr)
- [Loading Assets](https://rive.app/community/doc/loading-assets/doct4wVHGPgC)

## Supported versions

This library supports React versions `^16.8.0` through `^19.0.0`.

## Examples

Check out our Storybook instance that shows how to use the library in small examples, along with code snippets! This includes examples using the basic component, as well as the convenient hooks exported to take advantage of state machines.

- [Mouse tracking](https://codesandbox.io/s/rive-mouse-track-test-t0y965?file=/src/App.js)
- [Accessibility concerns](https://rive.app/blog/accesible-web-animations-aria-live-regions)

### Awesome Rive

For even more examples and resources on using Rive at runtime or in other tools, checkout the [awesome-rive](https://github.com/rive-app/awesome-rive) repo.

## Migration guides

Using an older version of the runtime and need to learn how to upgrade to the latest version? Check out the migration guides below in our help center that help guide you through version bumps; breaking changes and all!

[Migration guides](https://rive.app/community/doc/migrating-from-v3-to-v4/dociIPXVHKFF)

## Contributing

We love contributions! Check out our [contributing docs](./CONTRIBUTING.md) to get more details into how to run this project, the examples, and more all locally.

## Issues

Have an issue with using the runtime, or want to suggest a feature/API to help make your development life better? Log an issue in our [issues](https://github.com/rive-app/rive-react/issues) tab! You can also browse older issues and discussion threads there to see solutions that may have worked for common problems.
