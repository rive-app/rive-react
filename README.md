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
- _All attributes and eventHandlers that can be passed to a `div` element can also be passed to the `Rive` component and used in the same manner._

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

- `riveParams`: Set of parameters that are passed to the Rive.js `Rive` class constructor. `null` and `undefined` can be passed to conditionally display the .rive file.
- `opts`: Rive React specific options.

#### Return Values

- `RiveComponent`: A Component that can be used to display your .riv file. This component accepts the same attributes and event handlers as a `div` element.
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

### useStateMachineInput Hook

The `useStateMachineInput` hook is provided to make it easier to interact with state machine inputs on a rive file.

```js
import { useRive, useStateMachineInput } from 'rive-react';

function Example() {
  const { RiveComponent, rive } = useRive({
    src: 'button.riv',
    stateMachines: 'button',
    autoplay: true,
  });

  const onClickInput = useStateMachineInput({
    rive: rive,
    stateMachineName: 'button',
    inputName: 'onClick',
  });

  return <RiveComponent onClick={() => onClickInput && onClickInput.fire()} />;
}

export default Example;
```

#### params

- `rive`: A `Rive` object. This is returned by the `useRive` hook.
- `stateMachineName`: Name of the state machine.
- `inputName`: Name of the state machine input.

#### Return Value

A Rive.js `stateMachineInput` object.

## Examples

The `examples` shows a number of different ways to use Rive React. See the instructions for each example to run locally.
