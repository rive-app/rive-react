import { mocked } from 'jest-mock';
import { renderHook, act, waitFor } from '@testing-library/react';

import useRive from '../src/hooks/useRive';
import * as rive from '@rive-app/canvas';
import { UseRiveOptions, UseRiveParameters } from '../src/types';

/**
 * GPU Canvas and the offscreen renderer are mutually exclusive: a GPU Canvas
 * session records for a single canvas, while the offscreen renderer shares one
 * GL context across every canvas on the page (so it has no `attachSession`).
 *
 * The JS runtime defaults `useOffscreenRenderer` to false; rive-react defaults it
 * to true. These tests pin the resolution rule that reconciles the two, since
 * getting it wrong means GPU Canvas silently never draws for React users.
 */
describe('useRive — GPU Canvas / offscreen renderer resolution', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    mocked(rive.Rive).mockClear();
    // @ts-ignore — a bare stub is enough; nothing here drives playback.
    mocked(rive.Rive).mockImplementation(() => ({
      on: jest.fn(),
      stop: jest.fn(),
      cleanup: jest.fn(),
    }));
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  /** Mounts the hook, attaches a canvas, and returns the Rive constructor args. */
  async function constructorParams(
    params: UseRiveParameters,
    opts?: Partial<UseRiveOptions>
  ) {
    const canvasSpy = document.createElement('canvas');
    const { result } = renderHook(() => useRive(params, opts));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
    });
    await waitFor(() => {
      expect(mocked(rive.Rive)).toHaveBeenCalled();
    });

    return mocked(rive.Rive).mock.calls[0][0];
  }

  it('keeps the offscreen renderer on by default', async () => {
    const args = await constructorParams({ src: 'file-src' });
    expect(args.useOffscreenRenderer).toBe(true);
  });

  it('turns the offscreen renderer off when enableGPUCanvas is set', async () => {
    const args = await constructorParams({
      src: 'file-src',
      enableGPUCanvas: true,
    });
    expect(args.useOffscreenRenderer).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('turns it off for a riveFile imported with GPU Canvas, even when the instance did not ask', async () => {
    // The file's mode is fixed at import and wins over the instance's flag, so
    // the renderer has to follow the file.
    const riveFile = { deferredRequested: true } as unknown as rive.RiveFile;

    const args = await constructorParams({ riveFile });
    expect(args.useOffscreenRenderer).toBe(false);
  });

  it('leaves it on for a riveFile imported without GPU Canvas', async () => {
    const riveFile = { deferredRequested: false } as unknown as rive.RiveFile;

    const args = await constructorParams({ riveFile });
    expect(args.useOffscreenRenderer).toBe(true);
  });

  it('lets an explicit option win over GPU Canvas, and warns', async () => {
    const args = await constructorParams(
      { src: 'file-src', enableGPUCanvas: true },
      { useOffscreenRenderer: true }
    );

    expect(args.useOffscreenRenderer).toBe(true);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('lets an explicit riveParams value win over GPU Canvas', async () => {
    const args = await constructorParams({
      src: 'file-src',
      enableGPUCanvas: true,
      useOffscreenRenderer: true,
    });

    expect(args.useOffscreenRenderer).toBe(true);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('honors an explicit false with no GPU Canvas in play', async () => {
    const args = await constructorParams(
      { src: 'file-src' },
      { useOffscreenRenderer: false }
    );

    expect(args.useOffscreenRenderer).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('forwards enableGPUCanvas through to the runtime', async () => {
    const args = await constructorParams({
      src: 'file-src',
      enableGPUCanvas: true,
    });
    expect(args).toMatchObject({ enableGPUCanvas: true });
  });
});
