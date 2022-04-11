import { useState, useEffect } from 'react';
import { Rive, StateMachineInput } from '@rive-app/webgl';

/**
 * Custom hook for fetching a stateMachine input from a rive file.
 *
 * @param rive - Rive instance
 * @param stateMachineName - Name of the state machine
 * @param inputName - Name of the input
 * @returns
 */
export default function useStateMachineInput(
  rive: Rive | null,
  stateMachineName?: string,
  inputName?: string,
  initialValue?: number | boolean
) {
  const [input, setInput] = useState<StateMachineInput | null>(null);

  useEffect(() => {
    if (!rive || !stateMachineName || !inputName) {
      setInput(null);
    }

    if (rive && stateMachineName && inputName) {
      const inputs = rive.stateMachineInputs(stateMachineName);
      if (inputs) {
        const selectedInput = inputs.find((input) => input.name === inputName);
        if (initialValue !== undefined && selectedInput) {
          selectedInput.value = initialValue;
        }
        setInput(selectedInput || null);
      }
    } else {
      setInput(null);
    }
  }, [rive]);

  return input;
}
