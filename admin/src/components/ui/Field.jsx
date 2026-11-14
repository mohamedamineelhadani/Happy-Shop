export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <label className={`field${error ? " field--error" : ""}`} htmlFor={htmlFor}>
      {label ? <span className="field__label">{label}</span> : null}
      {children}
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}
