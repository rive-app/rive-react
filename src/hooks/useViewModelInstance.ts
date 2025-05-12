import { useState, useEffect } from 'react';
import { ViewModel, ViewModelInstance } from '@rive-app/canvas';
import { UseViewModelInstanceParameters } from '../types';

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

    useEffect(() => {
        if (!viewModel) {
            setInstance(null);
            return;
        }

        let result: ViewModelInstance | null = null;

        if (name != null) {
            result = viewModel.instanceByName(name) || null;
        } else if (useDefault) {
            result = viewModel.defaultInstance?.() || null;
        } else if (useNew) {
            result = viewModel.instance?.() || null;
        } else {
            result = viewModel.defaultInstance?.() || null;
        }

        setInstance(result);

        if (rive && result && rive.viewModelInstance !== result) {
            rive.bindViewModelInstance(result);
        }
    }, [viewModel, name, useDefault, useNew, rive]);

    return instance;
} 