import { useState, useEffect, useRef } from 'react';
import {
  EventType,
  ViewModelInstance,
} from '@rive-app/canvas';
import { UseViewModelInstanceValueParameters } from '../types';

const defaultParams: UseViewModelInstanceValueParameters = {
  viewModelInstance: null,
};

const equal = (
  path: string[],
  params: UseViewModelInstanceValueParameters | null,
  to: HookArguments | null
): boolean => {
  if (!params || !to) {
    return false;
  }
  if (
    params.rive !== to.parameters.rive ||
    params.viewModelInstance !== to.parameters.viewModelInstance ||
    path.join('') !== to.path.join('')
  ) {
    return false;
  }
  return true;
};

type HookArguments = {
  path: string[],
  parameters: UseViewModelInstanceValueParameters,
}

/**
 * Custom hook for fetching a view model instance value.
 *
 * @param name - name of the propery
 * @param path - Path to reach the required property
 * @param userParameters - Parameters to load view model instance number
 * @returns
 */
export default function useViewModelInstanceProperty(
  path: string[] = [],
  userParameters?: UseViewModelInstanceValueParameters
): ViewModelInstance | null {
  const [viewModelInstance, setViewModelValue] =
    useState<ViewModelInstance | null>(null);
  const currentArguments = useRef<HookArguments | null>(
    null
  );

  useEffect(() => {
    const parameters = {
      ...defaultParams,
      ...userParameters,
    };

    function getInstanceValue(): ViewModelInstance | null {
      let viewModelInstance: ViewModelInstance | null = null;
      if (userParameters?.viewModelInstance) {
        viewModelInstance = userParameters?.viewModelInstance;
      } else if (userParameters?.rive) {
        viewModelInstance = userParameters?.rive?.viewModelInstance;
      }
      if (viewModelInstance) {
        let index = 0;
        while (index < path?.length) {
          if (!viewModelInstance) {
            return null;
          }
          viewModelInstance = viewModelInstance?.viewModel(path[index]);
          index++;
        }
        return viewModelInstance;
      }
      return null;
    }

    function searchViewModelInstance() {
      const instanceValue = getInstanceValue();
      setViewModelValue(instanceValue);
      currentArguments.current = {
        parameters,
        path,
      };
    }

    if (!equal(path, parameters, currentArguments.current)) {
      parameters.rive?.on(EventType.Load, searchViewModelInstance);
      searchViewModelInstance();
    }
    return () => {
      parameters.rive?.off(EventType.Load, searchViewModelInstance);
    };
  }, [path, userParameters]);

  return viewModelInstance;
}
