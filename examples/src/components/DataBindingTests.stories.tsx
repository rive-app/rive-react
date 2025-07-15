import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, waitFor, userEvent } from '@storybook/test';

import { StringPropertyTest, NumberPropertyTest, BooleanPropertyTest, ColorPropertyTest, EnumPropertyTest, NestedViewModelTest, TriggerPropertyTest, PersonForm, PersonInstances, ImagePropertyTest, TodoListTest, ArtboardPropertyTest } from './DataBindingTests';

const meta: Meta = {
    title: 'Tests/DataBinding',
    parameters: {
        layout: 'centered',
    },
};

export default meta;


export const StringPropertyStory: StoryObj = {
    name: 'String Property',
    render: () => <StringPropertyTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('name-value')).toBeTruthy();
        }, { timeout: 3000 });

        const nameInput = canvas.getByTestId<HTMLInputElement>('name-input');
        await userEvent.clear(nameInput);

        // Wait for the input to be cleared
        await waitFor(() => {
            expect(nameInput.value).toBe('');
        }, { timeout: 1000 });

        await userEvent.click(nameInput);
        await userEvent.paste('Test User');

        await waitFor(() => {
            expect(nameInput.value).toBe('Test User');
        }, { timeout: 2000 });

        await waitFor(() => {
            expect(canvas.getByTestId('name-value').textContent).toBe('Test User');
        }, { timeout: 2000 });
    }
};

export const NumberPropertyStory: StoryObj = {
    name: 'Number Property',
    render: () => <NumberPropertyTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('age-value')).toBeTruthy();
        }, { timeout: 2000 });

        const ageInput = canvas.getByTestId<HTMLInputElement>('age-input');

        const currentValue = ageInput.value;
        expect(currentValue).toBe('23');

        await userEvent.click(ageInput);
        await userEvent.clear(ageInput);
        await waitFor(() => {
            expect(ageInput.value).toBe('0'); // This is a hack to wait for the input to be cleared
        }, { timeout: 1000 });

        await userEvent.paste('42');


        await waitFor(() => {
            expect(canvas.getByTestId('age-value').textContent).toBe('42');
        }, { timeout: 2000 });
    }
};

export const BooleanPropertyStory: StoryObj = {
    name: 'Boolean Property',
    render: () => <BooleanPropertyTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load

        await waitFor(() => {
            expect(canvas.getByTestId('terms-value')).toBeTruthy();
        }, { timeout: 2000 });

        const termsCheckbox = canvas.getByTestId<HTMLInputElement>('terms-checkbox');

        expect(termsCheckbox.checked).toBe(false);

        expect(canvas.getByTestId('terms-value').textContent).toBe('false');

        await userEvent.click(termsCheckbox);

        // Verify terms update
        await waitFor(() => {
            expect(canvas.getByTestId('terms-value').textContent).toBe('true');
        });
    }
};

export const ColorPropertyStory: StoryObj = {
    name: 'Color Property',
    render: () => <ColorPropertyTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load and the component to render
        await waitFor(() => {
            expect(canvas.getByTestId('color-value')).toBeTruthy();
            expect(canvas.getByTestId('set-color-red')).toBeTruthy();
            expect(canvas.getByTestId('set-color-blue')).toBeTruthy();
        }, { timeout: 5000 });

        const numberValueDiv = canvas.getByTestId('number-value');
        const hexValueDiv = canvas.getByTestId('hex-value');

        // Verify initial state is red
        await waitFor(() => {
            expect(hexValueDiv.textContent).toContain('Hex value: #ce2323');
            expect(numberValueDiv.textContent).toContain('Number value: -3267805');
        });


        // Change color to Blue ---
        const blueButton = canvas.getByTestId('set-color-blue');
        await userEvent.click(blueButton);

        // Verify Blue State
        await waitFor(() => {
            expect(numberValueDiv.textContent).toContain('Number value: -16776961');
            expect(hexValueDiv.textContent).toContain('Hex value: #0000ff');
        });


        // Change color back to Red ---
        const redButton = canvas.getByTestId('set-color-red');
        await userEvent.click(redButton);

        // Verify Red State
        await waitFor(() => {
            expect(numberValueDiv.textContent).toContain('Number value: -65536');
            expect(hexValueDiv.textContent).toContain('Hex value: #ff0000');
        });
    }
};

