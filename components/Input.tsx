import { useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isTextarea) {
      adjustHeight();
    }
  }, [defaultValue, value, isTextarea]);
  return (
    <>
      <div className="input-block-header">
        <span className="input-label">{label}</span>
        <Tooltip text={tooltipText} />
      </div>

      {isTextarea ? (
        <textarea
          ref={textareaRef}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
            adjustHeight();
          }}
          className="w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          className="w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      )}
    </>
  );
}
