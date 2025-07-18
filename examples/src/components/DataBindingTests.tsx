import React, { useEffect, useState } from 'react';

import Rive, {
    useRive,
    useViewModel,
    useViewModelInstance,
    useViewModelInstanceBoolean,
    useViewModelInstanceString,
    useViewModelInstanceNumber,
    useViewModelInstanceEnum,
    useViewModelInstanceColor,
    useViewModelInstanceTrigger,
    useViewModelInstanceImage,
    decodeImage,
    ViewModelInstance,
    useViewModelInstanceList,
    useViewModelInstanceArtboard
} from '@rive-app/react-webgl2';


export const StringPropertyTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: true,
        stateMachines: "State Machine 1",
    });

    const { value: name, setValue: setName } = useViewModelInstanceString('name', rive?.viewModelInstance);

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <label>
                        Name:
                        <input
                            data-testid="name-input"
                            type="text"
                            value={name || ''}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus={false}
                        />
                    </label>
                    <div data-testid="name-value">{name}</div>
                </div>
            )}
        </div>
    );
};

export const NumberPropertyTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: true,
        stateMachines: "State Machine 1",
    });

    const { value: age, setValue: setAge } = useViewModelInstanceNumber('age', rive?.viewModelInstance);


    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <label>
                        Age:
                        <input
                            data-testid="age-input"
                            type="number"
                            value={age ?? 0}
                            onChange={(e) => setAge(Number(e.target.value))}
                            autoFocus={false}
                        />
                    </label>
                    <div data-testid="age-value">{age}</div>
                </div>
            )}
        </div>
    );
};

export const BooleanPropertyTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: true,
        stateMachines: "State Machine 1",
    });

    const { value: agreedToTerms, setValue: setAgreedToTerms } = useViewModelInstanceBoolean('agreedToTerms', rive?.viewModelInstance);

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <label>
                        <input
                            data-testid="terms-checkbox"
                            type="checkbox"
                            checked={agreedToTerms ?? false}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        Agree to Terms
                    </label>
                    <div data-testid="terms-value">{agreedToTerms ? 'true' : 'false'}</div>
                </div>
            )}
        </div>
    );
};

const colorNumberToHexString = (colorNum: number | null) => {
    if (colorNum === null) {
        return 'N/A';
    }
    const unsignedInt = colorNum >>> 0;
    const r = (unsignedInt >> 16) & 0xff;
    const g = (unsignedInt >> 8) & 0xff;
    const b = unsignedInt & 0xff;

    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const ColorPropertyTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: true,
        stateMachines: "State Machine 1",
    });


    const { value: colorNum, setValue: setColor, setRgb } = useViewModelInstanceColor('favColor', rive?.viewModelInstance);

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <label>
                        Favorite Color:
                        <div data-testid="color-value" style={{
                            backgroundColor: typeof colorNum === 'string' ? colorNum : colorNumberToHexString(colorNum),
                            width: '20px',
                            height: '20px',
                            display: 'inline-block',
                            marginLeft: '10px'
                        }}></div>
                        <div data-testid="number-value">
                            Number value: {typeof colorNum === 'number' ? colorNum : 'N/A'}
                        </div>
                        <div data-testid="hex-value">
                            Hex value: {colorNumberToHexString(colorNum)}
                        </div>
                    </label>
                    <button
                        data-testid="set-color-red"
                        type="button"
                        onClick={() => setRgb(255, 0, 0)}
                    >
                        Red
                    </button>
                    <button
                        data-testid="set-color-blue"
                        type="button"
                        onClick={() => setRgb(0, 0, 255)}
                    >
                        Blue
                    </button>
                </div>
            )}
        </div>
    );
};

export const EnumPropertyTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: true,
        stateMachines: "State Machine 1",
    });

    const { value: country, setValue: setCountry, values: countries } = useViewModelInstanceEnum('country', rive?.viewModelInstance);

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <label>
                        Country:
                        <select
                            data-testid="country-select"
                            value={country || ''}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            {countries.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </label>
                    <div data-testid="country-value">{country}</div>
                </div>
            )}
        </div>
    );
};

