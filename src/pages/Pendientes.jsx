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

export default function Pendientes() {
  const { user } = useAuth()
  const stations = ROLE_STATIONS[user?.role] || []
  // TODO: GET /orders?status=...

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stations.map((key) => {
        const station = STATIONS[key]
        return (
          <section key={key} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${station.dot}`} />
              <h2 className="font-display text-lg font-bold text-shoyu">{station.label}</h2>
              <span className="text-sm text-shoyu/40">(0)</span>
            </div>
            <p className="rounded-xl border border-dashed border-shoyu/15 p-6 text-center text-sm text-shoyu/40">
              Sin pedidos en esta cola.
            </p>
          </section>
        )
      })}
    </div>
  )
}
