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
            setRgb: (r: number, g: number, b: number) => void;
            setRgba: (r: number, g: number, b: number, a: number) => void;
            setAlpha: (a: number) => void;
            setOpacity: (o: number) => void;
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
            setRgb: (r, g, b) => instance?.rgb(r, g, b),
            setRgba: (r, g, b, a) => instance?.rgba(r, g, b, a),
            setAlpha: (a) => instance?.alpha(a),
            setOpacity: (o) => instance?.opacity(o),
        })
    );
}