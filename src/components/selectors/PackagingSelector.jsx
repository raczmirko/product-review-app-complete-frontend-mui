import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';
import { useEffect, useState } from 'react';
import PackagingService from '../../services/PackagingService';

const PackagingSelector = ({ selectedPackaging, setSelectedPackaging, articleId }) => {
    const [packagings, setPackagings] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Fetch countries when the component mounts
        PackagingService.fetchAvailablePackagings(articleId)
            .then(data => {
                setPackagings(data);
                setIsLoaded(true);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleChange = (event) => {
        const selectedId = event.target.value;
        const selectedPack = packagings.find(pack => pack.id === selectedId);
        setSelectedPackaging(selectedPack);
    };

    return (
        <>
        {packagings && isLoaded &&
            <FormControl fullWidth>
                <InputLabel id="packaging-select-label">Packaging</InputLabel>
                <Select
                required
                labelId="packaging-select-label"
                variant='outlined'
                id="packaging-select"
                value={selectedPackaging ? selectedPackaging.id : ''}
                label="Packaging"
                onChange={(e) => handleChange(e)}
                sx={{ mb: 2 }}
                >
                    {packagings.map(packaging => (
                        <MenuItem key={packaging.id} value={packaging.id}>[ID#{packaging.id}] - {packaging.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
        </>
    );
};

export default PackagingSelector;
