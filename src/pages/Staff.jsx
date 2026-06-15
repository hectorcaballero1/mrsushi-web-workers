import { useEffect, useState } from 'react'
import { ROLE_LABELS } from '../lib/sedes'
import { api } from '../api/client'

const CREATABLE_ROLES = ['cocinero', 'despachador', 'delivery']
const EMPTY_FORM = { name: '', email: '', password: '', role: CREATABLE_ROLES[0] }

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)

  async function loadStaff() {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/admin/staff')
      setStaff(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStaff() }, [])

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    try {
      await api('/admin/staff', { method: 'POST', body: JSON.stringify(form) })
      setMsg({ ok: true, text: 'Cuenta creada.' })
      setForm(EMPTY_FORM)
      await loadStaff()
    } catch (err) {
      setMsg({ ok: false, text: err.message || 'Error al crear cuenta.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-shoyu">Staff de tu sede</h2>

        {error && (
          <p className="mb-4 rounded-lg bg-alert/10 px-4 py-3 text-sm text-alert">
            {error} <button onClick={loadStaff} className="ml-2 underline">Reintentar</button>
          </p>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-sm text-shoyu/40">Cargando…</p>
          ) : staff.length === 0 ? (
            <p className="p-8 text-center text-sm text-shoyu/40">Sin staff registrado aún.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-xs uppercase tracking-wide text-shoyu/50">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shoyu/5">
                {staff.map((s) => (
                  <tr key={s.email}>
                    <td className="px-4 py-3 font-medium text-shoyu">{s.name}</td>
                    <td className="px-4 py-3 text-shoyu/70">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-salmon/10 px-2.5 py-1 text-xs font-semibold text-salmonDark">
                        {ROLE_LABELS[s.role] || s.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-shoyu">Crear cuenta de staff</h2>

        {msg && (
          <p className={`mb-4 rounded-lg px-4 py-3 text-sm ${msg.ok ? 'bg-wasabi/20 text-nori' : 'bg-alert/10 text-alert'}`}>
            {msg.text}
          </p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Nombre
            <input name="name" value={form.name} onChange={onChange} required
              className="rounded-lg border border-shoyu/20 px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Correo
            <input name="email" type="email" value={form.email} onChange={onChange} required
              className="rounded-lg border border-shoyu/20 px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Contraseña
            <input name="password" type="password" value={form.password} onChange={onChange} required
              className="rounded-lg border border-shoyu/20 px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-shoyu">
            Rol
            <select name="role" value={form.role} onChange={onChange}
              className="rounded-lg border border-shoyu/20 px-3 py-2 text-sm focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30">
              {CREATABLE_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={submitting}
            className="mt-2 rounded-lg bg-salmon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-salmonDark disabled:opacity-60">
            {submitting ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </div>
  )
}
