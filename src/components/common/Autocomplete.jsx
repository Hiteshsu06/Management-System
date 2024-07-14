import { AutoComplete } from 'primereact/autocomplete';

const Autocomplete = ({value, items, search, dropdown}) => {
  return (
    <div>
        <AutoComplete 
            value={value} 
            suggestions={items} 
            completeMethod={search} 
            onChange={(e) => setValue(e.value)} 
            dropdown={dropdown}
         />
    </div>
  )
}

export default Autocomplete;