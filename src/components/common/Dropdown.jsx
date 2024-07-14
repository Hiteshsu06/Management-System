import { Dropdown } from 'primereact/dropdown';

const Dropdown = ({selectedCity, cities, optionLabel, placeholder, className}) => {
  return (
    <div>
        <Dropdown 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.value)} 
            options={cities} 
            optionLabel={optionLabel}
            placeholder={placeholder}
            className={className}
         />
    </div>
  )
}

export default Dropdown;