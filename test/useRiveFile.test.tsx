import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'jest-mock';

import useRiveFile from '../src/hooks/useRiveFile';
import { RiveFile } from '@rive-app/canvas';

jest.mock('@rive-app/canvas', () => ({
  RiveFile: jest.fn().mockImplementation(() => ({
    cleanup: jest.fn(),
  })),
}));


describe('useRiveFile', () => {
  beforeEach(() => {
    mocked(RiveFile).mockClear();
  });

  it('initializes RiveFile with provided parameters', async () => {
    const params = {
      src: 'file-src',
      enableRiveAssetCDN: false
    };

    const { result } = renderHook(() => useRiveFile(params));

    expect(RiveFile).toHaveBeenCalledWith(params);
    expect(result.current.riveFile).toBeDefined();
  });

  it('cleans up RiveFile on unmount', async () => {
    const params = {
      src: 'file-src',
      enableRiveAssetCDN: false 
    };

    const { result, unmount } = renderHook(() => useRiveFile(params));

    const riveInstance = result.current.riveFile;
    expect(riveInstance).toBeDefined();

    unmount();

    expect(riveInstance?.cleanup).toHaveBeenCalled();
  });

  it('does not reinitialize RiveFile if params do not change', async () => {
    const params = {
      src: 'file-src',
      enableRiveAssetCDN: false 
    };

    const { rerender } = renderHook(() => useRiveFile(params));

    rerender();

    expect(RiveFile).toHaveBeenCalledTimes(1);
  });

  it('reinitializes RiveFile if src changes', async () => {
    let params = {
      src: 'file-src',
      enableRiveAssetCDN: false
    };

    const { rerender } = renderHook(() => useRiveFile(params));

    params = {
      src: 'new-file-src',
      enableRiveAssetCDN: false
    };

    rerender();

    expect(RiveFile).toHaveBeenCalledTimes(2);
  });

  it('reinitializes RiveFile if buffer changes', async () => {
    let params = {
      buffer: new ArrayBuffer(10),
      enableRiveAssetCDN: false
    };

    const { rerender } = renderHook(() => useRiveFile(params));

    params = {
      buffer: new ArrayBuffer(20),
      enableRiveAssetCDN: false
    };

    rerender();

    expect(RiveFile).toHaveBeenCalledTimes(2);
  });
});
