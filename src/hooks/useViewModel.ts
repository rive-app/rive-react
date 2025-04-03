import { useState, useEffect, useRef } from 'react';
import { EventType, Rive, ViewModel } from '@rive-app/canvas';
import { UseViewModelParameters } from '../types';

const defaultParams: UseViewModelParameters = {
  useDefault: false,
  name: '',
};

const equal = (
  params: UseViewModelParameters | null,
  to: UseViewModelParameters | null
): boolean => {
  if (!params || !to) {
    return false;
  }
  if (params.useDefault !== to.useDefault || params.name !== to.name) {
    return false;
  }
  return true;
};

/**
 * Custom hook for fetching a view model.
 *
 * @param rive - Rive instance
 * @param userParameters - Parameters to load view model
 * @returns
 */
export default function useViewModel(
  rive: Rive | null,
  userParameters?: UseViewModelParameters
): ViewModel | null {
  const [viewModel, setViewModel] = useState<ViewModel | null>(null);
  const currentParams = useRef<UseViewModelParameters | null>(null);

  useEffect(() => {
    const parameters = {
      ...defaultParams,
      ...userParameters,
    };

    function getViewModel(): ViewModel | null {
      if (rive) {
        if (parameters?.useDefault) {
          return rive!.defaultViewModel();
        } else if (parameters?.name) {
          return rive.viewModelByName(parameters?.name);
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
