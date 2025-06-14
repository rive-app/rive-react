import { useCallback } from 'react';
import { ViewModelInstance, ViewModelInstanceList } from '@rive-app/canvas';
import { UseViewModelInstanceListResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Hook for interacting with list properties of a ViewModelInstance.
 *
 * @param path - Path to the property (e.g. "items" or "nested/items")
 * @param viewModelInstance - The ViewModelInstance containing the list property
 * @returns An object with the list length and manipulation functions
 */
export default function useViewModelInstanceList(
    path: string,
    viewModelInstance?: ViewModelInstance | null
): UseViewModelInstanceListResult {

    const result = useViewModelInstanceProperty<ViewModelInstanceList, number, Omit<UseViewModelInstanceListResult, 'length'>>(
        path,
        viewModelInstance,
        {
            getProperty: useCallback((vm, p) => vm.list(p), []),
            getValue: useCallback((prop) => prop.length, []),
            defaultValue: 0,
            buildPropertyOperations: useCallback((safePropertyAccess) => ({
                addInstance: (instance: ViewModelInstance) => {
                    safePropertyAccess(prop => prop.addInstance(instance));
                },
                addInstanceAt: (instance: ViewModelInstance, index: number): boolean => {
                    let result = false;
                    safePropertyAccess(prop => {
                        result = prop.addInstanceAt(instance, index);
                    });
                    return result;
                },
                removeInstance: (instance: ViewModelInstance) => {
                    safePropertyAccess(prop => prop.removeInstance(instance));
                },
                removeInstanceAt: (index: number) => {
                    safePropertyAccess(prop => prop.removeInstanceAt(index));
                },
                getInstanceAt: (index: number): ViewModelInstance | null => {
                    let result: ViewModelInstance | null = null;
                    safePropertyAccess(prop => {
                        result = prop.instanceAt(index);
                    });
                    return result;
                },
                swap: (a: number, b: number) => {
                    safePropertyAccess(prop => prop.swap(a, b));
                }
            }), [])
        }
    );

    return {
        length: result.value ?? 0,
        addInstance: result.addInstance,
        addInstanceAt: result.addInstanceAt,
        removeInstance: result.removeInstance,
        removeInstanceAt: result.removeInstanceAt,
        getInstanceAt: result.getInstanceAt,
        swap: result.swap
    };
}