import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rive as Rive$1, EventType } from '@rive-app/canvas';
export * from '@rive-app/canvas';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function useWindowSize() {
    var _a = useState({
        width: 0,
        height: 0,
    }), windowSize = _a[0], setWindowSize = _a[1];
    useEffect(function () {
        if (typeof window !== 'undefined') {
            var handleResize_1 = function () {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            window.addEventListener('resize', handleResize_1);
            handleResize_1();
            return function () { return window.removeEventListener('resize', handleResize_1); };
        }
    }, []);
    return windowSize;
}
// grabbed from: https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie
// There is a shorter version, but that one ran into type issues with typescript.
function isIE() {
    /**
     * detect IEEdge
     * returns version of IE/Edge or false, if browser is not a Microsoft browser
     */
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
}

function RiveComponent(_a) {
    var setContainerRef = _a.setContainerRef, setCanvasRef = _a.setCanvasRef, _b = _a.className, className = _b === void 0 ? '' : _b, style = _a.style, rest = __rest(_a, ["setContainerRef", "setCanvasRef", "className", "style"]);
    var containerStyle = __assign({ width: '100%', height: '100%' }, style);
    return (React.createElement("div", __assign({ ref: setContainerRef, className: className }, (!className && { style: containerStyle })),
        React.createElement("canvas", __assign({ ref: setCanvasRef, style: { verticalAlign: 'top' } }, rest))));
}
var defaultOptions = {
    useDevicePixelRatio: true,
    fitCanvasToArtboardHeight: false,
    useOffscreenRenderer: true,
};
/**
 * Returns options, with defaults set.
 *
 * @param opts
 * @returns
 */
function getOptions(opts) {
    return Object.assign({}, defaultOptions, opts);
}
/**
 * Custom Hook for loading a Rive file.
 *
 * Waits until the load event has fired before returning it.
 * We can then listen for changes to this animation in other hooks to detect
 * when it has loaded.
 *
 * @param riveParams - Object containing parameters accepted by the Rive object
 *   in the rive-js runtime, with the exception of Canvas as that is attached
 *   via the ref callback `setCanvasRef`.
 *
 * @param opts - Optional list of options that are specific for this hook.
 * @returns {RiveAnimationState}
 */
function useRive(riveParams, opts) {
    if (opts === void 0) { opts = {}; }
    var canvasRef = useRef(null);
    var containerRef = useRef(null);
    var _a = useState(null), rive = _a[0], setRive = _a[1];
    var _b = useState({
        height: 0,
        width: 0,
    }), dimensions = _b[0], setDimensions = _b[1];
    // Listen to changes in the window sizes and update the bounds when changes
    // occur.
    var windowSize = useWindowSize();
    // when the container dimensions change, we need to re evaluate our dimensions.
    var _c = useState({
        height: 0,
        width: 0,
    }), containerDimensions = _c[0], setContainerDimensions = _c[1];
    var isParamsLoaded = Boolean(riveParams);
    var options = getOptions(opts);
    /**
     * Gets the intended dimensions of the canvas element.
     *
     * The intended dimensions are those of the container element, unless the
     * option `fitCanvasToArtboardHeight` is true, then they are adjusted to
     * the height of the artboard.
     *
     * @returns Dimensions object.
     */
    function getCanvasDimensions() {
        var _a, _b;
        var _c = (_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : new DOMRect(0, 0, 0, 0), width = _c.width, height = _c.height;
        if (rive && options.fitCanvasToArtboardHeight) {
            var _d = rive.bounds, maxY = _d.maxY, maxX = _d.maxX;
            return { width: width, height: width * (maxY / maxX) };
        }
        return { width: width, height: height };
    }
    /**
     * Updates the width and height of the canvas.
     */
    function updateBounds() {
        if (!containerRef.current) {
            return;
        }
        var _a = getCanvasDimensions(), width = _a.width, height = _a.height;
        var boundsChanged = width !== dimensions.width || height !== dimensions.height;
        if (canvasRef.current && rive && boundsChanged) {
            if (options.fitCanvasToArtboardHeight) {
                containerRef.current.style.height = height + 'px';
            }
            if (options.useDevicePixelRatio) {
                var dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = dpr * width;
                canvasRef.current.height = dpr * height;
                canvasRef.current.style.width = width + 'px';
                canvasRef.current.style.height = height + 'px';
            }
            else {
                canvasRef.current.width = width;
                canvasRef.current.height = height;
            }
            setDimensions({ width: width, height: height });
            // Updating the canvas width or height will clear the canvas, so call
            // startRendering() to redraw the current frame as the animation might
            // be paused and not advancing.
            rive.startRendering();
        }
        // Always resize to Canvas
        if (rive) {
            rive.resizeToCanvas();
        }
    }
    /**
     * Listen to changes on the windowSize and the rive file being loaded
     * and update the canvas bounds as needed.
     *
     * ie does not support ResizeObservers, so we fallback to the window listener there
     */
    useEffect(function () {
        if (isIE() && rive) {
            updateBounds();
        }
    }, [rive, windowSize]);
    var observer = useRef(new ResizeObserver(function (entries) {
        setContainerDimensions(entries[entries.length - 1].contentRect);
    }));
    useEffect(function () {
        if (!isIE() && rive) {
            updateBounds();
        }
    }, [rive, containerDimensions]);
    useEffect(function () {
        if (!isIE() && containerRef.current) {
            observer.current.observe(containerRef.current);
        }
        return function () {
            observer.current.disconnect();
        };
    }, [containerRef.current, observer]);
    /**
     * Ref callback called when the canvas element mounts and unmounts.
     */
    var setCanvasRef = useCallback(function (canvas) {
        if (canvas && riveParams) {
            var useOffscreenRenderer = options.useOffscreenRenderer;
            var r_1 = new Rive$1(__assign(__assign({ useOffscreenRenderer: useOffscreenRenderer }, riveParams), { canvas: canvas }));
            r_1.on(EventType.Load, function () { return setRive(r_1); });
        }
        else if (canvas === null && canvasRef.current) {
            canvasRef.current.height = 0;
            canvasRef.current.width = 0;
        }
        canvasRef.current = canvas;
    }, [isParamsLoaded]);
    /**
     * Ref callback called when the container element mounts
     */
    var setContainerRef = useCallback(function (container) {
        containerRef.current = container;
    }, []);
    /**
     * Set up IntersectionObserver to stop rendering if the animation is not in
     * view.
     */
    useEffect(function () {
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            entry.isIntersecting
                ? rive && rive.startRendering()
                : rive && rive.stopRendering();
        });
        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }
        return function () {
            observer.disconnect();
        };
    }, [rive]);
    /**
     * On unmount, stop rive from rendering.
     */
    useEffect(function () {
        return function () {
            if (rive) {
                rive.stop();
                setRive(null);
            }
        };
    }, [rive]);
    /**
     * Listen for changes in the animations params
     */
    var animations = riveParams === null || riveParams === void 0 ? void 0 : riveParams.animations;
    useEffect(function () {
        if (rive && animations) {
            if (rive.isPlaying) {
                rive.stop(rive.animationNames);
                rive.play(animations);
            }
            else if (rive.isPaused) {
                rive.stop(rive.animationNames);
                rive.pause(animations);
            }
        }
    }, [animations, rive]);
    var Component = useCallback(function (props) {
        return (React.createElement(RiveComponent, __assign({ setContainerRef: setContainerRef, setCanvasRef: setCanvasRef }, props)));
    }, []);
    return {
        canvas: canvasRef.current,
        setCanvasRef: setCanvasRef,
        setContainerRef: setContainerRef,
        rive: rive,
        RiveComponent: Component,
    };
}

