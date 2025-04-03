import { useState, useEffect, useRef } from 'react';
import {
  EventType,
  ViewModelInstance,
  ViewModelInstanceNumber,
} from '@rive-app/canvas';
import { UseViewModelInstanceNumberParameters } from '../types';
import useViewModelInstanceProperty from './useViewModelInstanceProperty';

const defaultParams: UseViewModelInstanceNumberParameters = {
  viewModelInstance: null,
  initialValue: 0,
};

const equal = (
  name: string,
  params: UseViewModelInstanceNumberParameters | null,
  viewModelInstance: ViewModelInstance | null,
  to: HookArguments | null
): boolean => {
  if (!params || !to) {
    return false;
  }
  if (
    params.initialValue !== to.parameters.initialValue ||
    name !== to.name ||
    viewModelInstance !== to.viewModelInstance
  ) {
    return false;
  }
  return true;
};

type HookArguments = {
  name: string,
  parameters: UseViewModelInstanceNumberParameters,
  viewModelInstance: ViewModelInstance | null,
}

/**
 * Custom hook for fetching a view model instance value.
 *
 * @param name - name of the propery
 * @param path - Path to reach the required property
 * @param userParameters - Parameters to load view model instance number
 * @returns
 */
export default function useViewModelNumber(
  name: string,
  path: string[] = [],
  userParameters?: UseViewModelInstanceNumberParameters
): ViewModelInstanceNumber | null {
  const [viewModel, setViewModelValue] =
    useState<ViewModelInstanceNumber | null>(null);
  const currentArguments = useRef<HookArguments | null>(
    null
  );

  const viewModelInstance = useViewModelInstanceProperty(path, userParameters);

  useEffect(() => {
    const parameters = {
      ...defaultParams,
      ...userParameters,
    };

    function searchViewModelValue() {
      const instanceValue = viewModelInstance?.number(name) || null;
      if(instanceValue !== null && parameters.initialValue !== undefined) {
        instanceValue.value = parameters.initialValue;
      }
      setViewModelValue(instanceValue);
      currentArguments.current = {
        parameters,
        name,
        viewModelInstance,
      };
    }

    if (!equal(name, parameters, viewModelInstance, currentArguments.current)) {
      parameters.rive?.on(EventType.Load, searchViewModelValue);
      searchViewModelValue();
    }
    return () => {
      parameters.rive?.off(EventType.Load, searchViewModelValue);
    };
  }, [name, userParameters, viewModelInstance]);

  return viewModel;
}
