import { useState } from 'react'
import { ROLE_LABELS } from '../lib/sedes'

const CREATABLE_ROLES = ['cocinero', 'despachador', 'delivery']

export default function Staff() {
  // TODO: GET /admin/staff
  const staff = []
  const [form, setForm] = useState({ name: '', email: '', password: '', role: CREATABLE_ROLES[0] })

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function onSubmit(e) {
    e.preventDefault()
    // TODO: POST /admin/staff
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-shoyu">Staff de tu sede</h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {staff.length === 0 ? (
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
          <button type="submit"
            className="mt-2 rounded-lg bg-salmon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-salmonDark">
            Crear cuenta
          </button>
        </form>
      </section>
    </div>
  )
}
