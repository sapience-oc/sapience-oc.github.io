import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './FormControls.css';

function FieldLabel({ label, optional }) {
  return (
    <span className="field-label">
      {label}
      {optional && <span className="field-optional"> (opcional)</span>}
    </span>
  );
}

export function TextField({ label, optional, ...props }) {
  return (
    <label className="field">
      <FieldLabel label={label} optional={optional} />
      <input className="field-input" {...props} />
    </label>
  );
}

export function PasswordField({ label, optional, ...props }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <label className="field">
      <FieldLabel label={label} optional={optional} />
      <div className="field-password-wrap">
        <input className="field-input" type={visivel ? 'text' : 'password'} {...props} />
        <button
          type="button"
          className="field-password-toggle"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          tabIndex={-1}
        >
          {visivel ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

export function TextArea({ label, optional, ...props }) {
  return (
    <label className="field">
      <FieldLabel label={label} optional={optional} />
      <textarea className="field-input field-textarea" {...props} />
    </label>
  );
}

export function SelectField({ label, optional, children, ...props }) {
  return (
    <label className="field">
      <FieldLabel label={label} optional={optional} />
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