export const NestedViewModelTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: true,
        stateMachines: "State Machine 1",
    });

    const { value: drinkType, setValue: setDrinkType, values: drinkTypes } = useViewModelInstanceEnum('favDrink/type', rive?.viewModelInstance);

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <label>
                        Favorite Drink Type:
                        <select
                            data-testid="drink-type-select"
                            value={drinkType || ''}
                            onChange={(e) => setDrinkType(e.target.value)}
                        >
                            {drinkTypes.map(dt => (
                                <option key={dt} value={dt}>{dt}</option>
                            ))}
                        </select>
                    </label>
                    <div data-testid="drink-type-value">{drinkType}</div>
                </div>
            )}
        </div>
    );
};

export const TriggerPropertyTest = ({ src }: { src: string }) => {
    const [callbackTriggered, setCallbackTriggered] = useState('');

    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        autoBind: true,
        artboard: "Artboard",
        stateMachines: "State Machine 1",
    });



    const { trigger: onFormSubmit } = useViewModelInstanceTrigger('onFormSubmit', rive?.viewModelInstance,
        {
            onTrigger: () => {
                setCallbackTriggered('submit-callback');
            }
        }
    );

    const { trigger: onFormReset } = useViewModelInstanceTrigger('onFormReset', rive?.viewModelInstance,
        {
            onTrigger: () => {
                setCallbackTriggered('reset-callback');
            }
        }
    );

    const handleSubmit = () => {
        onFormSubmit();
    };

    const handleReset = () => {
        onFormReset();
    };

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <button data-testid="submit-button" type="button" onClick={handleSubmit}>Submit</button>
                    <button data-testid="reset-button" type="button" onClick={handleReset}>Reset</button>

                    <div data-testid="callback-triggered">
                        Last callback triggered: {callbackTriggered || 'none'}
                    </div>
                </div>
            )}
        </div>
    );
};

export const PersonForm = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        autoBind: true,
        artboard: "Artboard",
        stateMachines: "State Machine 1",
    });

    const { value: name, setValue: setName } = useViewModelInstanceString('name', rive?.viewModelInstance);
    const { value: age, setValue: setAge } = useViewModelInstanceNumber('age', rive?.viewModelInstance);
    const { value: agreedToTerms, setValue: setAgreedToTerms } = useViewModelInstanceBoolean('agreedToTerms', rive?.viewModelInstance);
    const { value: colorNum, setRgb } = useViewModelInstanceColor('favColor', rive?.viewModelInstance);
    const { value: country, setValue: setCountry, values: countries } = useViewModelInstanceEnum('country', rive?.viewModelInstance);
    const { trigger: onFormSubmit } = useViewModelInstanceTrigger('onFormSubmit', rive?.viewModelInstance);
    const { trigger: onFormReset } = useViewModelInstanceTrigger('onFormReset', rive?.viewModelInstance);


    // Drink properties (nested viewmodel)
    const { value: drinkType, setValue: setDrinkType, values: drinkTypes } = useViewModelInstanceEnum('favDrink/type', rive?.viewModelInstance);

    const handleReset = () => {
        setName('');
        setAge(0);
        setAgreedToTerms(false);
        setRgb(0, 0, 0);
        setCountry(countries[0]);
        setDrinkType(drinkTypes[0]);
        onFormReset();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFormSubmit();
    };

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />

            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Name:
                            <input
                                data-testid="name-input"
                                type="text"
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <div data-testid="name-value">{name}</div>
                    </div>

                    <div>
                        <label>
                            Age:
                            <input
                                data-testid="age-input"
                                type="number"
                                value={age || 0}
                                onChange={(e) => setAge(Number(e.target.value))}
                            />
                        </label>
                        <div data-testid="age-value">{age}</div>
                    </div>

                    <div>
                        <label>
                            <input
                                data-testid="terms-checkbox"
                                type="checkbox"
                                checked={agreedToTerms || false}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            Agree to Terms
                        </label>
                        <div data-testid="terms-value">{agreedToTerms ? 'true' : 'false'}</div>
                    </div>

                    <div>
                        <label>
                            Favorite Color:
                            <div data-testid="color-value" style={{
                                backgroundColor: colorNumberToHexString(colorNum),
                                width: '20px',
                                height: '20px',
                                display: 'inline-block',
                                marginLeft: '10px'
                            }}></div>
                        </label>
                        <button
                            data-testid="set-color-red"
                            type="button"
                            onClick={() => setRgb(255, 0, 0)}
                        >
                            Red
                        </button>
                        <button
                            data-testid="set-color-blue"
                            type="button"
                            onClick={() => setRgb(0, 0, 255)}
                        >
                            Blue
                        </button>
                    </div>

                    <div>
                        <label>
                            Country:
                            <select
                                data-testid="country-select"
                                value={country || ''}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                {countries.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </label>
                        <div data-testid="country-value">{country}</div>
                    </div>

                    <div>
                        <label>
                            Favorite Drink Type:
                            <select
                                data-testid="drink-type-select"
                                value={drinkType || ''}
                                onChange={(e) => setDrinkType(e.target.value)}
                            >
                                {drinkTypes.map(dt => (
                                    <option key={dt} value={dt}>{dt}</option>
                                ))}
                            </select>
                        </label>
                        <div data-testid="drink-type-value">{drinkType}</div>
                    </div>

                    <div>
                        <button data-testid="submit-button" type="submit">Submit</button>
                        <button data-testid="reset-button" type="button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            )}
        </div>
    );
};


