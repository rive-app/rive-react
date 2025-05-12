import { mocked } from 'jest-mock';
import { renderHook } from '@testing-library/react-hooks';

import useStateMachineInputs from '../src/hooks/useStateMachineInputs';
import { Rive, StateMachineInput } from '@rive-app/canvas';

jest.mock('@rive-app/canvas', () => ({
  Rive: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    off: jest.fn(),
    stop: jest.fn(),
    stateMachineInputs: jest.fn(),
  })),
  Layout: jest.fn(),
  Fit: {
    Cover: 'cover',
  },
  Alignment: {
    Center: 'center',
  },
  EventType: {
    Load: 'load',
  },
  StateMachineInputType: {
    Number: 1,
    Boolean: 2,
    Trigger: 3,
  },
}));

function getRiveMock({
  smiInputs,
}: {
  smiInputs?: null | StateMachineInput[];
} = {}) {
  const riveMock = new Rive({
    canvas: undefined as unknown as HTMLCanvasElement,
  });
  if (smiInputs) {
    riveMock.stateMachineInputs = jest.fn().mockReturnValue(smiInputs);
  }

  return riveMock;
}

describe('useStateMachineInputs', () => {
  it('returns empty array if there is null rive object passed', () => {
    const { result } = renderHook(() => useStateMachineInputs(null));
    expect(result.current).toEqual([]);
  });

  it('returns empty array if there is no state machine name', () => {
    const riveMock = getRiveMock();
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, '', [{ name: 'testInput' }])
    );
    expect(result.current).toEqual([]);
  });

  it('returns empty array if there are no input names provided', () => {
    const riveMock = getRiveMock();
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, 'smName', [])
    );
    expect(result.current).toEqual([]);
  });

  it('returns empty array if there are no inputs for the state machine', () => {
    const riveMock = getRiveMock({ smiInputs: [] });
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, 'smName', [{ name: 'testInput' }])
    );
    expect(result.current).toEqual([]);
  });

  it('returns only the inputs that exist in the state machine', () => {
    const smInputs = [
      { name: 'input1' } as StateMachineInput,
      { name: 'input2' } as StateMachineInput,
    ];
    const riveMock = getRiveMock({ smiInputs: smInputs });
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, 'smName', [
        { name: 'input1' },
        { name: 'nonexistent' },
        { name: 'input2' },
      ])
    );
    expect(result.current).toEqual([smInputs[0], smInputs[1]]);
  });

  it('sets initial values on the inputs when provided', () => {
    const smInputs = [
      { name: 'boolInput', value: false } as StateMachineInput,
      { name: 'numInput', value: 0 } as StateMachineInput,
    ];
    const riveMock = getRiveMock({ smiInputs: smInputs });
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, 'smName', [
        { name: 'boolInput', initialValue: true },
        { name: 'numInput', initialValue: 42 },
      ])
    );

    expect(result.current[0].value).toBe(true);
    expect(result.current[1].value).toBe(42);
  });

  it('does not set initial values if not provided', () => {
    const smInputs = [
      { name: 'boolInput', value: false } as StateMachineInput,
      { name: 'numInput', value: 0 } as StateMachineInput,
    ];
    const riveMock = getRiveMock({ smiInputs: smInputs });
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, 'smName', [
        { name: 'boolInput' },
        { name: 'numInput' },
      ])
    );

    expect(result.current[0].value).toBe(false);
    expect(result.current[1].value).toBe(0);
  });

  it('preserves the order of inputs as specified in inputNames', () => {
    const smInputs = [
      { name: 'input1' } as StateMachineInput,
      { name: 'input2' } as StateMachineInput,
      { name: 'input3' } as StateMachineInput,
    ];
    const riveMock = getRiveMock({ smiInputs: smInputs });
    mocked(Rive).mockImplementation(() => riveMock);

    const { result } = renderHook(() =>
      useStateMachineInputs(riveMock, 'smName', [
        { name: 'input3' },
        { name: 'input1' },
        { name: 'input2' },
      ])
    );

    expect(result.current.map((input) => input.name)).toEqual([
      'input3',
      'input1',
      'input2',
    ]);
  });
});
