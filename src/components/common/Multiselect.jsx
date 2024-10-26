// hooks
import React from 'react';

// utils
import { MultiSelect } from 'primereact/multiselect';

const Multiselect = ({selectedCities, cities, optionLabel, placeholder, maxSelectedLabels, className}) => {
  return (
    <React.Fragment>
        <MultiSelect 
            value={selectedCities} 
            onChange={(e) => setSelectedCities(e.value)} 
            options={cities} 
            optionLabel={optionLabel} 
            placeholder={placeholder} 
            maxSelectedLabels={maxSelectedLabels} 
            className={className}  
        />
    </React.Fragment>
  )
}

export default Multiselect;