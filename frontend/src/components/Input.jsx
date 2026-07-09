import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, id, error, type = 'text', className = '', ...rest }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={`input-base ${error ? 'input-error' : ''} ${className}`}
          {...rest}
        />
        {error && (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
