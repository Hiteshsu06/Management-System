import { Calendar } from 'primereact/calendar';

const Calender = ({date}) => {
  return (
    <div>
        <Calendar 
            value={date} 
            onChange={(e) => setDate(e.value)} 
        />
    </div>
  )
}

export default Calender;