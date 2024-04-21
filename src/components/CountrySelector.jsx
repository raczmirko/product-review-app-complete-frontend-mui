import { useEffect, useState } from 'react';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CountryService from '../services/CountryService';

const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Fetch countries when the component mounts
        CountryService.fetchCountries()
            .then(data => setCountries(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
            required
            labelId="country-select-label"
            variant='filled'
            id="country-select"
            value={selectedCountry}
            label="Country"
            onChange={(e) => handleChange(e)}
            >
                {countries.map(country => (
                    <MenuItem key={country.countryCode} value={country}>{country.name}</MenuItem>
                ))}
            </Select>
      </FormControl>
    );
};

export default CountrySelector;
