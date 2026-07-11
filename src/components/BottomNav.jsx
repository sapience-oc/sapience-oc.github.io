import { NavLink } from 'react-router-dom';
import { Home, Heart, Calendar, User } from 'lucide-react';
import './BottomNav.css';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/calendario', label: 'Calendário', icon: Calendar },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={22} strokeWidth={2.2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
