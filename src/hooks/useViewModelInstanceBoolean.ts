import { useCallback } from 'react';
import { ViewModelInstanceBoolean } from '@rive-app/canvas';
import { UseViewModelInstanceBooleanParameters, UseViewModelInstanceBooleanResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Hook for interacting with boolean ViewModel instance properties.
 *
 * @param params - Parameters for interacting with a boolean ViewModel instance property
 * @param params.path - The path to the boolean property
 * @param params.viewModelInstance - The ViewModelInstance containing the boolean property to operate on
 * @returns An object with the boolean value and a setter function
 */
export default function useViewModelInstanceBoolean(
    params: UseViewModelInstanceBooleanParameters
): UseViewModelInstanceBooleanResult {
    const { path, viewModelInstance } = params;

    const result = useViewModelInstanceProperty<ViewModelInstanceBoolean, boolean, Omit<UseViewModelInstanceBooleanResult, 'value'>>(
        path,
        viewModelInstance,
        {
            getProperty: useCallback((vm, p) => vm.boolean(p), []),
            getValue: useCallback((prop) => prop.value, []),
            defaultValue: null,
            buildPropertyOperations: useCallback((safePropertyAccess) => ({
                setValue: (newValue: boolean) => {
                    safePropertyAccess(prop => { prop.value = newValue; });
                }
            }), [])
        }
    );

    return {
        value: result.value,
        setValue: result.setValue
    };
} 