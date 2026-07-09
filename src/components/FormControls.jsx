import './FormControls.css';

export function TextField({ label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="field-input" {...props} />
    </label>
  );
}

export function TextArea({ label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea className="field-input field-textarea" {...props} />
    </label>
  );
}

export function SelectField({ label, children, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="field-input" {...props}>
        {children}
      </select>
    </label>
  );
}

export function PrimaryButton({ children, loading, ...props }) {
  return (
    <button className="btn-primary" disabled={loading || props.disabled} {...props}>
      {loading ? 'Carregando...' : children}
    </button>
  );
}

export function GhostButton({ children, ...props }) {
  return (
    <button className="btn-ghost" {...props}>
      {children}
    </button>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <label className="switch-row">
      {label && <span className="switch-label">{label}</span>}
      <span className={`switch ${checked ? 'checked' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="switch-knob" />
      </span>
    </label>
  );
}
