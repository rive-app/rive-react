import React, { useEffect } from 'react';
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
} from '@rive-app/react-canvas';

const DataBinding = () => {
  const { rive, RiveComponent } = useRive({
    src: 'rewards.riv',
    artboard: 'Main',
    stateMachines: 'State Machine 1',
    autoplay: true,
    autoBind: false,
  });

  const viewModel = useViewModel(rive, { name: 'Rewards' });

  // Get the default instance of the view model
  const viewModelInstance = useViewModelInstance(viewModel);
  console.log('ViewModelInstance:', viewModelInstance);

  const { value: priceValue, setValue: setPriceValue } =
    useViewModelInstanceNumber('PriceValue', viewModelInstance);

  const { value: mainColor, setValue: setMainColor } =
    useViewModelInstanceColor('color', viewModelInstance);

  const { value: lives, setValue: setLives } = useViewModelInstanceNumber(
    'Button/Lives',
    viewModelInstance
  );

  useEffect(() => {
    setPriceValue(100); // Set the initial price value
  }, [setPriceValue]);

  useEffect(() => {
    setMainColor(parseInt('ffc0ffee', 16)); // Set the initial price value
  }, [setMainColor]);

  useEffect(() => {
    if (setLives && lives) {
      console.log('Lives changed:', lives);
      setLives(3); // Set the initial lives value
    }
  }, [setLives, lives]);

  return <RiveComponent />;
};

export default DataBinding;
