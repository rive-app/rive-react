import { useState, useEffect, useRef } from 'react';
import { Rive, ViewModel, EventType } from '@rive-app/canvas';
import { UseViewModelParameters } from '../types';


function areParamsEqual(
    prev?: UseViewModelParameters,
    next?: UseViewModelParameters
): boolean {
    if (prev === next) return true;
    if (!prev || !next) return prev === next;

    if ('name' in prev && 'name' in next) {
        return prev.name === next.name;
    }

    if ('useDefault' in prev && 'useDefault' in next) {
        return prev.useDefault === next.useDefault;
    }

    return false;
}

/**
 * Hook for fetching a ViewModel from a Rive instance.
 *
 * @param rive - The Rive instance to retrieve the ViewModel from
 * @param params - Options for retrieving a ViewModel
 * @param params.name - When provided, specifies the name of the ViewModel to retrieve
 * @param params.useDefault - When true, uses the default ViewModel from the Rive instance
 * @returns The ViewModel or null if not found
 */
export default function useViewModel(
    rive: Rive | null,
    params?: UseViewModelParameters
): ViewModel | null {
    const { name, useDefault = false } = params ?? {};
    const riveRef = useRef<Rive | null>(null);
    const paramsRef = useRef<UseViewModelParameters | undefined>(params);
    const [viewModel, setViewModel] = useState<ViewModel | null>(null);

    const shouldUpdate = useRef(true);

    useEffect(() => {
        const isRiveChanged = riveRef.current !== rive;
        const areParamsChanged = !areParamsEqual(paramsRef.current, params);

        shouldUpdate.current = isRiveChanged || areParamsChanged;
        riveRef.current = rive;
        paramsRef.current = params;

        if (!shouldUpdate.current && viewModel) {
            return;
        }

        function fetchViewModel() {
            const currentRive = riveRef.current;
            const currentParams = paramsRef.current;

            if (!currentRive) {
                setViewModel(null);
                return;
            }

            let model: ViewModel | null = null;

            if (currentParams && 'name' in currentParams && currentParams.name != null) {
                model = currentRive.viewModelByName?.(currentParams.name) || null;
            } else if (currentParams && currentParams.useDefault) {
                const defaultViewModel = currentRive.defaultViewModel();
                if (defaultViewModel) {
                    model = defaultViewModel;
                }
            }

            setViewModel(model);
            shouldUpdate.current = false;
        }

        fetchViewModel();

        const currentRive = riveRef.current;
        if (currentRive) {
            currentRive.on(EventType.Load, fetchViewModel);
        }

        return () => {
            if (currentRive) {
                currentRive.off(EventType.Load, fetchViewModel);
            }
        };
    }, [rive, name, useDefault]);

    return viewModel;
} 