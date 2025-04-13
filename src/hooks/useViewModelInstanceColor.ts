import { ViewModelInstanceColor } from '@rive-app/canvas';
import { UseViewModelInstanceColorResult, UseViewModelInstanceColorParameters } from '../types';
import { useViewModelInstancePropertyValues } from './useViewModelInstancePropertyValues';

/**
 * Hook for interacting with color ViewModel instance properties.
 * 
 * @param path Path to the property (e.g. "color" or "nested/color")
 * @param userParameters Optional parameters including initial value
 * @returns Object with value, setter function, and color utilities
 */
export default function useViewModelInstanceColor(
    path: string,
    userParameters?: UseViewModelInstanceColorParameters
): UseViewModelInstanceColorResult {
    return useViewModelInstancePropertyValues<
        number,
        UseViewModelInstanceColorParameters,
        ViewModelInstanceColor,
        {
            value: number;
            setValue: (value: number) => void;
            rgb: (r: number, g: number, b: number) => void;
            rgba: (r: number, g: number, b: number, a: number) => void;
            alpha: (a: number) => void;
            opacity: (o: number) => void;
        }
    >(
        path,
        userParameters,
        0,
        (instance, name) => instance.color(name),
        (instance) => instance.value,
        (instance, value, setValue) => ({
            value,
            setValue,
            rgb: (r, g, b) => instance?.rgb(r, g, b),
            rgba: (r, g, b, a) => instance?.rgba(r, g, b, a),
            alpha: (a) => instance?.alpha(a),
            opacity: (o) => instance?.opacity(o),
        })
    );
}