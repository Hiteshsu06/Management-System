// hooks
import React from 'react';

// utils
import { Calendar } from 'primereact/calendar';

const Calender = ({date}) => {
  return (
    <React.Fragment>
        <Calendar 
            value={date} 
            onChange={(e) => setDate(e.value)} 
        />
    </React.Fragment>
  )
}

export default Calender;