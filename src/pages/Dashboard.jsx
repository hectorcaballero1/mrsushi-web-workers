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

export default function Dashboard() {
  // TODO: GET /dashboard
  const summary = null
  const recent = []

  return (
    <div className="flex flex-col gap-8">
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
            <p className="p-8 text-center text-sm text-shoyu/40">Sin datos aún.</p>
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
                {recent.map((o) => (
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
          )}
        </div>
      </section>
    </div>
  )
}
