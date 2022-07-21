# To run

This is a basic showcase of a resize issue we have, to test this locally with rive-react changes

1. run `npm start`
2. run `npm run build` for the rive-react project

If you want to also test local wasm changes: 

1. update `rive-react`/package.json to a locally checked out version of rive-wasm's canvas_single
`"@rive-app/canvas": "../rive-wasm/js/npm/canvas_single",`
2. cd to `rive-wasm/js` & run `npm run dev` (keep this going as it will watch for changes)
3. run `npm start`
4. run `npm run build` for the rive-react project


# Resize issue: 

update parameters in `utils.ts` to see this for yourself.

Resizing from window.resize
    - bottom animation moves slower than rest
    - cannot deal with the animations container resizing, unless its linked to the window resizing
Resizing from ResizeObserver
    - all animations move together super smooth when resizing
    - top two animations flicker to white (blank canvas) when resizing
Resizing form ResizeObserver - throttled (current default)
    - all animations move "together"
    - resizing looks pretty smooth, but everything lags behind a bit.

# Other issues
its also very slow resizing when dev tools is open, its fine when closed though.