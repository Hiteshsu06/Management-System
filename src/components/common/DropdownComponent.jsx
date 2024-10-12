import { Dropdown } from 'primereact/dropdown';

const DropdownComponent = ({value, name, editable, data, onChange, optionLabel, placeholder, className, error, touched, label}) => {
  return (
    <div>
       {placeholder ? (
          <label className="text-[12px] text-TextSecondaryColor ms-[4px] font-[600]">{placeholder}</label>
        ) : null}
        <Dropdown 
            name={name}
            value={value} 
            onChange={onChange} 
            options={data} 
            editable={editable}
            optionLabel={optionLabel}
            placeholder={placeholder}
            className={className}
         />
         {error && touched ? (
            <p className="text-[0.7rem] text-red-600">{error}</p>
          ) : (
            ""
          )}
    </div>
  )
}

export default DropdownComponent;