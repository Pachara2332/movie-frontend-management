import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthTextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
}

const AuthTextField = ({ id, label, ...inputProps }: AuthTextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const isPassword = inputProps.type === 'password';

  return (
    <div className="field-group">
      <label htmlFor={inputId} className={`field-label ${isFocused ? 'active' : ''}`}>
        {label}
      </label>

      <div className="field-shell">
        <input
          {...inputProps}
          id={inputId}
          type={isPassword && showPassword ? 'text' : inputProps.type}
          className={`field-input ${isPassword ? 'has-toggle' : ''}`}
          onBlur={(event) => {
            setIsFocused(false);
            inputProps.onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((current) => !current)}
            disabled={inputProps.disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthTextField;