export const EnumPropertyStory: StoryObj = {
    name: 'Enum Property',
    render: () => <EnumPropertyTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('country-value')).toBeTruthy();
        });

        // Wait for options to be loaded
        await waitFor(() => {
            const countrySelect = canvas.getByTestId<HTMLSelectElement>('country-select');
            return countrySelect.options.length > 0;
        });

        const countrySelect = canvas.getByTestId<HTMLSelectElement>('country-select');

        // Verify that the dropdown contains usa, japan, and canada
        const optionValues = Array.from(countrySelect.options).map(option => option.value);
        expect(optionValues).toContain('usa');
        expect(optionValues).toContain('japan');
        expect(optionValues).toContain('canada');

        const currentValue = countrySelect.value;

        expect(currentValue).toBe('usa');

        let optionToSelect = 'japan';

        await userEvent.selectOptions(countrySelect, optionToSelect);

        await waitFor(() => {
            expect(canvas.getByTestId('country-value').textContent).toBe(optionToSelect);
        });
    }
};

export const NestedViewModelStory: StoryObj = {
    name: 'Nested ViewModel Property',
    render: () => <NestedViewModelTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);


        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('drink-type-value')).toBeTruthy();
        });

        // Wait for options to be loaded
        await waitFor(() => {
            const drinkTypeSelect = canvas.getByTestId<HTMLSelectElement>('drink-type-select');
            return drinkTypeSelect.options.length > 0;
        }, { timeout: 2000 });

        const drinkTypeSelect = canvas.getByTestId<HTMLSelectElement>('drink-type-select');
        const optionValues = Array.from(drinkTypeSelect.options).map(option => option.value);
        expect(optionValues).toContain('Coffee');
        expect(optionValues).toContain('Tea');


        expect(drinkTypeSelect.value).toBe('Tea');

        let optionToSelect = 'Coffee';

        await userEvent.selectOptions(drinkTypeSelect, optionToSelect);

        await waitFor(() => {
            expect(canvas.getByTestId('drink-type-value').textContent).toBe(optionToSelect);
        });
    }
};

export const TriggerPropertyStory: StoryObj = {
    name: 'Trigger Property',
    render: () => <TriggerPropertyTest src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('submit-button')).toBeTruthy();
        }, { timeout: 2000 });

        expect(canvas.getByTestId('callback-triggered').textContent).toContain('none');

        // Trigger submit action
        await userEvent.click(canvas.getByTestId('submit-button'));

        await waitFor(() => {
            expect(canvas.getByTestId('callback-triggered').textContent).toContain('submit-callback');
        });

        await userEvent.click(canvas.getByTestId('reset-button'));

        // Verify onTrigger callback works for reset
        await waitFor(() => {
            expect(canvas.getByTestId('callback-triggered').textContent).toContain('reset-callback');
        });
    }
};

export const PersonInstancesStory: StoryObj = {
    name: 'Person Instances',
    render: () => <PersonInstances src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('instance-name')).toBeTruthy();
            expect(canvas.getByTestId('select-jane')).toBeTruthy();
            expect(canvas.getByTestId('select-default')).toBeTruthy();
        }, { timeout: 2000 });

        // Initially should show Steve
        expect(canvas.getByTestId('instance-name').textContent).toContain('Steve');

        // Switch to Jane
        const janeButton = canvas.getByTestId('select-jane');
        await userEvent.click(janeButton);

        // Verify instance changed to Jane
        await waitFor(() => {
            expect(canvas.getByTestId('instance-name').textContent).toContain('Jane');
        });

        // Switch to Default instance
        const defaultButton = canvas.getByTestId('select-default');
        await userEvent.click(defaultButton);

        // Verify instance changed to Default
        await waitFor(() => {
            expect(canvas.getByTestId('instance-name').textContent).toContain('Default');
        });

        // Switch back to Steve
        const steveButton = canvas.getByTestId('select-steve');
        await userEvent.click(steveButton);

        // Verify instance changed back to Steve
        await waitFor(() => {
            expect(canvas.getByTestId('instance-name').textContent).toContain('Steve');
        });
    }
};

