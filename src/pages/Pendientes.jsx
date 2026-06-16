import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

const STATIONS = {
  cocina_fria:     { label: 'Cocina Fría',       dot: 'bg-station-fria' },
  cocina_caliente: { label: 'Cocina Caliente',   dot: 'bg-station-caliente' },
  empacar:         { label: 'Empacar',            dot: 'bg-station-empacar' },
  repartir:        { label: 'Repartir',           dot: 'bg-station-repartir' },
  entregar_rappi:  { label: 'Entregar a Rappi',   dot: 'bg-station-rappi' },
}

const ROLE_STATIONS = {
  cocinero:    ['cocina_fria', 'cocina_caliente'],
  despachador: ['empacar'],
  delivery:    ['repartir', 'entregar_rappi'],
  admin:       Object.keys(STATIONS),
}

// Qué status de pedido corresponde a cada estación
const STATION_STATUS = {
  cocina_fria:     'cocinando',
  cocina_caliente: 'cocinando',
  empacar:         'empacando',
  repartir:        'repartiendo',
  entregar_rappi:  'repartiendo',
}

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

function Ticket({ order, stationKey, onAdvanced }) {
  const [loading, setLoading] = useState(false)
  const id = orderId(order)
  const min = elapsed(order.createdAt)

  const stepData = order.steps?.[stationKey] ?? {}
  const isTaken = !!stepData.startedAt && !stepData.endedAt
  const label = isTaken ? 'Marcar listo' : 'Tomar'

  async function advance() {
    setLoading(true)
    try {
      await api(`/orders/${id}/advance`, {
        method: 'POST',
        body: JSON.stringify({ step: stationKey }),
      })
      onAdvanced()
    } catch (err) {
      if (err.status === 409) {
        onAdvanced()
      } else {
        alert(err.message || 'Error al avanzar el pedido')
      }
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

      <ul className="mt-2 space-y-0.5 text-sm text-shoyu/70">
        {(order.items || []).map((item, i) => (
          <li key={i}>{item.qty || 1}× {item.name || item.productId}</li>
        ))}
      </ul>

      <button
        onClick={advance}
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-salmon px-4 py-2 text-sm font-semibold text-white transition hover:bg-salmonDark disabled:opacity-50"
      >
        {loading ? 'Procesando…' : label}
      </button>
    </div>
  )
}

export default function Pendientes() {
  const { user } = useAuth()
  const stations = ROLE_STATIONS[user?.role] || []
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

  function ordersForStation(key) {
    const status = STATION_STATUS[key]
    const filtered = orders.filter((o) => o.status === status)
    if (key === 'cocina_fria')     return filtered.filter((o) => o.tieneFria)
    if (key === 'cocina_caliente') return filtered.filter((o) => o.tieneCaliente)
    return filtered
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg bg-alert/10 px-4 py-3 text-sm text-alert">
          {error} <button onClick={load} className="ml-2 underline">Reintentar</button>
        </p>
      )}

      {loading ? (
        <p className="py-20 text-center text-sm text-shoyu/40">Cargando pedidos…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stations.map((key) => {
            const station = STATIONS[key]
            const list = ordersForStation(key)
            return (
              <section key={key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${station.dot}`} />
                  <h2 className="font-display text-lg font-bold text-shoyu">{station.label}</h2>
                  <span className="text-sm text-shoyu/40">({list.length})</span>
                </div>

                {list.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-shoyu/15 p-6 text-center text-sm text-shoyu/40">
                    Sin pedidos en esta cola.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {list.map((o) => (
                      <Ticket key={orderId(o)} order={o} stationKey={key} onAdvanced={load} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
