import { useState, useEffect, useRef } from 'react';
import {
  EventType,
  Rive,
  ViewModel,
  ViewModelInstance,
} from '@rive-app/canvas';
import { UseViewModelInstanceParameters } from '../types';

const defaultParams: UseViewModelInstanceParameters = {
  useDefault: false,
  useNew: true,
  name: '',
};

const equal = (
  params: UseViewModelInstanceParameters | null,
  to: UseViewModelInstanceParameters | null
): boolean => {
  if (!params || !to) {
    return false;
  }
  if (
    params.useDefault !== to.useDefault ||
    params.useNew !== to.useNew ||
    params.name !== to.name
  ) {
    return false;
  }
  return true;
};

/**
 * Custom hook for fetching a view model instance.
 *
 * @param rive - Rive instance
 * @param userParameters - Parameters to load view model instance
 * @returns
 */
export default function useViewModel(
  rive: Rive | null,
  viewModel: ViewModel | null,
  userParameters?: UseViewModelInstanceParameters
) : ViewModelInstance | null {
  const [viewModelInstance, setViewModelInstance] =
    useState<ViewModelInstance | null>(null);
  const currentParams = useRef<UseViewModelInstanceParameters | null>(null);

  useEffect(() => {
    const parameters = {
      ...defaultParams,
      ...userParameters,
    };

    function setInstance(instance: ViewModelInstance | null) {
      setViewModelInstance(instance);
      rive!.setDataContextFromInstance(instance);
      currentParams.current = parameters;
    }
    function getViewModelInstance(): ViewModelInstance | null {
      if (viewModel) {
        if (parameters.useDefault) {
          return viewModel?.defaultInstance();
        } else if (parameters.name) {
          return viewModel?.instanceByName(parameters.name);
        } else if (parameters.useNew) {
          return viewModel?.instance();
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
