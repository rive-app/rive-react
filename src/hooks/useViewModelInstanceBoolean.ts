import { ViewModelInstanceBoolean } from '@rive-app/canvas';
import { UseViewModelInstanceBooleanParameters, UseViewModelInstanceBooleanResult } from '../types';
import { useViewModelInstancePropertyValues } from './useViewModelInstancePropertyValues';

/**
 * Hook for interacting with boolean ViewModel instance properties.
 * 
 * @param path Path to the property (e.g. "isVisible" or "nested/isVisible")
 * @param userParameters Optional parameters including initial value
 * @returns Object with value and setter function
 */
export default function useViewModelInstanceBoolean(
    path: string,
    userParameters?: UseViewModelInstanceBooleanParameters
): UseViewModelInstanceBooleanResult {
    return useViewModelInstancePropertyValues<
        boolean,
        UseViewModelInstanceBooleanParameters,
        ViewModelInstanceBoolean,
        { value: boolean; setValue: (value: boolean) => void }
    >(
        path,
        userParameters,
        false,
        (instance, name) => instance.boolean(name),
        (instance) => instance.value,
        (_instance, value, setValue) => ({
            value,
            setValue
        })
    );
}