import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const STATIONS = {
  cocina_fria: { label: 'Cocina Fría', dot: 'bg-station-fria' },
  cocina_caliente: { label: 'Cocina Caliente', dot: 'bg-station-caliente' },
  empacar: { label: 'Empacar', dot: 'bg-station-empacar' },
  repartir: { label: 'Repartir', dot: 'bg-station-repartir' },
  entregar_rappi: { label: 'Entregar a Rappi', dot: 'bg-station-rappi' },
}

const ROLE_STATIONS = {
  cocinero: ['cocina_fria', 'cocina_caliente'],
  despachador: ['empacar'],
  delivery: ['repartir', 'entregar_rappi'],
  admin: Object.keys(STATIONS),
}

// TODO: reemplazar por GET /orders?status=<estado correspondiente al step>
const MOCK_TICKETS = {
  cocina_fria: [
    { id: 'a1b2', items: ['2x Acevichado Maki', '1x Arma tu Poke'], minutes: 3, source: 'web' },
    { id: 'c3d4', items: ['1x Maki Box (2 sabores)'], minutes: 9, source: 'rappi' },
  ],
  cocina_caliente: [
    { id: 'e5f6', items: ['1x Alitas BBQ', '2x Ebi Furai'], minutes: 12, source: 'web' },
  ],
  empacar: [
    { id: 'g7h8', items: ['1x Temaki Acevichado', '1x Gaseosa'], minutes: 2, source: 'web' },
  ],
  repartir: [{ id: 'i9j0', items: ['3x Maki California'], minutes: 6, source: 'web' }],
  entregar_rappi: [{ id: 'k1l2', items: ['1x Super Maki Box'], minutes: 1, source: 'rappi' }],
}

function urgencyClasses(minutes) {
  if (minutes >= 10) return 'bg-alert/10 text-alert'
  if (minutes >= 5) return 'bg-salmon/10 text-salmonDark'
  return 'bg-wasabi/30 text-nori'
}

function Ticket({ ticket }) {
  const [taken, setTaken] = useState(false)
  const [done, setDone] = useState(false)

  if (done) return null

  return (
    <div className="rounded-xl border border-shoyu/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold tracking-tight text-shoyu">
          #{ticket.id}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyClasses(ticket.minutes)}`}
        >
          {ticket.minutes} min
        </span>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-shoyu/80">
        {ticket.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {ticket.source === 'rappi' && (
        <span className="mt-3 inline-block rounded-full bg-station-rappi/10 px-2 py-0.5 text-xs font-semibold text-station-rappi">
          Rappi
        </span>
      )}

      {/* TODO: "Tomar pedido" -> POST /orders/{id}/advance (claim) */}
      {/* TODO: "Marcar listo" -> POST /orders/{id}/advance (complete) */}
      <button
        onClick={() => (taken ? setDone(true) : setTaken(true))}
        className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
          taken ? 'bg-nori hover:bg-nori/90' : 'bg-salmon hover:bg-salmonDark'
        }`}
      >
        {taken ? 'Marcar listo' : 'Tomar pedido'}
      </button>
    </div>
  )
}

export default function Pendientes() {
  const { user } = useAuth()
  const stations = ROLE_STATIONS[user?.role] || []

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stations.map((key) => {
        const station = STATIONS[key]
        const tickets = MOCK_TICKETS[key] || []
        return (
          <section key={key} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${station.dot}`} />
              <h2 className="font-display text-lg font-bold text-shoyu">{station.label}</h2>
              <span className="text-sm text-shoyu/40">({tickets.length})</span>
            </div>

            {tickets.length === 0 ? (
              <p className="rounded-xl border border-dashed border-shoyu/15 p-6 text-center text-sm text-shoyu/40">
                Sin pedidos en esta cola.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {tickets.map((t) => (
                  <Ticket key={t.id} ticket={t} />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
