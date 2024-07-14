import { InputText } from "primereact/inputtext";

const InputTextComponent = ({
  value,
  type,
  id,
  placeholder,
  onChange,
  name,
  className,
  required,
  disabled = false,
  onBlur,
  onFocus,
  error,
  touched,
  isLabel,
}) => (
  <div className="custom-input-design w-full">
    {isLabel ? (
      <label className="text-[13px] text-TextPrimaryColor">{placeholder}</label>
    ) : null}
    <InputText
      value={value}
      onChange={onChange}
      type={type}
      id={id}
      placeholder={placeholder}
      name={name}
      className={className}
      required={required}
      disabled={disabled}
      onBlur={onBlur}
      onFocus={onFocus}
    />
    {error && touched ? (
      <p className="text-[0.7rem] text-red-600">{error}</p>
    ) : (
      ""
    )}
  </div>
);

export default InputTextComponent;