// A configurable form story, so we can test all the properties at once
export const PersonFormStory: StoryObj = {
    name: 'Complete Person Form',
    render: () => <PersonForm src="person_databinding_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);


        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('name-value')).toBeTruthy();
        }, { timeout: 2000 });

        // Update name
        const nameInput = canvas.getByTestId('name-input');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Test User');

        // Update age
        const ageInput = canvas.getByTestId('age-input');
        await userEvent.clear(ageInput);
        await userEvent.type(ageInput, '42');

        // Toggle terms agreement
        const termsCheckbox = canvas.getByTestId('terms-checkbox');
        await userEvent.click(termsCheckbox);

        // Change color
        const colorButton = canvas.getByTestId('set-color-red');
        await userEvent.click(colorButton);

        // Change country
        const countrySelect = canvas.getByTestId<HTMLSelectElement>('country-select');
        await userEvent.selectOptions(countrySelect, 'japan');

        // Change drink type
        const drinkTypeSelect = canvas.getByTestId<HTMLSelectElement>('drink-type-select');
        await userEvent.selectOptions(drinkTypeSelect, 'Coffee');

        // Submit the form
        const submitButton = canvas.getByTestId('submit-button');
        await userEvent.click(submitButton);
    }
};


export const ImagePropertyStory: StoryObj = {
    name: 'Image Property',
    render: () => <ImagePropertyTest src="image_db_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('load-random-image')).toBeTruthy();
            expect(canvas.getByTestId('clear-image')).toBeTruthy();
        }, { timeout: 3000 });

        const loadImageButton = canvas.getByTestId('load-random-image');
        const clearImageButton = canvas.getByTestId('clear-image');

        expect(canvas.queryByTestId('current-image-url')).toBeNull();

        // Load a random image
        await userEvent.click(loadImageButton);

        // Wait for the image to load and URL to appear
        await waitFor(() => {
            expect(canvas.getByTestId('current-image-url')).toBeTruthy();
        }, { timeout: 5000 });

        // Verify the image URL is displayed
        const imageUrlElement = canvas.getByTestId('current-image-url');
        expect(imageUrlElement.textContent).toContain('Current image: https://picsum.photos');

        // Clear the image
        await userEvent.click(clearImageButton);

        // Load another image to test it works multiple times
        await userEvent.click(loadImageButton);

        // Wait for the new image to load
        await waitFor(() => {
            expect(canvas.getByTestId('current-image-url')).toBeTruthy();
        }, { timeout: 5000 });
    }
};


