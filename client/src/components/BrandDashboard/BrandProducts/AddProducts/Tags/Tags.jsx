import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Tags({ selectedTags, setSelectedTags }) {
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/get-tags`);
                setAllTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        if (!selectedTags.includes(selectedValue)) {
            setSelectedTags([...selectedTags, selectedValue]);
        }
    };

    return (
        <div className="tags">
            <label>Tags:</label>
            <select value="" onChange={handleChange}>
                <option value="" disabled>Select a tag</option>
                {allTags.map((tag, index) => (
                    <option key={index} value={tag.name}>
                        {tag.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
