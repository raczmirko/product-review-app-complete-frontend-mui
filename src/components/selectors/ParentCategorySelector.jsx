import { useEffect, useState } from 'react';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CategoryService from '../../services/CategoryService';

const ParentCategorySelector = ({ selectedCategory, setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories when the component mounts
        CategoryService.fetchAvailableParentCategories()
            .then(data => setCategories(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="category-select-label">Parent category</InputLabel>
            <Select
            labelId="category-select-label"
            variant='filled'
            id="category-select"
            value={selectedCategory}
            label="Category"
            onChange={(e) => handleChange(e)}
            >
                {categories.map(category => (
                    <MenuItem key={category.id} value={category}>{category.name}</MenuItem>
                ))}
            </Select>
      </FormControl>
    );
};

export default ParentCategorySelector;
