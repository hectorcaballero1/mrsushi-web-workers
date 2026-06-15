import { useAuth } from '../context/AuthContext'
import { sedeName, ROLE_LABELS } from '../lib/sedes'

export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-shoyu/10 bg-paper px-6 py-4">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-salmon">
          {sedeName(user?.tenantId)}
        </p>
        <h1 className="font-display text-xl font-bold text-shoyu">Panel de Trabajadores</h1>
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
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
