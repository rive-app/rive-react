import { useState, useEffect } from 'react';
import { EventType, Rive, StateMachineInput } from '@rive-app/canvas';

/**
 * Custom hook for fetching multiple stateMachine inputs from a rive file.
 * Particularly useful for fetching multiple inputs from a variable number of input names.
 *
 * @param rive - Rive instance
 * @param stateMachineName - Name of the state machine
 * @param inputNames - Names of the inputs
 * @returns StateMachineInput[] | null
 */
export default function useStateMachineInputs(
  rive: Rive | null,
  stateMachineName?: string,
  inputNames?: {
    name: string;
    initialValue?: number | boolean;
  }[]
) {
  const [inputs, setInputs] = useState<StateMachineInput[] | null>(null);

  useEffect(() => {
    function setStateMachineInput() {
      if (!rive || !stateMachineName || !inputNames) {
        setInputs(null);
      }

      if (rive && stateMachineName && inputNames) {
        const inputs = rive.stateMachineInputs(stateMachineName);
        if (inputs) {
          const selectedInputs = inputs.filter((input) =>
            inputNames.some((inputName) => inputName.name === input.name)
          );
          if (selectedInputs) {
            selectedInputs.forEach((input) => {
              const targetInputName = inputNames.find(inputName => inputName.name === input.name);
              if(targetInputName?.initialValue){
                input.value = targetInputName.initialValue
              }
            });
          }
          setInputs(selectedInputs);
        }
      } else {
        setInputs(null);
      }
    }
    setStateMachineInput();
    if (rive) {
      rive.on(EventType.Load, () => {
        // Check if the component/canvas is mounted before setting state to avoid setState
        // on an unmounted component in some rare cases
        setStateMachineInput();
      });
    }
  }, [inputNames, rive, stateMachineName]);

  return inputs;
}
