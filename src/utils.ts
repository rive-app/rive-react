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
 * Teardown can also run while replacing an instance, so a failure may leak
 * GPU resources while the page remains active. Warn in every build because
 * these throws are GPU/driver dependent and surface in the field.
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
