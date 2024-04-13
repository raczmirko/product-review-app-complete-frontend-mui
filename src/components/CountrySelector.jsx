import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Function to fetch the list of countries from the API
const fetchCountries = async () => {
    try {
        const response = await fetch('http://localhost:8080/country/all');
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        return data; // Return the array of countries
    } catch (error) {
        console.error('Error fetching countries:', error);
        return []; // Return an empty array if an error occurs
    }
};

const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Fetch countries when the component mounts
        fetchCountries()
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
