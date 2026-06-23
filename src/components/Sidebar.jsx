import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase = 'rounded-xl px-4 py-3 text-sm font-medium transition'
const linkActive = 'bg-salmon text-ink'
const linkInactive = 'text-paper/70 hover:bg-inkLight hover:text-paper'

// Páginas de operación por estación, visibles según el rol del trabajador.
const STATION_LINKS = [
  { to: '/cocina',   label: 'Cocina',   roles: ['cocinero', 'admin'] },
  { to: '/empacar',  label: 'Empacar',  roles: ['despachador', 'admin'] },
  { to: '/repartir', label: 'Repartir', roles: ['delivery', 'admin'] },
]

export default function Sidebar() {
  const { user } = useAuth()
  const role = user?.role
  const navClass = ({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`

  return (
    <aside className="flex w-60 flex-col gap-1 bg-ink p-4">
      <div className="mb-6 px-2">
        <p className="font-display text-2xl font-bold text-paper">Mr Sushi</p>
        <p className="text-xs uppercase tracking-[0.3em] text-paper/40">Operaciones</p>
      </div>

      {STATION_LINKS.filter((l) => l.roles.includes(role)).map((l) => (
        <NavLink key={l.to} to={l.to} className={navClass}>
          {l.label}
        </NavLink>
      ))}

      <NavLink to="/dashboard" className={navClass}>
        Dashboard
      </NavLink>

      {role === 'admin' && (
        <NavLink to="/staff" className={navClass}>
          Staff de la sede
        </NavLink>
      )}
    </aside>
  )
}
