import Logo from './Logo';
import './AuthLayout.css';

export default function AuthLayout({ topSlot, children }) {
  return (
    <div className="auth-layout">
      <div className="auth-header gradient-bg">
        <Logo size={64} />
      </div>
      <div className="auth-sheet">
        <div className="auth-sheet-scroll scroll-area">
          {topSlot}
          <div className="auth-sheet-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
