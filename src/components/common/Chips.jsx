import { Chips } from 'primereact/chips';

const Chips = ({value}) => {
  return (
    <div>
        <Chips 
            value={value} 
            onChange={(e) => setValue(e.value)} 
        />
    </div>
  )
}

export default Chips;