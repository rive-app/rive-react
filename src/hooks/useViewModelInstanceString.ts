import { ViewModelInstanceString } from '@rive-app/canvas';
import { UseViewModelInstanceStringParameters, UseViewModelInstanceStringResult } from '../types';
import { useViewModelInstancePropertyValues } from './useViewModelInstancePropertyValues';

/**
 * Hook for interacting with string ViewModel instance properties.
 * 
 * @param path Path to the property (e.g. "text" or "nested/text")
 * @param userParameters Optional parameters including initial value
 * @returns Object with value and setter function
 */
export default function useViewModelInstanceString(
    path: string,
    userParameters?: UseViewModelInstanceStringParameters
): UseViewModelInstanceStringResult {
    return useViewModelInstancePropertyValues<
        string,
        UseViewModelInstanceStringParameters,
        ViewModelInstanceString,
        { value: string; setValue: (value: string) => void }
    >(
        path,
        userParameters,
        '',
        (instance, name) => instance.string(name),
        (instance) => instance.value,
        (_instance, value, setValue) => ({
            value,
            setValue
        })
    );
}