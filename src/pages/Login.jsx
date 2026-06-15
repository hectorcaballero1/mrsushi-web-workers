import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SEDE_NAMES } from '../lib/sedes'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantId, setTenantId] = useState(Object.keys(SEDE_NAMES)[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, tenantId)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-8 shadow-2xl">
        <p className="font-display text-3xl font-bold text-shoyu">Mr Sushi</p>
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.3em] text-salmon">
          Panel de Trabajadores
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Correo
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-shoyu/20 bg-white px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30"
              placeholder="cocinero@mrsushi-lamarina.com"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-shoyu/20 bg-white px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30"
              placeholder="••••••••"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Sede
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="rounded-lg border border-shoyu/20 bg-white px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30"
            >
              {Object.entries(SEDE_NAMES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </label>

          {error && (
            <p className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-salmon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-salmonDark disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
