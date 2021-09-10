import { useState, useEffect } from 'react';
import { Rive, StateMachineInput } from 'rive-js';
import { UseStateMachineInputParameters } from '../types';

/**
 * Custom hook for fetching a stateMachine input from a rive file.
 *
 * @param params.rive - Rive Instance
 * @param params.stateMachineName - Name of the state machine
 * @param params.inputName - Name of the state machine input
 * @returns
 */
export default function useStateMachineInput(
  params: UseStateMachineInputParameters
) {
  const [input, setInput] = useState<StateMachineInput | null>(null);

  const { rive, stateMachineName, inputName } = params;

  useEffect(() => {
    if (!rive || !stateMachineName || !inputName) {
      setInput(null);
    }

    if (rive && stateMachineName && inputName) {
      const inputs = (rive as Rive).stateMachineInputs(stateMachineName);
      if (inputs) {
        const selectedInput = inputs.find((input) => input.name === inputName);
        setInput(selectedInput || null);
      }
    } else {
      setInput(null);
    }
  }, [rive]);

  return input;
}
