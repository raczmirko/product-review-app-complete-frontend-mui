import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';
import { useEffect, useState } from 'react';
import BrandService from '../../services/BrandService';

const BrandSelector = ({ selectedBrand, setSelectedBrand }) => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        // Fetch brands when the component mounts
        BrandService.fetchBrands()
            .then(data => setBrands(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleChange = (event) => {
        setSelectedBrand(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="brand-select-label">Brand</InputLabel>
            <Select
            required
            labelId="brand-select-label"
            variant='filled'
            id="brand-select"
            value={selectedBrand}
            label="Brand"
            onChange={(e) => handleChange(e)}
            sx={{ mb: 2 }}
            >
                {brands.map(brand => (
                    <MenuItem key={brand.id} value={brand}>{brand.name}</MenuItem>
                ))}
            </Select>
      </FormControl>
    );
};

export default BrandSelector;
