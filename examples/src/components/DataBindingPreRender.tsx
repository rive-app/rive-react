import React from 'react';
import {
  useRive,
  ViewModelInstanceString,
  ViewModel,
  ViewModelInstance,
} from '@rive-app/react-webgl2';

/**
 * Set up main + global view model data binding before the first frame renders,
 * using onRiveReady — the synchronous window (before the state machine advances)
 * where you can initialize instances so the graphic starts with your data.
 */
const GLOBAL_VM_NAME = 'Labels';
const CURRENCY_PROP = 'currency';

const GlobalViewModels = () => {
  const { RiveComponent } = useRive({
    src: 'global_variables_test.riv',
    stateMachine: 'State Machine 1',
    autoplay: true,
    // set autoBind to false to set up main+global instances before first frame manually
    autoBind: false,
    onRiveReady: (r) => {
      const mainVm = r?.viewModelByName('Main') as ViewModel;
      const globalLabelsVm = r?.viewModelByName('Labels') as ViewModel;

      if (mainVm) {
        r.setViewModelInstance(mainVm.defaultInstance() as ViewModelInstance);
      }
      if (globalLabelsVm) {
        const labelsInstance = globalLabelsVm.defaultInstance() as ViewModelInstance;
        const currencyVal = labelsInstance.string(CURRENCY_PROP) as ViewModelInstanceString;
        const alternateCurrencyVal = labelsInstance.string('alternateCurrency') as ViewModelInstanceString;
        currencyVal.value = 'USD';
        alternateCurrencyVal.value = '¥';

        r.setGlobalViewModelInstance(GLOBAL_VM_NAME, labelsInstance);
      }
      // Flush the data binding setup for main+globals with bind()
      r.bind();
    },
  });

  return <RiveComponent />;
};

export default GlobalViewModels;