// Component to demonstrate different viewmodel instances
export const PersonInstances = ({ src }: { src: string }) => {
    const [activeInstance, setActiveInstance] = useState('Steve');
    const [useDefaultInstance, setUseDefaultInstance] = useState(false);

    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        stateMachines: "State Machine 1",
    });

    const viewModel = useViewModel(rive, { name: 'PersonViewModel' });
    const params = useDefaultInstance ? { useDefault: true, rive } : { name: activeInstance, rive }
    const viewModelInstance = useViewModelInstance(viewModel, params);


    const { value: name } = useViewModelInstanceString('name', viewModelInstance);
    const { value: age } = useViewModelInstanceNumber('age', viewModelInstance);
    const { value: country } = useViewModelInstanceEnum('country', viewModelInstance);

    const switchToNamedInstance = (instanceName: string) => {
        setActiveInstance(instanceName);
        setUseDefaultInstance(false);
    };

    const switchToDefaultInstance = () => {
        setUseDefaultInstance(true);
    };

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />

            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <button
                        data-testid="select-steve"
                        onClick={() => switchToNamedInstance('Steve')}
                        disabled={!useDefaultInstance && activeInstance === 'Steve'}
                    >
                        Steve
                    </button>
                    <button
                        data-testid="select-jane"
                        onClick={() => switchToNamedInstance('Jane')}
                        disabled={!useDefaultInstance && activeInstance === 'Jane'}
                    >
                        Jane
                    </button>
                    <button
                        data-testid="select-default"
                        onClick={switchToDefaultInstance}
                        disabled={useDefaultInstance}
                    >
                        Default
                    </button>
                </div>
            )}

            <div>
                <h3 data-testid="instance-name">Instance: {useDefaultInstance ? 'Default' : activeInstance}</h3>
                <p data-testid="person-name">Name: {name}</p>
                <p data-testid="person-age">Age: {age}</p>
                <p data-testid="person-country">Country: {country}</p>
            </div>
        </div>
    );
};

