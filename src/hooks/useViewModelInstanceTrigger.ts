import { useEffect, useCallback } from 'react';
import { ViewModelInstanceTrigger } from '@rive-app/canvas';
import { UseViewModelInstanceTriggerParameters, UseViewModelInstanceTriggerResult } from '../types';
import { useViewModelInstancePropertyValues } from './useViewModelInstancePropertyValues';

/**
 * Hook for interacting with trigger ViewModel instance properties.
 * 
 * @param path Path to the property (e.g. "buttonPress" or "nested/buttonPress")
 * @param userParameters Optional parameters including onTrigger callback
 * @returns Object with trigger function
 */
export default function useViewModelInstanceTrigger(
    path: string,
    userParameters?: UseViewModelInstanceTriggerParameters
): UseViewModelInstanceTriggerResult {
    const result = useViewModelInstancePropertyValues<
        void,
        UseViewModelInstanceTriggerParameters,
        ViewModelInstanceTrigger,
        {
            trigger: () => void;
            instance: ViewModelInstanceTrigger | null;
        }
    >(
        path,
        userParameters,
        undefined,
        (instance, name) => instance.trigger(name),
        () => undefined,
        (instance) => ({
            trigger: () => {
                instance?.trigger();
            },
            instance
        })
    );

    const { instance } = result;

    useEffect(() => {
        if (instance && userParameters?.onTrigger) {
            instance.on(userParameters.onTrigger);

            return () => {
                instance.off(userParameters.onTrigger);
            };
        }
    }, [instance, userParameters?.onTrigger]);

    const trigger = useCallback(() => {
        instance?.trigger();
    }, [instance]);

    return {
        trigger
    };
}