var Rive = function (_a) {
    var src = _a.src, artboard = _a.artboard, animations = _a.animations, stateMachines = _a.stateMachines, layout = _a.layout, _b = _a.useOffscreenRenderer, useOffscreenRenderer = _b === void 0 ? true : _b, rest = __rest(_a, ["src", "artboard", "animations", "stateMachines", "layout", "useOffscreenRenderer"]);
    var params = {
        src: src,
        artboard: artboard,
        animations: animations,
        layout: layout,
        stateMachines: stateMachines,
        autoplay: true,
    };
    var options = {
        useOffscreenRenderer: useOffscreenRenderer,
    };
    var RiveComponent = useRive(params, options).RiveComponent;
    return React.createElement(RiveComponent, __assign({}, rest));
};

/**
 * Custom hook for fetching a stateMachine input from a rive file.
 *
 * @param rive - Rive instance
 * @param stateMachineName - Name of the state machine
 * @param inputName - Name of the input
 * @returns
 */
function useStateMachineInput(rive, stateMachineName, inputName, initialValue) {
    var _a = useState(null), input = _a[0], setInput = _a[1];
    useEffect(function () {
        if (!rive || !stateMachineName || !inputName) {
            setInput(null);
        }
        if (rive && stateMachineName && inputName) {
            var inputs = rive.stateMachineInputs(stateMachineName);
            if (inputs) {
                var selectedInput = inputs.find(function (input) { return input.name === inputName; });
                if (initialValue !== undefined && selectedInput) {
                    selectedInput.value = initialValue;
                }
                setInput(selectedInput || null);
            }
        }
        else {
            setInput(null);
        }
    }, [rive]);
    return input;
}

export { Rive as default, useRive, useStateMachineInput };
