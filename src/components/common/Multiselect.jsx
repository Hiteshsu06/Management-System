import { MultiSelect } from 'primereact/multiselect';

const Multiselect = ({selectedCities, cities, optionLabel, placeholder, maxSelectedLabels, className}) => {
  return (
    <div>
        <MultiSelect 
            value={selectedCities} 
            onChange={(e) => setSelectedCities(e.value)} 
            options={cities} 
            optionLabel={optionLabel} 
            placeholder={placeholder} 
            maxSelectedLabels={maxSelectedLabels} 
            className={className}  
        />
    </div>
  )
}

export default Multiselect;