function FormField({ label, required, helperText, ...inputProps }) {
  return (
    <div className="field">
      <div className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </div>
      <input {...inputProps} />
      <div className="helper-text">{helperText}</div>
    </div>
  );
}

export default FormField;
