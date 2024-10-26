// hooks
import React from 'react';

// utils
import { Checkbox } from 'primereact/checkbox';

export const Checkbox = ({checked}) => {
  return (
    <React.Fragment>
        <Checkbox 
            onChange={e => setChecked(e.checked)} 
            checked={checked}>
        </Checkbox>
    </React.Fragment>
  )
}