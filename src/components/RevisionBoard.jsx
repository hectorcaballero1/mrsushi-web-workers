import { useEffect, useState } from 'react'
import { api, revisar } from '../api/client'

function orderId(o) {
  return o.SK?.replace('ORDER#', '') || o.id || ''
}

function elapsed(createdAt) {
  if (!createdAt) return null
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 60000)
}

function Ticket({ order, onDone }) {
  const [loading, setLoading] = useState(false)
  const [showMotivo, setShowMotivo] = useState(false)
  const [motivo, setMotivo] = useState('')
  const id = orderId(order)
  const min = elapsed(order.createdAt)

  async function decidir(decision) {
    setLoading(true)
    try {
      await revisar(id, decision, decision === 'cancelar' ? motivo.trim() : undefined)
      onDone()
    } catch (err) {
      if (err.status === 409) onDone()
      else alert(err.message || 'Error al procesar la revisión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-status-en_revision/30 bg-status-en_revision/5 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold tracking-tight text-shoyu">
          #{id.slice(0, 8)}
        </span>
        <div className="flex items-center gap-2">
          {order.source === 'rappi' && (
            <span className="rounded-full bg-station-rappi/10 px-2 py-0.5 text-xs font-semibold text-station-rappi">
              Rappi
            </span>
          )}
          {min !== null && (
            <span className="rounded-full bg-shoyu/5 px-2.5 py-1 text-xs font-semibold text-shoyu/60">
              {min} min
            </span>
          )}
        </div>
      </div>

      {order.customer?.name && (
        <p className="mt-2 text-sm font-medium text-shoyu">{order.customer.name}</p>
      )}
      {order.customer?.phone && (
        <p className="text-xs text-shoyu/60">{order.customer.phone}</p>
      )}

      {order.motivo && (
        <div className="mt-2 rounded-lg bg-status-en_revision/10 px-3 py-2 text-sm text-shoyu">
          <span className="font-semibold text-status-en_revision">Motivo: </span>{order.motivo}
        </div>
      )}

      <ul className="mt-2 space-y-0.5 text-sm text-shoyu/70">
        {(order.items || []).map((item, i) => (
          <li key={i}>{item.qty || 1}× {item.name || item.productId}</li>
        ))}
      </ul>

      {showMotivo ? (
        <div className="mt-4 flex flex-col gap-2">
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo de cancelación (opcional)…"
            rows={2}
            className="w-full rounded-lg border border-shoyu/20 px-3 py-2 text-sm text-shoyu focus:border-alert focus:outline-none focus:ring-2 focus:ring-alert/30"
          />
          <div className="flex gap-2">
            <button
              onClick={() => decidir('cancelar')}
              disabled={loading}
              className="flex-1 rounded-lg bg-status-cancelado px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Procesando…' : 'Confirmar cancelación'}
            </button>
            <button
              onClick={() => { setShowMotivo(false); setMotivo('') }}
              disabled={loading}
              className="rounded-lg border border-shoyu/20 px-4 py-2 text-sm font-medium text-shoyu transition hover:border-shoyu/40"
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => decidir('reenviar')}
            disabled={loading}
            className="flex-1 rounded-lg bg-salmon px-4 py-2 text-sm font-semibold text-white transition hover:bg-salmonDark disabled:opacity-50"
          >
            {loading ? 'Procesando…' : 'Re-enviar a cocina'}
          </button>
          <button
            onClick={() => setShowMotivo(true)}
            disabled={loading}
            className="rounded-lg border border-status-cancelado/40 px-4 py-2 text-sm font-medium text-status-cancelado transition hover:bg-status-cancelado/10"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

export default function RevisionBoard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const enRevision = orders.filter((o) => o.status === 'en_revision')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-shoyu">Revisión</h1>
        <span className="text-sm text-shoyu/40">({enRevision.length})</span>
        <button onClick={load} className="ml-auto rounded-lg border border-shoyu/20 px-3 py-1.5 text-sm text-shoyu transition hover:border-salmon hover:text-salmon">
          Refrescar
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-alert/10 px-4 py-3 text-sm text-alert">
          {error} <button onClick={load} className="ml-2 underline">Reintentar</button>
        </p>
      )}

      {loading ? (
        <p className="py-20 text-center text-sm text-shoyu/40">Cargando pedidos…</p>
      ) : enRevision.length === 0 ? (
        <p className="rounded-xl border border-dashed border-shoyu/15 p-6 text-center text-sm text-shoyu/40">
          No hay pedidos en revisión.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enRevision.map((o) => (
            <Ticket key={orderId(o)} order={o} onDone={load} />
          ))}
        </div>
      )}
    </div>
  )
}
