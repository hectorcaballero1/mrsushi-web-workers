import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sedeName, ROLE_LABELS } from '../lib/sedes'

const navLink = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-salmon' : 'text-shoyu/60 hover:text-shoyu'}`

const STATION_LINKS = [
  { to: '/cocina',   label: 'Cocina',   roles: ['cocinero', 'admin'] },
  { to: '/empacar',  label: 'Empacar',  roles: ['despachador', 'admin'] },
  { to: '/repartir', label: 'Repartir', roles: ['delivery', 'admin'] },
]

export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-shoyu/10 bg-paper px-6 py-3">
      <div className="flex items-center gap-8">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salmon">
            {sedeName(user?.tenantId)}
          </p>
          <p className="font-display text-lg font-bold text-shoyu">Mr Sushi</p>
        </div>

        <nav className="flex items-center gap-6">
          {STATION_LINKS.filter((l) => l.roles.includes(user?.role)).map((l) => (
            <NavLink key={l.to} to={l.to} className={navLink}>{l.label}</NavLink>
          ))}
          <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/staff" className={navLink}>Staff</NavLink>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-shoyu">{user?.name}</p>
          <p className="text-xs uppercase tracking-wide text-shoyu/50">
            {ROLE_LABELS[user?.role] || user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-shoyu/20 px-4 py-2 text-sm font-medium text-shoyu transition hover:border-salmon hover:text-salmon"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
