import { useEffect, useState } from 'react'
import { api, tomarOrden } from '../api/client'

function orderId(o) {
  return o.SK?.replace('ORDER#', '') || o.id || ''
}

function elapsed(createdAt) {
  if (!createdAt) return null
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 60000)
}

function urgencyClass(min) {
  if (min >= 10) return 'bg-alert/10 text-alert'
  if (min >= 5)  return 'bg-salmon/10 text-salmonDark'
  return 'bg-wasabi/30 text-nori'
}

function Ticket({ order, onDone }) {
  const [loading, setLoading] = useState(false)
  const [showMotivo, setShowMotivo] = useState(false)
  const [motivo, setMotivo] = useState('')
  const id = orderId(order)
  const min = elapsed(order.createdAt)

  async function decidir(decision) {
    if (decision === 'derivar' && !motivo.trim()) return
    setLoading(true)
    try {
      await tomarOrden(id, decision, decision === 'derivar' ? motivo.trim() : undefined)
      onDone()
    } catch (err) {
      if (err.status === 409) onDone()
      else alert(err.message || 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-shoyu/10 bg-white p-4 shadow-sm">
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
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyClass(min)}`}>
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
            placeholder="Motivo de la derivación…"
            rows={2}
            className="w-full rounded-lg border border-shoyu/20 px-3 py-2 text-sm text-shoyu focus:border-salmon focus:outline-none focus:ring-2 focus:ring-salmon/30"
          />
          <div className="flex gap-2">
            <button
              onClick={() => decidir('derivar')}
              disabled={loading || !motivo.trim()}
              className="flex-1 rounded-lg bg-status-en_revision px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Procesando…' : 'Confirmar derivación'}
            </button>
            <button
              onClick={() => { setShowMotivo(false); setMotivo('') }}
              disabled={loading}
              className="rounded-lg border border-shoyu/20 px-4 py-2 text-sm font-medium text-shoyu transition hover:border-shoyu/40"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => decidir('tomar')}
            disabled={loading}
            className="flex-1 rounded-lg bg-salmon px-4 py-2 text-sm font-semibold text-white transition hover:bg-salmonDark disabled:opacity-50"
          >
            {loading ? 'Procesando…' : 'Tomar'}
          </button>
          <button
            onClick={() => setShowMotivo(true)}
            disabled={loading}
            className="rounded-lg border border-status-en_revision/40 px-4 py-2 text-sm font-medium text-status-en_revision transition hover:bg-status-en_revision/10"
          >
            Derivar a revisión
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdmisionBoard() {
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

  // Pedidos esperando que el cocinero los tome (aún no tomados).
  const pendientes = orders.filter(
    (o) => o.status === 'recibido' && !o.steps?.tomar_orden?.endedAt
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-shoyu">Admisión</h1>
        <span className="text-sm text-shoyu/40">({pendientes.length})</span>
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
      ) : pendientes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-shoyu/15 p-6 text-center text-sm text-shoyu/40">
          No hay pedidos por admitir.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pendientes.map((o) => (
            <Ticket key={orderId(o)} order={o} onDone={load} />
          ))}
        </div>
      )}
    </div>
  )
}
