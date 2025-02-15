import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as React from "react";
import { useEffect, useState } from "react";
import CountryService from "../../services/CountryService";

const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  const [countries, setCountries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fetch countries when the component mounts
    CountryService.fetchCountries()
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsLoaded(true));
  }, []);

  const handleChange = (event) => {
    //setSelectedCountry(event.target.value);
    const selected = countries.find(
      (country) => country.countryCode === event.target.value
    );
    setSelectedCountry(selected);
  };

  return (
    <>
      {isLoaded && (
        <FormControl fullWidth>
          <InputLabel id="country-select-label">Country</InputLabel>
          <Select
            required
            labelId="country-select-label"
            variant="filled"
            id="country-select"
            value={selectedCountry?.countryCode || ""}
            label="Country"
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {countries.map((country) => (
              <MenuItem key={country.countryCode} value={country.countryCode}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default CountrySelector;
