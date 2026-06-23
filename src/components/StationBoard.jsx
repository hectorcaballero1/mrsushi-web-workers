import { useEffect, useState } from 'react'
import { api } from '../api/client'

const STATIONS = {
  cocina_fria:     { label: 'Cocina Fría',       dot: 'bg-station-fria' },
  cocina_caliente: { label: 'Cocina Caliente',   dot: 'bg-station-caliente' },
  empacar:         { label: 'Empacar',            dot: 'bg-station-empacar' },
  repartir:        { label: 'Repartir',           dot: 'bg-station-repartir' },
  entregar_rappi:  { label: 'Entregar a Rappi',   dot: 'bg-station-rappi' },
}

// Status de pedido que corresponde a cada estación
const STATION_STATUS = {
  cocina_fria:     'cocinando',
  cocina_caliente: 'cocinando',
  empacar:         'empacando',
  repartir:        'repartiendo',
  entregar_rappi:  'entregando_a_rappi',
}

// Estaciones de solo lectura: el avance lo dispara otro sistema, no el trabajador.
// 'entregar_rappi' se completa cuando el repartidor de Rappi confirma la entrega
// (webhook desde el simulador → resume_step), por eso no lleva botón "Tomar/Listo".
const READONLY_STATIONS = new Set(['entregar_rappi'])

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
  const readOnly = READONLY_STATIONS.has(stationKey)

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

  // Pedido tomado → resaltado fuerte "en su sitio" para distinguir lo que se está
  // preparando de lo que sigue en cola.
  const cardClass = isTaken
    ? 'rounded-xl border-2 border-salmon bg-salmon/5 p-4 shadow-md ring-2 ring-salmon/20'
    : 'rounded-xl border border-shoyu/10 bg-white p-4 shadow-sm'

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold tracking-tight text-shoyu">
          #{id.slice(0, 8)}
        </span>
        <div className="flex items-center gap-2">
          {isTaken && (
            <span className="rounded-full bg-salmon px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              En prep
            </span>
          )}
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

      {readOnly ? (
        <p className="mt-4 w-full rounded-lg bg-station-rappi/10 px-4 py-2 text-center text-sm font-semibold text-station-rappi">
          Esperando repartidor de Rappi…
        </p>
      ) : (
        <button
          onClick={advance}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-salmon px-4 py-2 text-sm font-semibold text-white transition hover:bg-salmonDark disabled:opacity-50"
        >
          {loading ? 'Procesando…' : label}
        </button>
      )}
    </div>
  )
}

export default function StationBoard({ stations, title }) {
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
    // Ocultar pedidos cuyo step de esta estación ya se completó (tiene endedAt).
    // Necesario en cocina: fría y caliente comparten status 'cocinando' y corren en
    // paralelo, así que al terminar fría el pedido sigue 'cocinando' por caliente.
    const stepDone = (o) => !!o.steps?.[key]?.endedAt
    const filtered = orders.filter((o) => o.status === status && !stepDone(o))
    if (key === 'cocina_fria')     return filtered.filter((o) => o.tieneFria)
    if (key === 'cocina_caliente') return filtered.filter((o) => o.tieneCaliente)
    return filtered
  }

  return (
    <div className="flex flex-col gap-6">
      {title && (
        <h1 className="font-display text-2xl font-bold text-shoyu">{title}</h1>
      )}

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
