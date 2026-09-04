import React from 'react';
import { mocked } from 'jest-mock';
import { act, render, waitFor } from '@testing-library/react';

import useRive from '../src/hooks/useRive';
import * as rive from '@rive-app/canvas';
import useIntersectionObserver from '../src/hooks/useIntersectionObserver';

// Capture the callback useRive registers, so the test can drive intersection
// changes directly. The real ElementObserver is a module-level singleton around
// a browser IntersectionObserver, which never fires under jsdom.
let onChange: ((entry: unknown) => void) | null = null;
const unobserve = jest.fn();

jest.mock('../src/hooks/useIntersectionObserver', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useRive intersection observer teardown', () => {
  let riveMock: Partial<rive.Rive>;
  let loadCb: (() => void) | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
    onChange = null;
    unobserve.mockClear();

    mocked(useIntersectionObserver).mockReturnValue({
      observe: (_element: Element, callback: Function) => {
        onChange = callback as (entry: unknown) => void;
      },
      unobserve,
    });

    riveMock = {
      on: (_: rive.EventType, cb: rive.EventCallback) => {
        loadCb = cb as () => void;
      },
      stop: jest.fn(),
      stopRendering: jest.fn(),
      startRendering: jest.fn(),
      cleanup: jest.fn(),
      resizeToCanvas: jest.fn(),
    };
    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not fire the offscreen retest after unmount', async () => {
    let captured: HTMLCanvasElement | null = null;
    function Harness() {
      const { RiveComponent, canvas } = useRive({ src: 'file-src' });
      React.useEffect(() => {
        if (canvas) captured = canvas;
      }, [canvas]);
      return <RiveComponent />;
    }

    const { unmount } = render(<Harness />);
    await waitFor(() => expect(captured).not.toBeNull());
    await act(async () => {
      loadCb!();
    });
    await waitFor(() => expect(onChange).not.toBeNull());

    captured!.getBoundingClientRect = () =>
      ({ width: 100, height: 100, top: 0, bottom: 100, left: 0, right: 100 } as DOMRect);

    // Going offscreen with a zero-width rect is what schedules the 10ms retest.
    act(() => {
      onChange!({ isIntersecting: false, boundingClientRect: { width: 0 } });
    });

    const callsBeforeUnmount = mocked(riveMock.startRendering!).mock.calls.length;
    unmount();

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(mocked(riveMock.startRendering!).mock.calls.length).toBe(
      callsBeforeUnmount
    );
  });
});
