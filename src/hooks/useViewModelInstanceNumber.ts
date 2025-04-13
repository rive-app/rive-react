import { ViewModelInstanceNumber } from '@rive-app/canvas';
import { UseViewModelInstanceNumberParameters, UseViewModelInstanceNumberResult } from '../types';
import { useViewModelInstancePropertyValues } from './useViewModelInstancePropertyValues';

/**
 * Hook for interacting with numeric ViewModel instance properties.
 * 
 * @param path Path to the property (e.g. "itemCount" or "nested/itemCount")
 * @param userParameters Optional parameters including initial value
 * @returns Object with value and setter function
 */
export default function useViewModelInstanceNumber(
  path: string,
  userParameters?: UseViewModelInstanceNumberParameters
): UseViewModelInstanceNumberResult {
  return useViewModelInstancePropertyValues<
    number,
    UseViewModelInstanceNumberParameters,
    ViewModelInstanceNumber,
    { value: number; setValue: (value: number) => void }
  >(
    path,
    userParameters,
    0,
    (instance, name) => instance.number(name),
    (instance) => instance.value,
    (_instance, value, setValue) => ({
      value,
      setValue
    })
  );
}