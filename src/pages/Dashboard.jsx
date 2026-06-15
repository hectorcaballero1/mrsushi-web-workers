import { useEffect, useState } from 'react'
import { api } from '../api/client'

const STATUS_LABELS = {
  recibido: 'Recibido',
  cocinando: 'Cocinando',
  empacando: 'Empacando',
  repartiendo: 'Repartiendo',
  entregado: 'Entregado',
}

const STATUS_DOT = {
  recibido: 'bg-status-recibido',
  cocinando: 'bg-status-cocinando',
  empacando: 'bg-status-empacando',
  repartiendo: 'bg-status-repartiendo',
  entregado: 'bg-status-entregado',
}

function elapsed(createdAt) {
  if (!createdAt) return '—'
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 60000) + ' min'
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [dash, orders] = await Promise.all([
          api('/dashboard'),
          api('/orders'),
        ])
        setSummary(dash.porStatus || {})
        const sorted = (Array.isArray(orders) ? orders : [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRecent(sorted.slice(0, 10))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <p className="py-20 text-center text-sm text-shoyu/40">Cargando…</p>
  )

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p className="rounded-lg bg-alert/10 px-4 py-3 text-sm text-alert">{error}</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Object.keys(STATUS_LABELS).map((key) => (
          <div key={key} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[key]}`} />
              <p className="text-xs uppercase tracking-wide text-shoyu/50">{STATUS_LABELS[key]}</p>
            </div>
            <p className="font-display text-3xl font-bold text-shoyu">
              {summary?.[key] ?? '—'}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-shoyu">Pedidos recientes</h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-shoyu/40">Sin pedidos aún.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-xs uppercase tracking-wide text-shoyu/50">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Origen</th>
                  <th className="px-4 py-3">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shoyu/5">
                {recent.map((o) => {
                  const id = o.SK?.replace('ORDER#', '') || o.id || ''
                  return (
                    <tr key={id}>
                      <td className="px-4 py-3 font-mono font-semibold text-shoyu">
                        #{id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${STATUS_DOT[o.status] || 'bg-shoyu/20'}`} />
                          {STATUS_LABELS[o.status] || o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize text-shoyu/70">{o.source}</td>
                      <td className="px-4 py-3 text-shoyu/70">{elapsed(o.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
