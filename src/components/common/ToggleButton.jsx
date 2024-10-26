// hooks
import React from 'react';

// utils
import { ToggleButton } from 'primereact/togglebutton';

const ToggleButton = ({checked}) => {
  return (
    <React.Fragment>
        <ToggleButton 
            checked={checked} 
            onChange={(e) => setChecked(e.value)} 
        />
    </React.Fragment>
  )
}

export default ToggleButton;