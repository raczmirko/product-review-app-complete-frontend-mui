import { useEffect, useState } from 'react';

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

const CountrySelector = ({ onSelect }) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Fetch countries when the component mounts
        fetchCountries()
            .then(data => setCountries(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="selector">
            <select onChange={(e) => onSelect(countries[e.target.selectedIndex - 1])} required>
                <option value="">Select a country</option>
                {countries.map(country => (
                    <option key={country.countryCode} value={country.countryCode}>{country.name}</option>
                ))}
            </select>
        </div>
    );
};

export default CountrySelector;
