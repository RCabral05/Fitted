import React, { useState, useEffect } from 'react';
import './styles.css';

const cartesianProduct = (arr) => {
    if (arr.length === 0) {
        return [[]]; // Return a single empty array to handle the base case
    }

    return arr.reduce((a, b) => {
        return a.flatMap((d) => b.map((e) => [d, e].flat()));
    }, [[]]); // Start with an array containing one empty array
};



const generateVariantCombinations = (options) => {
    // Map the options to their values only
    const values = options.map((option) => option.values);
    // Get the cartesian product of all option values
    const combinations = cartesianProduct(values);
    console.log(combinations);
    // Map the combinations to an object with option names as keys
    return combinations.map((combination) => ({
        variantQuantity: '',
        ...combination.reduce((acc, value, index) => ({
            ...acc,
            [options[index].name]: value,
        }), {})
    }));
};


export function Variants({ 
    options,
    setOptions,
    variantCombinations,
    setVariantCombinations,
    handleVariantInputChange,
    handleVariantFileChange
}) {
    // Use effect to generate variants when options change
    useEffect(() => {
        // Make sure options have at least one option with one value to generate combinations
        if (options.some(option => option.values.length > 0)) {
            const newVariantCombinations = generateVariantCombinations(options);
            setVariantCombinations(newVariantCombinations);
        } else {
            // If no options with values, clear the variant combinations
            setVariantCombinations([]);
        }
    }, [options, setVariantCombinations]);

    const addOption = () => {
        setOptions([...options, { name: '', values: [''] }]);
    };

    const removeOption = (optionIndex) => {
        const updatedOptions = options.filter((_, index) => index !== optionIndex);
        setOptions(updatedOptions);
    };

    const handleOptionNameChange = (optionIndex, newName) => {
        const updatedOptions = options.map((option, index) =>
            index === optionIndex ? { ...option, name: newName } : option
        );
        setOptions(updatedOptions);
    };

    const addValue = (optionIndex) => {
        const updatedOptions = options.map((option, index) => {
            if (index === optionIndex) {
                return { ...option, values: [...option.values, ''] };
            }
            return option;
        });
        setOptions(updatedOptions);
    };

    const removeValue = (optionIndex, valueIndex) => {
        const updatedOptions = options.map((option, index) => {
            if (index === optionIndex) {
                return {
                    ...option,
                    values: option.values.filter((_, idx) => idx !== valueIndex),
                };
            }
            return option;
        });
        setOptions(updatedOptions);
    };

    const handleValueChange = (optionIndex, valueIndex, newValue) => {
        const updatedOptions = options.map((option, index) => {
            if (index === optionIndex) {
                const updatedValues = option.values.map((value, idx) =>
                    idx === valueIndex ? newValue : value
                );
                return { ...option, values: updatedValues };
            }
            return option;
        });
        setOptions(updatedOptions);
    };

    // Render options and values for editing
    return (
        <div className='var-con'>
           <button type="button" className="button add-option-button" onClick={addOption}>
                Add Option
            </button>
            {options.map((option, optionIndex) => (
                <div key={optionIndex} className="option-section">
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Option name (e.g., Color, Size)"
                        value={option.name}
                        onChange={(e) => handleOptionNameChange(optionIndex, e.target.value)}
                    />
                    {option.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="value-section">
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Value (e.g., Red, Small)"
                                value={value}
                                onChange={(e) => handleValueChange(optionIndex, valueIndex, e.target.value)}
                            />
                            <button type="button" onClick={() => removeValue(optionIndex, valueIndex)}>
                                Remove Value
                            </button>
                        </div>
                    ))}
                    <button type="button" className="button" onClick={() => addValue(optionIndex)}>
                        Add Value
                    </button>
                    <button type="button" className="button" onClick={() => removeOption(optionIndex)}>
                        Remove Option
                    </button>


                   
                </div>
            ))}

                    {variantCombinations?.map((variant, index) => (
                        <div key={index} className="variant-combination-section">
                            <p>Variant Combination: {JSON.stringify(variant.color + '/' + variant.size)}</p>
                            <label>Variant Quantity:
                                <input
                                    type="number"
                                    name="variantQuantity"
                                    value={variant.variantQuantity || ''}
                                    onChange={(e) => handleVariantInputChange(index, e)}
                                />
                            </label>
                        </div>
                    ))}
         
        </ div>
    );
}
