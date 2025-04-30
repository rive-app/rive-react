import { useState, useEffect, useRef } from 'react';
import { ViewModel, ViewModelInstance } from '@rive-app/canvas';
import { UseViewModelInstanceParameters } from '../types';


function areParamsEqual(
    prev?: UseViewModelInstanceParameters,
    next?: UseViewModelInstanceParameters
): boolean {
    if (prev === next) return true;
    if (!prev || !next) return prev === next;

    if ('name' in prev && 'name' in next) {
        return prev.name === next.name;
    }

    if ('useDefault' in prev && 'useDefault' in next) {
        return prev.useDefault === next.useDefault;
    }

    if ('useNew' in prev && 'useNew' in next) {
        return prev.useNew === next.useNew;
    }

    return false;
}

/**
 * Hook for fetching a ViewModelInstance from a ViewModel.
 *
 * @param viewModel - The ViewModel to get an instance from
 * @param params - Options for retrieving a ViewModelInstance
 * @param params.name - When provided, specifies the name of the instance to retrieve
 * @param params.useDefault - When true, uses the default instance from the ViewModel
 * @param params.useNew - When true, creates a new instance of the ViewModel
 * @param params.rive - If provided, automatically binds the instance to this Rive instance
 * @returns The ViewModelInstance or null if not found
 */
export default function useViewModelInstance(
    viewModel: ViewModel | null,
    params?: UseViewModelInstanceParameters
): ViewModelInstance | null {
    const { name, useDefault = false, useNew = false, rive } = params ?? {};
    const [instance, setInstance] = useState<ViewModelInstance | null>(null);

    const viewModelRef = useRef<ViewModel | null>(viewModel);
    const paramsRef = useRef<UseViewModelInstanceParameters | undefined>(params);
    const instanceRef = useRef<ViewModelInstance | null>(null);

    const shouldUpdate = useRef(true);

    useEffect(() => {
        const isViewModelChanged = viewModelRef.current !== viewModel;
        const areParamsChanged = !areParamsEqual(paramsRef.current, params);

        shouldUpdate.current = isViewModelChanged || areParamsChanged;
        viewModelRef.current = viewModel;
        paramsRef.current = params;

        if (!shouldUpdate.current && instanceRef.current) {
            return;
        }

        const currentViewModel = viewModelRef.current;
        const currentParams = paramsRef.current;

        if (!currentViewModel) {
            setInstance(null);
            instanceRef.current = null;
            return;
        }

        let result: ViewModelInstance | null = null;

        if (currentParams) {
            if ('name' in currentParams && currentParams.name != null) {
                result = currentViewModel.instanceByName?.(currentParams.name) || null;
            } else if ('useDefault' in currentParams && currentParams.useDefault) {
                result = currentViewModel.defaultInstance?.() || null;
            } else if ('useNew' in currentParams && currentParams.useNew) {
                result = currentViewModel.instance?.() || null;
            }
        } else {
            // Default to using default instance if no params provided
            result = currentViewModel.defaultInstance?.() || null;
        }

        instanceRef.current = result;
        setInstance(result);
        shouldUpdate.current = false;

        // Bind instance to Rive if needed
        if (rive && result && rive.viewModelInstance !== result) {
            rive.bindViewModelInstance(result);
        }
    }, [viewModel, name, useDefault, useNew, rive]);

    return instance;
} 