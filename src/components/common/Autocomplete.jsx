// hooks
import React from 'react';

// utils
import { AutoComplete } from 'primereact/autocomplete';

const Autocomplete = ({value, items, search, dropdown}) => {
  return (
    <React.Fragment>
        <AutoComplete 
            value={value} 
            suggestions={items} 
            completeMethod={search} 
            onChange={(e) => setValue(e.value)} 
            dropdown={dropdown}
         />
    </React.Fragment>
  )
}

export default Autocomplete;