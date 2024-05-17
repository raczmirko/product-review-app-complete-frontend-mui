import { useEffect, useState } from 'react';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CategoryService from '../../services/CategoryService';

const CategorySelector = ({ selectedCategory, setSelectedCategory, selectorType }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories when the component mounts
        // If selectorType is 'parent' then use fetchAvailableParentCategories endpoint
        if(selectorType === 'parent') {
            CategoryService.fetchAvailableParentCategories()
            .then(data => setCategories(data))
            .catch(error => console.error('Error:', error));
        }
        // If selectorType is 'leaf' then use fetchLeafCategories endpoint
        else if(selectorType === 'leaf') {
            CategoryService.fetchLeafCategories()
            .then(data => setCategories(data))
            .catch(error => console.error('Error:', error));
        }
        // If selectorType is anything else fetch all categories
        else {
            CategoryService.fetchCategories()
            .then(data => setCategories(data))
            .catch(error => console.error('Error:', error));
        }
    }, [selectorType]);

    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
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

export default CategorySelector;
