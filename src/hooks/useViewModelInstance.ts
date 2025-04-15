import { useState, useEffect, useRef } from 'react';
import {
  EventType,
  Rive,
  ViewModel,
  ViewModelInstance,
} from '@rive-app/canvas';
import { UseViewModelInstanceParameters } from '../types';

const defaultParams: UseViewModelInstanceParameters = { useNew: true };

const equal = (
  params: UseViewModelInstanceParameters | null,
  to: UseViewModelInstanceParameters | null
): boolean => {
  if (!params || !to) {
    return false;
  }

  if ('name' in params) {
    return 'name' in to && params.name === to.name;
  }

  if ('useDefault' in params) {
    return 'useDefault' in to && params.useDefault === to.useDefault;
  }

  if ('useNew' in params) {
    return 'useNew' in to && params.useNew === to.useNew;
  }

  return false;
};

/**
 * Custom hook for fetching a view model instance.
 *
 * @param rive - Rive instance
 * @param viewModel - ViewModel to get an instance from
 * @param userParameters - Parameters to load view model instance
 * @returns The ViewModelInstance or null if not available
 * 
 * @example
 * // Create a new instance of the view model
 * const viewModelInstance = useViewModelInstance(rive, viewModel, { useNew: true });
 * 
 * @example
 * // Use the default instance of the view model
 * const viewModelInstance = useViewModelInstance(rive, viewModel, { useDefault: true });
 * 
 * @example
 * // Use a named instance of the view model
 * const viewModelInstance = useViewModelInstance(rive, viewModel, { name: 'myInstance' });
 */
export default function useViewModelInstance(
  rive: Rive | null,
  viewModel: ViewModel | null,
  userParameters?: UseViewModelInstanceParameters
): ViewModelInstance | null {
  const [viewModelInstance, setViewModelInstance] =
    useState<ViewModelInstance | null>(null);
  const currentParams = useRef<UseViewModelInstanceParameters | null>(null);

  useEffect(() => {
    const parameters = userParameters || defaultParams;

    function setInstance(instance: ViewModelInstance | null) {
      setViewModelInstance(instance);
      rive!.bindViewModelInstance(instance);
      currentParams.current = parameters;
    }

    function getViewModelInstance(): ViewModelInstance | null {
      if (viewModel) {
        if ('name' in parameters && parameters.name) {
          return viewModel.instanceByName(parameters.name);
        } else if ('useDefault' in parameters && parameters.useDefault) {
          return viewModel.defaultInstance();
        } else if ('useNew' in parameters && parameters.useNew) {
          return viewModel.instance();
        }
      }
      return null;
    }

    function setViewModelValue() {
      if (!rive || !viewModel) {
        setViewModelInstance(null);
      } else {
        const instance = getViewModelInstance();
        setInstance(instance ?? null);
      }
    }

    if (!equal(parameters, currentParams.current)) {
      rive?.on(EventType.Load, setViewModelValue);
      setViewModelValue();
    }
    return () => {
      rive?.off(EventType.Load, setViewModelValue);
    };
  }, [rive, userParameters]);

  return viewModelInstance;
}
