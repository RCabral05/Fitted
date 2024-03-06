// Tags.js
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useProducts } from '../../../../../context/ProductsContext';

export function Tags({ selectedTags, setSelectedTags }) {
    const { tags } = useProducts();
    const animatedComponents = makeAnimated();

    // Convert tags for use with react-select
    const options = tags.map(tag => ({ value: tag.name, label: tag.name }));

    // Handle change in selection
    const handleChange = (selectedOptions) => {
        setSelectedTags(selectedOptions.map(option => option.value));
    };

    // Format the selected tags for the react-select component
    const value = selectedTags.map(tag => ({ value: tag, label: tag }));

    return (
        <div className="tags">
            <label>Tags:</label>
            <Select
                components={animatedComponents}
                isMulti
                closeMenuOnSelect={false}
                options={options}
                onChange={handleChange}
                value={value}
                hideSelectedOptions={false}
                classNamePrefix="select"
            />
        </div>
    );
}
