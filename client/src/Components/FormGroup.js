import classNames from 'classnames';

function FormGroup({
  children,
  disabled,
  id,
  type = 'text',
  name,
  label,
  helpText,
  placeholder,
  plaintext,
  record,
  required,
  value,
  error,
  onBlur,
  onChange,
}) {
  return (
    <div className="mb-3">
      {type === 'checkbox' && (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            disabled={!!disabled}
            id={id ?? name}
            name={name}
            placeholder={placeholder}
            readOnly={plaintext}
            onChange={onChange}
            checked={record ? record[name] : value}
          />
          <label className="form-check-label opacity-100" htmlFor={id ?? name}>
            {label}
          </label>
        </div>
      )}
      {type !== 'checkbox' && (
        <>
          <label className="form-label" htmlFor={id ?? name}>
            {label}
          </label>
          {type === 'select' && (
            <select
              className={classNames({
                'form-select': !plaintext,
                'form-control-plaintext': plaintext,
                'is-invalid': error?.errorsFor?.(name),
              })}
              disabled={!!disabled}
              id={id ?? name}
              name={name}
              placeholder={placeholder}
              readOnly={plaintext}
              required={required}
              onChange={onChange}
              onBlur={(event) => onBlur?.(event)}
              value={record ? record[name] : value}>
              {children}
            </select>
          )}
          {type === 'textarea' && (
            <textarea
              className={classNames({
                'form-control': !plaintext,
                'form-control-plaintext': plaintext,
                'is-invalid': error?.errorsFor?.(name),
              })}
              disabled={!!disabled}
              id={id ?? name}
              name={name}
              placeholder={placeholder}
              readOnly={plaintext}
              required={required}
              onChange={onChange}
              onBlur={(event) => onBlur?.(event)}
              value={record ? record[name] : value}></textarea>
          )}
          {type !== 'textarea' && type !== 'select' && (
            <input
              type={type}
              className={classNames({
                'form-control': !plaintext,
                'form-control-plaintext': plaintext,
                'is-invalid': error?.errorsFor?.(name),
              })}
              disabled={!!disabled}
              id={id ?? name}
              name={name}
              placeholder={placeholder}
              readOnly={plaintext}
              required={required}
              onChange={onChange}
              onBlur={(event) => onBlur?.(event)}
              value={record ? record[name] : value}
            />
          )}
        </>
      )}
      {error?.errorMessagesHTMLFor?.(name)}
      {helpText && <div className="form-text">{helpText}</div>}
    </div>
  );
}
export default FormGroup;
