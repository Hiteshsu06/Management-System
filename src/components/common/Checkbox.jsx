import { Checkbox } from 'primereact/checkbox';

export const Checkbox = ({checked}) => {
  return (
    <div>
        <Checkbox 
            onChange={e => setChecked(e.checked)} 
            checked={checked}>
        </Checkbox>
    </div>
  )
}