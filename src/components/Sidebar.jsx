import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase = 'rounded-xl px-4 py-3 text-sm font-medium transition'
const linkActive = 'bg-salmon text-ink'
const linkInactive = 'text-paper/70 hover:bg-inkLight hover:text-paper'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="flex w-60 flex-col gap-1 bg-ink p-4">
      <div className="mb-6 px-2">
        <p className="font-display text-2xl font-bold text-paper">Mr Sushi</p>
        <p className="text-xs uppercase tracking-[0.3em] text-paper/40">Operaciones</p>
      </div>

      <NavLink
        to="/pendientes"
        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
      >
        Pendientes
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
      >
        Dashboard
      </NavLink>

      {user?.role === 'admin' && (
        <NavLink
          to="/staff"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          Staff de la sede
        </NavLink>
      )}
    </aside>
  )
}
