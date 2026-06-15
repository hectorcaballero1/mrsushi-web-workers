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

// TODO: reemplazar por GET /dashboard
const MOCK_SUMMARY = {
  recibido: 4,
  cocinando: 3,
  empacando: 2,
  repartiendo: 1,
  entregado: 18,
}

const MOCK_RECENT = [
  { id: 'a1b2', status: 'cocinando', source: 'web', minutes: 3 },
  { id: 'c3d4', status: 'cocinando', source: 'rappi', minutes: 9 },
  { id: 'e5f6', status: 'empacando', source: 'web', minutes: 12 },
  { id: 'g7h8', status: 'repartiendo', source: 'web', minutes: 6 },
  { id: 'i9j0', status: 'entregado', source: 'rappi', minutes: 22 },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Object.entries(MOCK_SUMMARY).map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[key]}`} />
              <p className="text-xs uppercase tracking-wide text-shoyu/50">
                {STATUS_LABELS[key]}
              </p>
            </div>
            <p className="font-display text-3xl font-bold text-shoyu">{value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-shoyu">Pedidos recientes</h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
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
              {MOCK_RECENT.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-shoyu">#{o.id}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[o.status]}`} />
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-shoyu/70">{o.source}</td>
                  <td className="px-4 py-3 text-shoyu/70">{o.minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
