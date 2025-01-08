import { useState, useEffect, useRef } from 'react';
import {
  EventType,
  ViewModelInstance,
} from '@rive-app/canvas';
import {
  UseViewModelInstancePropertyType,
  AcceptedVieModelType,
} from '../types';
import useViewModelInstanceProperty from './useViewModelInstanceProperty';
import { DataType } from '@rive-app/canvas/rive_advanced.mjs';

const defaultParams: UseViewModelInstancePropertyType = {
  viewModelInstance: null,
};

const equal = <U extends UseViewModelInstancePropertyType>(
  name: string,
  params: U | null,
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
  name: string;
  parameters: UseViewModelInstancePropertyType;
  viewModelInstance: ViewModelInstance | null;
};

/**
 * Custom hook for fetching a view model instance value.
 *
 * @param name - name of the propery
 * @param path - Path to reach the required property
 * @param userParameters - Parameters to load view model instance number
 * @returns
 */
export default function useViewModelProperty<
  T extends UseViewModelInstancePropertyType,
  U extends AcceptedVieModelType<T>
>(name: string, path: string[] = [], userParameters?: T): U | null {
  const [viewModel, setViewModelValue] = useState<AcceptedVieModelType<T> | null>(null);
  const currentArguments = useRef<HookArguments | null>(null);

  const viewModelInstance = useViewModelInstanceProperty(path, userParameters);

  useEffect(() => {
    const parameters: T = {
      ...defaultParams,
      ...(userParameters as T),
    };

    function getVMI(name: string): U | null {
      const properties = viewModelInstance!.properties;
      const propData = properties.find((value) => value.name === name);
      if (propData === null) {
        return null;
      }
      if (propData!.type === DataType.number) {
        return viewModelInstance!.number(name) as U;
      } else if (propData!.type === DataType.string) {
        return viewModelInstance!.string(name) as U;
      } else if (propData!.type === DataType.boolean) {
        return viewModelInstance!.boolean(name) as U;
      } else if (propData!.type === DataType.color) {
        return viewModelInstance!.color(name) as U;
      }
      return null;
    }

    function setInitialValue(property: U, params: T) {
      if (params.initialValue !== undefined) {
        property.value = params.initialValue;
      }
    }

    function searchViewModelValue() {
      const instanceValue = getVMI(name);
      if (instanceValue !== null) {
        setInitialValue(instanceValue, parameters);
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

  return viewModel as U;
}