export const TodoListStory: StoryObj = {
    name: 'Todo List Property',
    render: () => <TodoListTest src="db_list_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('list-length')).toBeTruthy();
        }, { timeout: 3000 });

        const initialLengthText = canvas.getByTestId('list-length').textContent;
        const initialCount = parseInt(initialLengthText?.match(/Items: (\d+)/)?.[1] || '0');

        // Test 1: addInstance - Add item to end
        const addButton = canvas.getByTestId('add-item-button');
        await userEvent.click(addButton);

        await waitFor(() => {
            expect(canvas.getByTestId('list-length').textContent).toContain(`Items: ${initialCount + 1}`);
        });

        // Test 2: addInstanceAt - Add item at specific index (if we have items)
        if (initialCount > 0) {
            const addAtButton = canvas.getByTestId('add-item-at-button');
            await userEvent.click(addAtButton);

            await waitFor(() => {
                expect(canvas.getByTestId('list-length').textContent).toContain(`Items: ${initialCount + 2}`);
            });
        }

        // Test 3: getInstanceAt - Interact with specific items
        const currentCount = initialCount + (initialCount > 0 ? 2 : 1);
        if (currentCount > 0) {
            await waitFor(() => {
                expect(canvas.getByTestId('todo-item-0')).toBeTruthy();
            });

            // Edit the first item
            const todoText = canvas.getByTestId('todo-text-0');
            await userEvent.clear(todoText);

            // Wait for the input to be cleared to avoid issues with autocomplete
            await waitFor(() => {
                expect((todoText as HTMLInputElement).value).toBe('');
            }, { timeout: 2000 });

            await userEvent.click(todoText);
            await userEvent.paste('Test Item');

            await waitFor(() => {
                expect(canvas.getByTestId('todo-text-value-0').textContent).toContain('Test Item');
            }, { timeout: 3000 });

        }

        // Test 4: swap - Swap first two items
        if (currentCount >= 2) {
            const firstText = canvas.getByTestId<HTMLInputElement>('todo-text-0').value;
            const secondText = canvas.getByTestId<HTMLInputElement>('todo-text-1').value;

            const swapButton = canvas.getByTestId('swap-button');
            await userEvent.click(swapButton);

            await waitFor(() => {
                expect(canvas.getByTestId('todo-text-0')).toHaveValue(secondText);
                expect(canvas.getByTestId('todo-text-1')).toHaveValue(firstText);
            }, { timeout: 3000 });
        }

        // Test 5: removeInstance - Remove by instance reference
        if (currentCount > 0) {
            const removeInstanceButton = canvas.getByTestId('remove-instance-button');
            await userEvent.click(removeInstanceButton);

            await waitFor(() => {
                expect(canvas.getByTestId('list-length').textContent).toContain(`Items: ${currentCount - 1}`);
            }, { timeout: 3000 });
        }

        // Test 6: removeInstanceAt - Remove by index
        const afterRemoveInstance = currentCount > 0 ? currentCount - 1 : 0;
        if (afterRemoveInstance > 0) {
            const removeIndexButton = canvas.getByTestId('remove-index-button');
            await userEvent.click(removeIndexButton);

            await waitFor(() => {
                expect(canvas.getByTestId('list-length').textContent).toContain(`Items: ${afterRemoveInstance - 1}`);
            }, { timeout: 3000 });
        }

    }
};

export const ArtboardPropertyStory: StoryObj = {
    name: 'Artboard Property',
    render: () => <ArtboardPropertyTest src="artboard_db_test.riv" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for the Rive file to load
        await waitFor(() => {
            expect(canvas.getByTestId('set-artboard1-blue')).toBeTruthy();
            expect(canvas.getByTestId('set-artboard1-red')).toBeTruthy();
            expect(canvas.getByTestId('set-artboard1-green')).toBeTruthy();
        }, { timeout: 3000 });

        // Initially should show None
        expect(canvas.getByTestId('artboard1-current').textContent).toBe('Current: None');
        expect(canvas.getByTestId('artboard2-current').textContent).toBe('Current: None');

        // Set artboard 1 to blue
        await userEvent.click(canvas.getByTestId('set-artboard1-blue'));
        await waitFor(() => {
            expect(canvas.getByTestId('artboard1-current').textContent).toBe('Current: ArtboardBlue');
        });

        // Set artboard 2 to red
        await userEvent.click(canvas.getByTestId('set-artboard2-red'));
        await waitFor(() => {
            expect(canvas.getByTestId('artboard2-current').textContent).toBe('Current: ArtboardRed');
        });

        // Switch artboard 1 to green
        await userEvent.click(canvas.getByTestId('set-artboard1-green'));
        await waitFor(() => {
            expect(canvas.getByTestId('artboard1-current').textContent).toBe('Current: ArtboardGreen');
        });

        // Switch artboard 2 to blue
        await userEvent.click(canvas.getByTestId('set-artboard2-blue'));
        await waitFor(() => {
            expect(canvas.getByTestId('artboard2-current').textContent).toBe('Current: ArtboardBlue');
        });
    }
};