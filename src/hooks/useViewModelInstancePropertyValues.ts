import { useState, useEffect, useRef, useCallback } from 'react';
import { EventCallback, EventType, ViewModelInstance, ViewModelInstanceValue } from '@rive-app/canvas';
import { UseViewModelInstancePropertyType } from '../types';
import useViewModelInstanceProperty from './useViewModelInstanceProperty';

export function useViewModelInstancePropertyValues<
    T extends unknown,
    P extends UseViewModelInstancePropertyType,
    V extends ViewModelInstanceValue,
    R extends Record<string, any>
>(
    path: string,
    userParameters: P | undefined,
    defaultValue: T,
    propertyGetter: (instance: ViewModelInstance, name: string) => V | null,
    valueGetter: (propertyInstance: V) => T,
    resultBuilder: (
        propertyInstance: V | null,
        value: T,
        setValue: (value: T) => void
    ) => R
): R {

    const [propertyInstance, setPropertyInstance] = useState<V | null>(null);
    const [value, setValueState] = useState<T>(
        (userParameters as any)?.initialValue ?? defaultValue
    );


    const pathSegments = path.includes('/') ? path.split('/') : [];
    const propertyName = path.includes('/') ? path.split('/').pop() || path : path;
    const basePath = pathSegments.length > 0 ? pathSegments.slice(0, -1) : [];

    const viewModelInstance = useViewModelInstanceProperty(basePath, userParameters);

    // Track current arguments to prevent unnecessary updates
    const currentArgs = useRef<{
        path: string,
        parameters: P | undefined,
        viewModelInstance: ViewModelInstance | null
    } | null>(null);

    useEffect(() => {
        function searchProperty() {
            if (!viewModelInstance) {
                setPropertyInstance(null);
                return;
            }

            const instance = propertyGetter(viewModelInstance, propertyName);

            if (instance !== null) {
                if ((userParameters as any)?.initialValue !== undefined) {
                    (instance as any).value = (userParameters as any).initialValue;
                }

                setValueState(valueGetter(instance));

                setPropertyInstance(instance);

                currentArgs.current = {
                    parameters: userParameters,
                    path,
                    viewModelInstance,
                };
            }
        }

        const argsChanged = !currentArgs.current ||
            currentArgs.current.path !== path ||
            currentArgs.current.viewModelInstance !== viewModelInstance;

        if (argsChanged) {
            userParameters?.rive?.on(EventType.Load, searchProperty);
            searchProperty();
        }

        return () => {
            userParameters?.rive?.off(EventType.Load, searchProperty);
        };
    }, [path, userParameters, viewModelInstance, propertyName, valueGetter]);

    // We subscribe to value changes by default with the property hooks.
    useEffect(() => {
        if (!propertyInstance) return;

        const handleChange: EventCallback = (event) => {

            setValueState(event as unknown as T);
        };


        propertyInstance.on(handleChange);

        return () => {
            propertyInstance.off(handleChange);
        };
    }, [propertyInstance]);

    const setValue = useCallback((newValue: T) => {
        if (propertyInstance) {
            (propertyInstance as any).value = newValue;
        } else {
            // If no instance yet, just update React state
            setValueState(newValue);
        }
    }, [propertyInstance]);

    return resultBuilder(propertyInstance, value, setValue);
}