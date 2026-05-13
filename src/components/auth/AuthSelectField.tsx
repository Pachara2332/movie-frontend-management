import { useState, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface AuthSelectOption {
  label: string;
  value: string;
}

interface AuthSelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  options: AuthSelectOption[];
}

const AuthSelectField = ({ id, label, options, ...selectProps }: AuthSelectFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="field-group">
      <label htmlFor={selectId} className={`field-label ${isFocused ? 'active' : ''}`}>
        {label}
      </label>

      <div className="field-shell">
        <select
          {...selectProps}
          id={selectId}
          className="field-input has-select-icon"
          onBlur={(event) => {
            setIsFocused(false);
            selectProps.onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            selectProps.onFocus?.(event);
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="select-icon" size={18} />
      </div>
    </div>
  );
};

export default AuthSelectField;
