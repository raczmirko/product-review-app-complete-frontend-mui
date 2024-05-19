import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';
import { useEffect, useState } from 'react';
import PackagingService from '../../services/PackagingService';

const PackagingSelector = ({ selectedPackaging, setSelectedPackaging }) => {
    const [packagings, setPackagings] = useState([]);

    useEffect(() => {
        // Fetch countries when the component mounts
        PackagingService.fetchPackagings()
            .then(data => setPackagings(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleChange = (event) => {
        setSelectedPackaging(event.target.value);
    };

    return (
        <>
        {packagings &&
            <FormControl fullWidth>
                <InputLabel id="packaging-select-label">Packaging</InputLabel>
                <Select
                required
                labelId="packaging-select-label"
                variant='outlined'
                id="packaging-select"
                value={selectedPackaging}
                label="Packaging"
                onChange={(e) => handleChange(e)}
                >
                    {packagings.map(packaging => (
                        <MenuItem key={packaging.id} value={packaging}>[ID#{packaging.id}] - {packaging.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
        </>
    );
};

export default PackagingSelector;
