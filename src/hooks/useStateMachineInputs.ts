import { EventType, StateMachineInput, Rive } from '@rive-app/canvas';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for fetching multiple stateMachine inputs from a rive file.
 * Particularly useful for fetching multiple inputs from a variable number of input names.
 *
 * @param rive - Rive instance
 * @param stateMachineName - Name of the state machine
 * @param inputNames - Name and initial value of the inputs
 * @returns StateMachineInput[]
 */
export default function useStateMachineInputs(
  rive: Rive | null,
  stateMachineName?: string,
  inputNames?: {
    name: string;
    initialValue?: number | boolean;
  }[]
) {
  const [inputs, setInputs] = useState<StateMachineInput[]>([]);

  const syncInputs = useCallback(() => {
    if (!rive || !stateMachineName || !inputNames) return;

    const riveInputs = rive.stateMachineInputs(stateMachineName);
    if (!riveInputs) return;

    // To optimize lookup time from O(n) to O(1) in the following loop
    const riveInputLookup = new Map<string, StateMachineInput>(
      riveInputs.map(input => [input.name, input])
    );

    setInputs(() => {
      // Iterate over inputNames instead of riveInputs to preserve array order
      return inputNames
        .filter(inputName => riveInputLookup.has(inputName.name))
        .map(inputName => {
          const riveInput = riveInputLookup.get(inputName.name)!;

          if (inputName.initialValue !== undefined) {
            riveInput.value = inputName.initialValue;
          }

          return riveInput;
        });
    });
  }, [inputNames, rive, stateMachineName]);

  useEffect(() => {
    syncInputs();
    if (rive) {
      rive.on(EventType.Load, syncInputs);

      return () => {
        rive.off(EventType.Load, syncInputs);
      };
    }
  }, [rive, stateMachineName, inputNames, syncInputs]);

  return inputs;
}
