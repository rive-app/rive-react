![Build Status](https://github.com/rive-app/rive-react/actions/workflows/tests.yml/badge.svg)
![Discord badge](https://img.shields.io/discord/532365473602600965)
![Twitter handle](https://img.shields.io/twitter/follow/rive_app.svg?style=social&label=Follow)

# Rive React

React Runtime for [Rive](https://rive.app).

A wrapper around [Rive.js](https://github.com/rive-app/rive-wasm), providing full control over the js runtime while making it super simple to use in React applications.

Detailed runtime documentation can be found in [Rive's help center](https://help.rive.app/runtimes).

## Create and ship interactive animations to any platform

[Rive](https://rive.app) is a real-time interactive design and animation tool. Use our collaborative editor to create motion graphics that respond to different states and user inputs. Then load your animations into apps, games, and websites with our lightweight open-source runtimes.

## Installation

```
npm i --save rive-react
```

_Note: This library is using React hooks so the minimum version required for both react and react-dom is 16.8.0._

## Usage

### Component

Rive React provides a basic component as it's default import for displaying simple animations.

```js
import Rive from 'rive-react';

function Example() {
  return <Rive src="loader.riv" />;
}

export default Example;
```

#### Props

- `src`: File path or URL to the .riv file to display.
- `artboard`: _(optional)_ Name to display.
- `animations`: _(optional)_ Name or list of names of animtions to play.
- `layout`: _(optional)_ Layout object to define how animations are displayed on the canvas. See [Rive.js](https://github.com/rive-app/rive-wasm#layout) for more details.
- _All attributes and eventHandlers that can be passed to a `canvas` element can also be passed to the `Rive` component and used in the same manner._

#### Styles and Classes

When rendering out a Rive component, in the DOM, it will show as a `<div>` element that contains the `<canvas>` element that powers the Rive animations. The purpose of the `<div>` element is to help control the sizing of the component. By default, the container has the following styles set on the `style` attribute:
```css
width: 100%;
height: 100%;
```

If you decide to pass in a `className` to the Rive component, you will override these attributes, and you will need to either set these style attributes in your CSS associated with that `className`, or set your own sizing preferences. 

### useRive Hook

For more advanced usage, the `useRive` hook is provided. The hook will return a component and a [Rive.js](https://github.com/rive-app/rive-wasm) `Rive` object which gives you control of the current rive file.

```js
import { useRive } from 'rive-react';

function Example() {
  const params = {
    src: 'loader.riv',
    autoplay: false,
  };
  const { RiveComponent, rive } = useRive(params);

  return (
    <RiveComponent
      onMouseEnter={() => rive && rive.play()}
      onMouseLeave={() => rive && rive.pause()}
    />
  );
}

export default Example;
```

#### Parameters

- `riveParams`: Set of parameters that are passed to the Rive.js `Rive` class constructor. `null` and `undefined` can be passed to conditionally display the .riv file.
- `opts`: Rive React specific options.

#### Return Values

- `RiveComponent`: A Component that can be used to display your .riv file. This component accepts the same attributes and event handlers as a `canvas` element.
- `rive`: A Rive.js `Rive` object. This will return as null until the .riv file has fully loaded.
- `canvas`: HTMLCanvasElement object, on which the .riv file is rendering.
- `setCanvasRef`: A callback ref that can be passed to your own canvas element, if you wish to have control over the rendering of the Canvas element.
- `setContainerRef`: A callback ref that can be passed to a container element that wraps the canvas element, if you which to have control over the rendering of the container element.
  _For the vast majority of use cases, you can just the returned `RiveComponent` and don't need to worry about `setCanvasRef` and `setContainerRef`._

#### riveParams

- `src?`: _(optional)_ File path or URL to the .riv file to use. One of `src` or `buffer` must be provided.
- `buffer?`: _(optional)_ ArrayBuffer containing the raw bytes from a .riv file. One of `src` or `buffer` must be provided.
- `artboard?`: _(optional)_ Name of the artboard to use.
- `animations?`: _(optional)_ Name or list of names of animations to play.
- `stateMachines?`: _(optional)_ Name of list of names of state machines to load.
- `layout?`: _(optional)_ Layout object to define how animations are displayed on the canvas. See [Rive.js](https://github.com/rive-app/rive-wasm#layout) for more details.
- `autoplay?`: _(optional)_ If `true`, the animation will automatically start playing when loaded. Defaults to false.
- `onLoad?`: _(optional)_ Callback that get's fired when the .rive file loads .
- `onLoadError?`: _(optional)_ Callback that get's fired when an error occurs loading the .riv file.
- `onPlay?`: _(optional)_ Callback that get's fired when the animation starts playing.
- `onPause?`: _(optional)_ Callback that get's fired when the animation pauses.
- `onStop?`: _(optional)_ Callback that get's fired when the animation stops playing.
- `onLoop?`: _(optional)_ Callback that get's fired when the animation completes a loop.
- `onStateChange?`: _(optional)_ Callback that get's fired when a state change occurs.

#### opts

- `useDevicePixelRatio`: _(optional)_ If `true`, the hook will scale the resolution of the animation based the [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio). Defaults to `true`. NOTE: Requires the `setContainerRef` ref callback to be passed to a element wrapping a canvas element. If you use the `RiveComponent`, then this will happen automatically.
- `fitCanvasToArtboardHeight`: _(optional)_ If `true`, then the canvas will resize based on the height of the artboard. Defaults to `false`.
- `useOffscreenRenderer`: _(optional)_ If `true`, the Rive instance will share (or create if one does not exist) an offscreen `WebGL` context. This allows you to display multiple Rive animations on one screen to work around some browser limitations regarding multiple concurrent WebGL contexts. If `false`, each Rive instance will have its own dedicated `WebGL` context, and you may need to be cautious of the browser limitations just mentioned. Defaults to `true`.

### useStateMachineInput Hook

The `useStateMachineInput` hook is provided to make it easier to interact with state machine inputs on a rive file.

```js
import { useRive, useStateMachineInput } from 'rive-react';

function Example() {
  const STATE_MACHINE_NAME = 'button';
  const INPUT_NAME = 'onClick';

  const { RiveComponent, rive } = useRive({
    src: 'button.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  const onClickInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    INPUT_NAME
  );

  // This example is using a state machine with a trigger input.
  return <RiveComponent onClick={() => onClickInput.fire()} />;
}

export default Example;
```

See our [examples](examples) folder for working examples of [Boolean](examples/state-machine-boolean-input) and [Number](examples/state-machine-number-input) inputs.

#### Parameters

- `rive`: A `Rive` object. This is returned by the `useRive` hook.
- `stateMachineName`: Name of the state machine.
- `inputName`: Name of the state machine input.
- `initialValue`: Initial value to set on a state machine input when it's loaded in, for number or boolean inputs. **Note** that this may trigger any transitional animations between the initial state and any next states that depend on the input this `initialValue` is being set to. If this is problematic or conflicting for your case, we recommend setting the true initial value of the input on your state machine in the Rive editor. 

#### Return Value

A Rive.js `stateMachineInput` object.

## Examples

The [examples](examples) shows a number of different ways to use Rive React. See the instructions for each example to run locally.


## Migration notes

### Migrating from version 0.0.x to 1.x.x

Starting in v 1.0.0, we've migrated from wrapping around the `@rive-app/canvas` runtime (which uses the `CanvasRendereringContext2D` renderer) to the `@rive-app/webgl` runtime (which uses the WebGL renderer). The high-level API doesn't require any change to upgrade, but there are some notes to consider about the backing renderer.

The backing `WebGL` runtime allows for best performance across all devices, as well as support for some features that are not supported in the `canvas` renderer runtime. To allow the `react` runtime to support some of the newer features in Rive, we needed to switch the `rive-react` backing runtime to `@rive-app/webgl`. 

One note about this switch is that some browsers may limit the number of concurrent WebGL contexts. For example, Chrome may only support up to 16 contexts concurrently. We pass a property called `useOffscreenRenderer` set to true to the backing runtime when instantiating Rive by default, which helps to manage the lifecycle of the `canvas` with a single offscreen `WebGL` context, even if there are many Rive animations on the screen (i.e 16+). If you need a single `WebGL` context per Rive animation/instance, pass in the `useOffscreenRenderer` property set to `false` in the `useRive` options, or as a prop in the default export component from this runtime. See below for an example:

```js
const {rive, RiveComponent} = useRive({
  src: 'foo.riv',
}, {
  // Default (you don't need to set this)
  useOffscreenRenderer: true,
  // To override and use one context per Rive instance, uncomment and use the line below
  // useOffscreenRenderer: false,
});

// or you can override the flag in JSX via props
return (
  <Rive src="foo.riv" useOffscreenRenderer={false} />
);
```

### Migrating from version 1.x.x to 2.x.x

#### Package split

In most cases, you may be able to migrate safely. We are mainly enabling the React runtime to work with both backing renderers `@rive-app/webgl` and `@rive-app/canvas`, such that you can use either `@rive-app/react-canvas` or `@rive-app/react-webgl` as the dependency in your React applications. Another change that is mostly internal is that by default, `rive-react` will now use `@rive-app/canvas` (as opposed to `@rive-app/webgl`) to wrap around, as it currently yields the fastest performance across devices. Therefore, **we recommend installing `@rive-app/react-canvas` in your applicaions**. However, if you need a WebGL backing renderer, you may want to use `@rive-app/react-webgl`.

#### Classes, styles, and component props
Starting in v2.0, we introduce one breaking change where any non-style props set on the `RiveComponent` (i.e `aria-*`, `role`, etc.) will be set on the inner `<canvas>` element. Previously, all extra props would be set onto the containing `<div>` element. Both the `className` and `style` props will continue to be set on the `<div>` element that wraps the canvas, as this dictates the sizing of the Rive component.


### Migrating to 3.0

There are no breaking changes here. If you have migrated to v2.x.x, you can safely migrate to 3.0.
