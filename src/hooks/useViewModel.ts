import { useState, useEffect, useRef } from 'react';
import { EventType, Rive, ViewModel } from '@rive-app/canvas';
import { UseViewModelParameters } from '../types';

const defaultParams: UseViewModelParameters = { useDefault: true };

const equal = (
  params: UseViewModelParameters | null,
  to: UseViewModelParameters | null
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

  return false;
};

/**
 * Custom hook for fetching a view model.
 *
 * @param rive - Rive instance
 * @param userParameters - Parameters to load view model
 * @returns The ViewModel instance or null if not available
 * 
 * @example
 * // Use the default view model
 * const viewModel = useViewModel(rive, { useDefault: true });
 * 
 * @example
 * // Use a named view model
 * const viewModel = useViewModel(rive, { name: 'myViewModel' });
 */
export default function useViewModel(
  rive: Rive | null,
  userParameters?: UseViewModelParameters
): ViewModel | null {
  const [viewModel, setViewModel] = useState<ViewModel | null>(null);
  const currentParams = useRef<UseViewModelParameters | null>(null);

  useEffect(() => {
    const parameters = userParameters || defaultParams;

    function getViewModel(): ViewModel | null {
      if (rive) {
        if ('name' in parameters && parameters.name) {
          return rive.viewModelByName(parameters.name);
        } else if ('useDefault' in parameters && parameters.useDefault) {
          return rive.defaultViewModel();
        }
      }
      return null;
    }

    function setViewModelValue() {
      if (!rive) {
        setViewModel(null);
        currentParams.current = null;
      } else {
        const viewModel = getViewModel();
        setViewModel(viewModel);
        currentParams.current = parameters;
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

  return viewModel;
}
