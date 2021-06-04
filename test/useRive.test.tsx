import { renderHook, act } from "@testing-library/react-hooks";
import { mocked } from "ts-jest/utils";

import useRive from "../src/hooks/useRive";
import * as rive from "rive-js";

jest.mock("rive-js", () => ({
  Rive: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    stop: jest.fn(),
  })),
  Layout: jest.fn(),
  Fit: {
    Cover: "cover",
  },
  Alignment: {
    Center: "center",
  },
  EventType: {
    Load: "load",
  },
  StateMachineInputType: {
    Number: 1,
    Boolean: 2,
    Trigger: 3,
  },
}));

describe("useRive", () => {
  it("returns rive as null if no params are passed", () => {
    const { result } = renderHook(() => useRive());
    expect(result.current.rive).toBe(null);
    expect(result.current.canvas).toBe(null);
  });

  it("returns a rive object if the src object is set on the rive params and setCanvas is called", async () => {
    const params = {
      src: "file-src",
    };

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: jest.fn(),
      stopRendering: jest.fn(),
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");
    const { result } = renderHook(() => useRive(params));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
    });

    expect(result.current.rive).toBe(riveMock);
    expect(result.current.canvas).toBe(canvasSpy);
  });

  it("updates the bounds if the container ref is set", async () => {
    const params = {
      src: "file-src",
    };

    const resizeToCanvasMock = jest.fn();

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: jest.fn(),
      stopRendering: jest.fn(),
      resizeToCanvas: resizeToCanvasMock,
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");
    const containerSpy = document.createElement("div");
    const { result } = renderHook(() => useRive(params));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
      result.current.setContainerRef(containerSpy);
    });

    expect(result.current.rive).toBe(riveMock);
    expect(result.current.canvas).toBe(canvasSpy);

    expect(resizeToCanvasMock).toBeCalled();
  });

  it("stops the rive object on unmount", async () => {
    const params = {
      src: "file-src",
    };

    const stopMock = jest.fn();

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: stopMock,
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");
    const { result, unmount } = renderHook(() => useRive(params));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
    });

    unmount();

    expect(stopMock).toBeCalled();
  });

  it("sets the a bounds with the devicePixelRatio by default", async () => {
    const params = {
      src: "file-src",
    };

    global.devicePixelRatio = 2;

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: jest.fn(),
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");
    const containerSpy = document.createElement("div");
    containerSpy.getBoundingClientRect = jest.fn().mockImplementation(() => ({
      width: 100,
      height: 100,
    }));

    const { result } = renderHook(() => useRive(params));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
      result.current.setContainerRef(containerSpy);
    });

    // Height and width should be 2* the width and height returned from containers
    // bounding rect
    expect(canvasSpy).toHaveAttribute("height", "200");
    expect(canvasSpy).toHaveAttribute("width", "200");

    // Style height and width should be the same as returned from containers
    // bounding rect
    expect(canvasSpy).toHaveAttribute("style", "width: 100px; height: 100px;");
  });

  it("sets the a bounds without the devicePixelRatio if useDevicePixelRatio is false", async () => {
    const params = {
      src: "file-src",
    };
    const opts = {
      useDevicePixelRatio: false,
    };

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: jest.fn(),
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");
    const containerSpy = document.createElement("div");
    containerSpy.getBoundingClientRect = jest.fn().mockImplementation(() => ({
      width: 100,
      height: 100,
    }));

    const { result } = renderHook(() => useRive(params, opts));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
      result.current.setContainerRef(containerSpy);
    });

    // Height and width should be same as containers bounding rect
    expect(canvasSpy).toHaveAttribute("height", "100");
    expect(canvasSpy).toHaveAttribute("width", "100");
  });

  it("uses artbound height to set bounds if fitCanvasToArtboardHeight is true", async () => {
    const params = {
      src: "file-src",
    };
    const opts = {
      useDevicePixelRatio: false,
      fitCanvasToArtboardHeight: true,
    };

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: jest.fn(),
      bounds: {
        maxX: 100,
        maxY: 50,
      },
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");
    const containerSpy = document.createElement("div");
    containerSpy.getBoundingClientRect = jest.fn().mockImplementation(() => ({
      width: 100,
      height: 100,
    }));

    const { result } = renderHook(() => useRive(params, opts));

    await act(async () => {
      result.current.setContainerRef(containerSpy);
      result.current.setCanvasRef(canvasSpy);
    });

    // Height and width should be same as containers bounding rect
    expect(canvasSpy).toHaveAttribute("height", "50");
    expect(canvasSpy).toHaveAttribute("width", "100");

    // Container should have style set to height
    expect(containerSpy).toHaveAttribute("style", "height: 50px;");
  });

  it("configures a IntersectionObserver on mounting", async () => {
    const params = {
      src: "file-src",
    };

    const observeMock = jest.fn();

    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: observeMock,
    }));

    const riveMock = {
      on: (_: string, cb: () => void) => cb(),
      stop: jest.fn(),
      bounds: {
        maxX: 100,
        maxY: 50,
      },
    };

    // @ts-ignore
    mocked(rive.Rive).mockImplementation(() => riveMock);

    const canvasSpy = document.createElement("canvas");

    const { result } = renderHook(() => useRive(params));

    await act(async () => {
      result.current.setCanvasRef(canvasSpy);
    });

    expect(observeMock).toBeCalledWith(canvasSpy);
  });
});
