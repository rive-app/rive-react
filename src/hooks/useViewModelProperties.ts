import { useState, useEffect, useRef } from 'react';
import {
  EventType,
  ViewModelInstance,
  ViewModelInstanceValue,
} from '@rive-app/canvas';
import { UseViewModelInstanceValueParameters } from '../types';

const defaultParams: UseViewModelInstanceValueParameters = {
  viewModelInstance: null,
};

const equal = (
  properties: string[],
  params: UseViewModelInstanceValueParameters | null,
  to: HookArguments | null
): boolean => {
  if (!params || !to) {
    return false;
  }
  if (properties.length !== to.properties.length) {
    return false;
  }
  for (let i = 0; i < properties.length; i += 1) {
    if (properties[i] !== to.properties[i]) {
      return false;
    }
  }
  if (
    params.rive !== to.parameters.rive ||
    params.viewModelInstance !== to.parameters.viewModelInstance
  ) {
    return false;
  }
  return true;
};

type HookArguments = {
  properties: string[];
  parameters: UseViewModelInstanceValueParameters;
};

type PropertyResult = {
  query: string;
  property: ViewModelInstanceValue | null;
};

/**
 * Custom hook for fetching a view model instance value.
 *
 * @param properties - list of queries properties
 * @param path - Path to reach the required property
 * @param userParameters - Parameters to load view model properties
 * @returns
 */
export default function useViewModelProperties(
  properties: string[],
  userParameters?: UseViewModelInstanceValueParameters
): PropertyResult[] {
  const [result, setResult] = useState<PropertyResult[]>([]);
  const currentArguments = useRef<HookArguments | null>(null);

  useEffect(() => {
    const parameters = {
      ...defaultParams,
      ...userParameters,
    };

    function getViewModelInstance() {
      if (parameters.viewModelInstance) {
        return parameters.viewModelInstance;
      } else if (parameters.rive) {
        return parameters.rive.viewModelInstance;
      }
      return null;
    }

    function getPropertyViewModelInstance(
      path: string
    ): ViewModelInstance | null {
      const viewModelInstance: ViewModelInstance | null = getViewModelInstance();
      if (path === '') {
        return viewModelInstance;
      }
      return viewModelInstance?.viewModel(path) || null;
    }

    function getProperty(
      viewModelInstance: ViewModelInstance | null,
      name: string
    ): ViewModelInstanceValue | null {
      if (viewModelInstance) {
        const viewModelProperties = viewModelInstance.properties;
        const propertyData = viewModelProperties.find((candidate) => {
          if (candidate.name === name) {
            return candidate;
          }
        });
        if (propertyData !== null) {
          switch (propertyData!.type.toString()) {
            case 'number':
              return viewModelInstance.number(name);
            case 'string':
              return viewModelInstance.string(name);
            case 'boolean':
              return viewModelInstance.boolean(name);
            case 'enumType':
              return viewModelInstance.enum(name);
            case 'color':
              return viewModelInstance.color(name);
            case 'trigger':
              return viewModelInstance.trigger(name);
          }
        }
      }
      return null;
    }

    function searchViewModelValues() {
      const viewModelInstance = getViewModelInstance();
      if (!viewModelInstance) {
        setResult([]);
      } else {
        const result: PropertyResult[] = [];
        properties.forEach((propertyQuery) => {
          if (propertyQuery === '') {
            result.push({
              query: propertyQuery,
              property: null,
            });
          } else {
            const propertyParts = propertyQuery.split('/');
            const propertyName = propertyParts.pop();
            const propertyViewModelPath = propertyParts.join('/');
            const propertyViewModelInstance = getPropertyViewModelInstance(
              propertyViewModelPath
            );
            const property = getProperty(
              propertyViewModelInstance,
              propertyName!
            );
            if (property) {
              result.push({
                query: propertyQuery,
                property: property,
              });
            } else {
              result.push({
                query: propertyQuery,
                property: null,
              });
            }
          }
        });
        setResult(result);
      }
      currentArguments.current = {
        properties: properties,
        parameters: parameters,
      };
    }

    if (!equal(properties, parameters, currentArguments.current)) {
      parameters.rive?.on(EventType.Load, searchViewModelValues);
      searchViewModelValues();
    }
    return () => {
      parameters.rive?.off(EventType.Load, searchViewModelValues);
    };
  }, [name, userParameters]);

  return result;
}