export const ImagePropertyTest = ({ src }: { src: string }) => {
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { rive, RiveComponent } = useRive({
        src,
        artboard: "Artboard",
        stateMachines: "State Machine 1",
        autoplay: true,
        autoBind: false,
    });

    const viewModel = useViewModel(rive, { name: 'Post' });
    const viewModelInstance = useViewModelInstance(viewModel, { rive });

    const { setValue: setImage } = useViewModelInstanceImage(
        'image',
        viewModelInstance
    );

    const loadRandomImage = async () => {
        if (!setImage) return;

        setIsLoading(true);
        try {
            const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
            setCurrentImageUrl(imageUrl);

            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            const decodedImage = await decodeImage(new Uint8Array(imageBuffer));

            setImage(decodedImage);

            decodedImage.unref();
        } catch (error) {
            console.error('Failed to load image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearImage = () => {
        if (setImage) {
            setImage(null);
            setCurrentImageUrl('');
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '400px', height: '300px', border: '1px solid #ccc' }}>
                <RiveComponent />
            </div>

            {rive === null ? (
                <div data-testid="loading-text">Loading…</div>
            ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        onClick={loadRandomImage}
                        disabled={isLoading}
                        data-testid="load-random-image"
                    >
                        {isLoading ? 'Loading...' : 'Load Random Image'}
                    </button>

                    <button
                        onClick={clearImage}
                        disabled={isLoading}
                        data-testid="clear-image"
                    >
                        Clear Image
                    </button>
                </div>
            )}

            {currentImageUrl && (
                <div style={{ fontSize: '12px', color: '#666' }}>
                    <span data-testid="current-image-url">Current image: {currentImageUrl}</span>
                </div>
            )}
        </div>
    );
};

// List Property Test

const TodoItemComponent = ({
    index,
    todoItem
}: {
    index: number;
    todoItem: ViewModelInstance | null;
}) => {
    const { value: text, setValue: setText } = useViewModelInstanceString('text', todoItem);
    const { value: isDone, setValue: setIsDone } = useViewModelInstanceBoolean('isDone', todoItem);

    if (!todoItem) {
        return <div data-testid={`todo-item-${index}`}>Item not found</div>;
    }

    return (
        <div data-testid={`todo-item-${index}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px',
            border: '1px solid #ccc',
            marginBottom: '4px'
        }}>
            <input
                data-testid={`todo-checkbox-${index}`}
                type="checkbox"
                checked={isDone ?? false}
                onChange={(e) => setIsDone(e.target.checked)}
            />
            <input
                data-testid={`todo-text-${index}`}
                type="text"
                value={text || ''}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1 }}
            />
            <div data-testid={`todo-text-value-${index}`} style={{ fontSize: '12px', color: '#666' }}>
                Text: {text}
            </div>
            <div data-testid={`todo-done-value-${index}`} style={{ fontSize: '12px', color: '#666' }}>
                Done: {isDone ? 'true' : 'false'}
            </div>
        </div>
    );
};

export const TodoListTest = ({ src }: { src: string }) => {
    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Artboard",
        autoBind: false,
        stateMachines: "State Machine 1",
    });

    const viewModel = useViewModel(rive, { name: 'TodoList' });
    const viewModelInstance = useViewModelInstance(viewModel, { rive });

    const {
        length,
        addInstance,
        addInstanceAt,
        removeInstance,
        removeInstanceAt,
        getInstanceAt,
        swap
    } = useViewModelInstanceList('items', viewModelInstance);

    const handleAddItem = () => {
        const todoItemViewModel = rive?.viewModelByName?.('TodoItem');
        if (todoItemViewModel) {
            const newTodoItem = todoItemViewModel.instance?.();
            if (newTodoItem) {
                addInstance(newTodoItem);
            }
        }
    };

    const handleAddItemAt = () => {
        const todoItemViewModel = rive?.viewModelByName?.('TodoItem');
        if (todoItemViewModel && length > 0) {
            const newTodoItem = todoItemViewModel.instance?.();
            if (newTodoItem) {
                addInstanceAt(newTodoItem, 1);
            }
        }
    };

    const handleRemoveFirstInstance = () => {
        const firstInstance = getInstanceAt(0);
        if (firstInstance) {
            removeInstance(firstInstance);
        }
    };

    const handleRemoveFirstByIndex = () => {
        if (length > 0) {
            removeInstanceAt(0);
        }
    };

    const handleSwapItems = () => {
        if (length >= 2) {
            swap(0, 1);
        }
    };

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {rive === null ? (
                <div data-testid="loading-text">Loading…</div>
            ) : (
                <div>
                    <div data-testid="list-length">Items: {length}</div>

                    <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            data-testid="add-item-button"
                            onClick={handleAddItem}
                        >
                            Add Item (End)
                        </button>

                        <button
                            data-testid="add-item-at-button"
                            onClick={handleAddItemAt}
                            disabled={length === 0}
                        >
                            Add Item at Index 1
                        </button>

                        <button
                            data-testid="remove-instance-button"
                            onClick={handleRemoveFirstInstance}
                            disabled={length === 0}
                        >
                            Remove First (by Instance)
                        </button>

                        <button
                            data-testid="remove-index-button"
                            onClick={handleRemoveFirstByIndex}
                            disabled={length === 0}
                        >
                            Remove First (by Index)
                        </button>

                        <button
                            data-testid="swap-button"
                            onClick={handleSwapItems}
                            disabled={length < 2}
                        >
                            Swap First Two
                        </button>
                    </div>

                    <div data-testid="todo-items">
                        {Array.from({ length }, (_, index) => (
                            <TodoItemComponent
                                key={index}
                                index={index}
                                todoItem={getInstanceAt(index)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const ArtboardPropertyTest = ({ src }: { src: string }) => {
    const [currentArtboard1, setCurrentArtboard1] = useState<string>('None');
    const [currentArtboard2, setCurrentArtboard2] = useState<string>('None');

    const { rive, RiveComponent } = useRive({
        src,
        autoplay: true,
        artboard: "Main",
        autoBind: true,
        stateMachines: "State Machine 1",
    });

    const { setValue: setArtboard1 } = useViewModelInstanceArtboard('artboard_1', rive?.viewModelInstance);
    const { setValue: setArtboard2 } = useViewModelInstanceArtboard('artboard_2', rive?.viewModelInstance);

    const handleSetArtboard1 = (artboardName: string) => {
        if (rive) {
            const artboard = rive.getArtboard(artboardName);
            setArtboard1(artboard);
            setCurrentArtboard1(artboardName);
        }
    };

    const handleSetArtboard2 = (artboardName: string) => {
        if (rive) {
            const artboard = rive.getArtboard(artboardName);
            setArtboard2(artboard);
            setCurrentArtboard2(artboardName);
        }
    };

    return (
        <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
            {(rive === null) ? <div data-testid="loading-text">Loading…</div> : (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <h4>Artboard 1:</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <button
                                data-testid="set-artboard1-blue"
                                onClick={() => handleSetArtboard1('ArtboardBlue')}
                            >
                                Set Blue Artboard
                            </button>
                            <button
                                data-testid="set-artboard1-red"
                                onClick={() => handleSetArtboard1('ArtboardRed')}
                            >
                                Set Red Artboard
                            </button>
                            <button
                                data-testid="set-artboard1-green"
                                onClick={() => handleSetArtboard1('ArtboardGreen')}
                            >
                                Set Green Artboard
                            </button>
                        </div>
                        <div data-testid="artboard1-current">Current: {currentArtboard1}</div>
                    </div>

                    <div>
                        <h4>Artboard 2:</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <button
                                data-testid="set-artboard2-blue"
                                onClick={() => handleSetArtboard2('ArtboardBlue')}
                            >
                                Set Blue Artboard
                            </button>
                            <button
                                data-testid="set-artboard2-red"
                                onClick={() => handleSetArtboard2('ArtboardRed')}
                            >
                                Set Red Artboard
                            </button>
                            <button
                                data-testid="set-artboard2-green"
                                onClick={() => handleSetArtboard2('ArtboardGreen')}
                            >
                                Set Green Artboard
                            </button>
                        </div>
                        <div data-testid="artboard2-current">Current: {currentArtboard2}</div>
                    </div>
                </div>
            )}
        </div>
    );
};