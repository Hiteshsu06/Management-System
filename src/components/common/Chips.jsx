// hooks
import React from 'react';

// utils
import { Chips } from 'primereact/chips';

const Chips = ({value}) => {
  return (
    <React.Fragment>
        <Chips 
            value={value} 
            onChange={(e) => setValue(e.value)} 
        />
    </React.Fragment>
  )
}

export default Chips;