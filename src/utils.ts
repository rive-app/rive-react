import { UseRiveOptions } from './types';

/**
 * Hook option defaults.
 *
 * Note `useOffscreenRenderer: true` — that is this React runtime's default, not the
 * JS runtime's. The JS runtime itself defaults it to `false`. useRive needs to know
 * which value came from here so GPU Canvas can bend the default without
 * overriding an explicit choice.
 */
export const defaultOptions = {
  useDevicePixelRatio: true,
  fitCanvasToArtboardHeight: false,
  useOffscreenRenderer: true,
  shouldResizeCanvasToContainer: true,
};

export function getOptions(opts: Partial<UseRiveOptions>) {
  return Object.assign({}, defaultOptions, opts);
}

/**
 * Runs a Rive teardown call without letting it escape into React.
 *
 * `cleanup()` always runs from an effect cleanup, so a throw is routed to the
 * nearest error boundary — or unmounts the whole root if there isn't one.
 * Swallowing is safe here: nothing runs after cleanup, so the worst case is a
 * leaked GPU resource on a page that is going away. Warns in every build
 * because these throws are GPU/driver dependent and surface in the field.
 */
export function safeCleanup(label: string, cleanup: () => void) {
  try {
    cleanup();
  } catch (error) {
    console.warn(
      `[Rive] ${label} threw while cleaning up Rive; contained. `,
      error
    );
  }
}
