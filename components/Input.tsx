import Tooltip from "./Tooltip";

interface InputProps {
  label: string;
  tooltipText: string;
  type?: string;
  name?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
  isTextarea?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: any;
}

export default function Input({
  label,
  tooltipText,
  type,
  name,
  placeholder,
  min,
  max,
  required,
  isTextarea,
  defaultValue,
  value,
  onChange,
}: InputProps) {
  return (
    <>
      <div className="input-block-header">
        <span>{label}</span>
        <Tooltip text={tooltipText} />
      </div>

      {isTextarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      )}
    </>
  );
}
