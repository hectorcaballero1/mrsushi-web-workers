# Mr Sushi — Web Trabajadores

Panel interno para cocina, despacho, delivery y administración de cada sede.
React + Vite + Tailwind. Login funcional contra el backend; el resto de las
páginas tienen el layout y diseño listos, con datos mock y comentarios `TODO`
marcando dónde conectar cada endpoint.

## Setup

```bash
pnpm install
cp .env.example .env   # completar VITE_API_URL con la URL real del API Gateway
pnpm dev
```

## Estructura

```
src/
├── api/client.js        # wrapper fetch + manejo de JWT (localStorage)
├── context/AuthContext  # login/logout, sesión persistida
├── components/
│   ├── AppLayout         # Sidebar + TopBar + <Outlet/>
│   ├── Sidebar            # nav (Pendientes, Dashboard, Staff si admin)
│   ├── TopBar             # sede, usuario, rol, logout
│   └── ProtectedRoute     # requiere sesión, opcionalmente filtra por rol
├── pages/
│   ├── Login              # FUNCIONAL — POST /auth/login
│   ├── Pendientes         # colas por estación (mock) — ver TODOs
│   ├── Dashboard          # resumen por estado (mock) — GET /dashboard
│   └── Staff               # admin: lista + crear staff (mock) — /admin/staff
└── lib/sedes.js           # nombres de sede y labels de rol
```

## Qué falta conectar (para quien continúe)

- **Pendientes** (`src/pages/Pendientes.jsx`): `MOCK_TICKETS` → `GET /orders?status=...`
  según la estación. Los botones "Tomar pedido"/"Marcar listo" hoy solo cambian
  estado local — van a `POST /orders/{id}/advance` (claim y complete).
- **Dashboard** (`src/pages/Dashboard.jsx`): `MOCK_SUMMARY`/`MOCK_RECENT` → `GET /dashboard`.
- **Staff** (`src/pages/Staff.jsx`, solo admin): `MOCK_STAFF` → `GET /admin/staff`;
  el formulario → `POST /admin/staff`.

## Roles y rutas

- Todos los roles ven **Pendientes** (columnas según su rol: cocinero ve cocina
  fría/caliente, despachador empacar, delivery repartir/entregar a Rappi) y
  **Dashboard**.
- Solo `admin` ve **Staff de la sede** (`/staff`).
- `ProtectedRoute` redirige a `/login` sin sesión, y a `/dashboard` si el rol no
  alcanza para una ruta.

## Diseño

Paleta inspirada en ingredientes de sushi (salmón, nori, wasabi, shoyu) sobre un
fondo cálido. Tipografía: Space Grotesk (títulos/números), Inter (texto), JetBrains
Mono (códigos de pedido). Las tarjetas de "Pendientes" están pensadas como tickets
de cocina: número de pedido en mono, badge de tiempo de espera que cambia de color
según la urgencia (verde → naranja → rojo).
