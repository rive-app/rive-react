import { ViewModelInstanceEnum } from '@rive-app/canvas';
import { UseViewModelInstanceEnumParameters, UseViewModelInstanceEnumResult } from '../types';
import { useViewModelInstancePropertyValues } from './useViewModelInstancePropertyValues';

/**
 * Hook for interacting with enum ViewModel instance properties.
 * 
 * @param path Path to the property (e.g. "state" or "nested/state")
 * @param userParameters Optional parameters including initial value
 * @returns Object with value, values array, and setter function
 */
export default function useViewModelInstanceEnum(
    path: string,
    userParameters?: UseViewModelInstanceEnumParameters
): UseViewModelInstanceEnumResult {
    return useViewModelInstancePropertyValues<
        string,
        UseViewModelInstanceEnumParameters,
        ViewModelInstanceEnum,
        {
            value: string;
            setValue: (value: string) => void;
            values: string[];
        }
    >(
        path,
        userParameters,
        '',
        (instance, name) => instance.enum(name),
        (instance) => instance.value,
        (instance, value, setValue) => ({
            value,
            setValue,
            values: instance?.values || []
        })
    );
}