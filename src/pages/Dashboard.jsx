import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const STATUS_LABELS = {
  recibido: 'Recibido',
  cocinando: 'Cocinando',
  empacando: 'Empacando',
  repartiendo: 'Repartiendo',
  entregando_a_rappi: 'Entregando a Rappi',
  entregado: 'Entregado',
}

const STATUS_DOT = {
  recibido: 'bg-status-recibido',
  cocinando: 'bg-status-cocinando',
  empacando: 'bg-status-empacando',
  repartiendo: 'bg-status-repartiendo',
  entregando_a_rappi: 'bg-station-rappi',
  entregado: 'bg-status-entregado',
}

function orderId(o) {
  return o.SK?.replace('ORDER#', '') || o.id || ''
}

function elapsed(createdAt) {
  if (!createdAt) return '—'
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 60000) + 'm'
}

const selectClass =
  'rounded-lg border border-shoyu/20 bg-white px-3 py-1.5 text-sm text-shoyu focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/orders')
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    return orders
      .filter((o) => (!statusFilter || o.status === statusFilter))
      .filter((o) => (!sourceFilter || o.source === sourceFilter))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, statusFilter, sourceFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-shoyu">
          Pedidos <span className="text-shoyu/40">({rows.length})</span>
        </h1>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={selectClass}>
            <option value="">Todos los orígenes</option>
            <option value="web">Web</option>
            <option value="rappi">Rappi</option>
          </select>
          <button onClick={load} className="rounded-lg border border-shoyu/20 px-3 py-1.5 text-sm text-shoyu transition hover:border-salmon hover:text-salmon">
            Refrescar
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-alert/10 px-4 py-3 text-sm text-alert">
          {error} <button onClick={load} className="ml-2 underline">Reintentar</button>
        </p>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-sm text-shoyu/40">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-shoyu/40">Sin pedidos para este filtro.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-ink/5 text-xs uppercase tracking-wide text-shoyu/50">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Tiempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shoyu/5">
              {rows.map((o) => {
                const id = orderId(o)
                return (
                  <tr key={id} className="hover:bg-paper/60">
                    <td className="px-4 py-3 font-mono font-semibold text-shoyu">#{id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <span className={`h-2 w-2 rounded-full ${STATUS_DOT[o.status] || 'bg-shoyu/20'}`} />
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-shoyu/70">{o.source}</td>
                    <td className="px-4 py-3 text-shoyu/70">{o.customer?.name || '—'}</td>
                    <td className="px-4 py-3 text-right text-shoyu/70">
                      {o.total != null ? `S/ ${Number(o.total).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-shoyu/70">{elapsed(o.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
