export const SEDE_NAMES = {
  'mrsushi-lamarina': 'La Marina',
  'mrsushi-espinar': 'Espinar',
}

export function sedeName(tenantId) {
  return SEDE_NAMES[tenantId] || tenantId || 'Sede'
}

export const ROLE_LABELS = {
  admin: 'Administrador',
  cocinero: 'Cocinero',
  despachador: 'Despachador',
  delivery: 'Repartidor',
  customer: 'Cliente',
}
