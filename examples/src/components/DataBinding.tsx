import React, { useEffect } from 'react';
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
  useViewModelInstanceString,
  useViewModelInstanceEnum,
  useViewModelInstanceTrigger,
} from '@rive-app/react-webgl2';

const randomValue = () => Math.random() * 200 - 100;

const DataBinding = () => {
  const { rive, RiveComponent } = useRive({
    src: 'stocks.riv',
    artboard: 'Main',
    stateMachines: 'State Machine 1',
    autoplay: true,
    autoBind: false,
  });

  // Get the default instance of the view model
  const viewModel = useViewModel(rive, { name: 'Dashboard' });
  const viewModelInstance = useViewModelInstance(viewModel, { rive });

  // Get the view model instance properties

  const { setValue: setTitle } = useViewModelInstanceString(
    'title',
    viewModelInstance
  );

  const { setValue: setLogoShape } = useViewModelInstanceEnum(
    'logoShape',
    viewModelInstance
  );

  const { setValue: setRootColor } = useViewModelInstanceColor(
    'rootColor',
    viewModelInstance
  );

  const { trigger: triggerSpinLogo } = useViewModelInstanceTrigger(
    'triggerSpinLogo',
    viewModelInstance
  );

  useViewModelInstanceTrigger('triggerButton', viewModelInstance, {
    onTrigger: () => console.log('Button Triggered!'),
  });

  // Apple Values
  const { setValue: setAppleName } = useViewModelInstanceString(
    'apple/name',
    viewModelInstance
  );
  const { setValue: setAppleStockChange } = useViewModelInstanceNumber(
    'apple/stockChange',
    viewModelInstance
  );
  const { value: appleColor } = useViewModelInstanceColor(
    'apple/currentColor',
    viewModelInstance
  );
  // Apple Values
  const { setValue: setMicrosoftName } = useViewModelInstanceString(
    'microsoft/name',
    viewModelInstance
  );
  const { setValue: setMicrosoftStockChange } = useViewModelInstanceNumber(
    'microsoft/stockChange',
    viewModelInstance
  );
  // Tesla Values
  const { setValue: setTeslaName } = useViewModelInstanceString(
    'tesla/name',
    viewModelInstance
  );
  const { setValue: setTeslaStockChange } = useViewModelInstanceNumber(
    'tesla/stockChange',
    viewModelInstance
  );

  useEffect(() => {
    // Set initial values for the view model
    if (
      setTitle &&
      setLogoShape &&
      setRootColor &&
      setAppleName &&
      setMicrosoftName &&
      setTeslaName
    ) {
      setTitle('Rive Stocks Dashboard');
      setLogoShape('triangle');
      setRootColor(parseInt('ffc0ffee', 16));
      setAppleName('AAPL');
      setMicrosoftName('MSFT');
      setTeslaName('TSLA');
    }

    // randomly generate stock values every 2 seconds
    const interval = setInterval(() => {
      const appleValue = randomValue();
      const microsoftValue = randomValue();
      const teslaValue = randomValue();

      setAppleStockChange(appleValue);
      setMicrosoftStockChange(microsoftValue);
      setTeslaStockChange(teslaValue);

      // If all the stock values are either all positive or all negative, spin the logo
      if (
        (appleValue > 0 && microsoftValue > 0 && teslaValue > 0) ||
        (appleValue < 0 && microsoftValue < 0 && teslaValue < 0)
      ) {
        triggerSpinLogo();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [
    setTitle,
    setLogoShape,
    setRootColor,
    setAppleName,
    setMicrosoftName,
    setTeslaName,
    setAppleStockChange,
    setMicrosoftStockChange,
    setTeslaStockChange,
    triggerSpinLogo,
  ]);

  // listen for changes to the AAPL color and log them
  useEffect(() => {
    if (appleColor) {
      console.log('Apple color changed:', appleColor);
    }
  }, [appleColor]);

  return <RiveComponent />;
};

export default DataBinding;
