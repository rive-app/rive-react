import React, { useEffect } from 'react';
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useGlobalViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceString,
} from '@rive-app/react-webgl2';

/**
 * Set up main + global view model data binding with hooks (autoBind: false).
 *
 * The hooks run shortly after Rive loads — so the first frame has already
 * advanced and rendered before they bind. If you need data set before anything
 * renders, see the "Globals (setup before first frame)" example (onRiveReady).
 */
const GLOBAL_VM_COLORS = 'Colors';
const COLOR_PROP = 'backgroundColor';

const GLOBAL_VM_CURRENCY = 'Labels';
const CURRENCY_PROP = 'currency';


const GlobalViewModelInstance = () => {
  const { rive, RiveComponent } = useRive({
    src: 'global_variables_test.riv',
    stateMachines: 'State Machine 1',
    autoplay: false,
    autoBind: false,
  });
  
  // Set up the main view model instance if you need a reference to it to change any properties.
  // These two lines are optional here: the global hooks below trigger a bind(), and bind() fills
  // any unset slots (including main) with their default instance — so the default main gets bound
  // either way. (With autoBind:false and no globals, you'd need to set the main yourself.)
  const mainViewModel = useViewModel(rive, { name: 'Main' });
  useViewModelInstance(mainViewModel, {rive});
  
  // Set up global view model instances
  // Note that we don't need to specify every global view model here - only the ones we want to have a reference to
  // to change values on. The other globals will use a default instance.
  const globalColorsViewModel = useViewModel(rive, { name: GLOBAL_VM_COLORS });
  const globalColorsInstance = useGlobalViewModelInstance(
    globalColorsViewModel,
    GLOBAL_VM_COLORS,
    { rive }
  );

  const globalCurrencyViewModel = useViewModel(rive, { name: GLOBAL_VM_CURRENCY });
  const globalCurrencyInstance = useGlobalViewModelInstance(
    globalCurrencyViewModel,
    GLOBAL_VM_CURRENCY,
    { rive }
  );

  const { value: bgColor, setValue: setBgColor } = useViewModelInstanceColor(
    COLOR_PROP,
    globalColorsInstance
  );

  const { value: currency, setValue: setCurrency } = useViewModelInstanceString(
    CURRENCY_PROP,
    globalCurrencyInstance
  );

  useEffect(() => {
    setBgColor?.(parseInt('ff2266dd', 16));
    setCurrency?.('USD');
    // Play the animation again once the data is set
    rive?.play();
  }, [setBgColor, setCurrency, rive]);

  return <RiveComponent />;
};

export default GlobalViewModelInstance;
