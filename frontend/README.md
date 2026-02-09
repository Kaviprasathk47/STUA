# STUA Frontend

React + Vite frontend for Sustainable Transport Usage Analyser.

---

## Routing & auth (for the team)

### Overview

- **Auth state** lives only in `AuthContext`; the access token is stored in **sessionStorage** (`accessToken`).
- **Public routes** (login, signup) redirect to `/dashboard` if the user is already logged in.
- **Protected routes** (e.g. dashboard) redirect to `/login` if the user is not logged in.
- **Axios** sends the Bearer token on every request and refreshes it on 401 using the backend refresh endpoint.

### Route table

| Type     | Paths                     | Not logged in      | Logged in           |
|----------|---------------------------|--------------------|---------------------|
| Public   | `/`, `/login`, `/signup`   | Show page          | Redirect → `/dashboard` |
| Protected| `/dashboard` (and under)  | Redirect → `/login`| Show page           |
| Catch-all| Any other path            | Redirect → `/`     | Redirect → `/`      |

### Key files

- **`src/context/AuthContext.jsx`** – `isAuthenticated`, `loading`, `login(token)`, `logout()`. On load, validates token via `GET /auth/me`.
- **`src/router/appRouter.jsx`** – Declares all routes and wraps them with `PublicRoute` or `ProtectedRoute`.
- **`src/router/PublicRoute.jsx`** – Renders `<Outlet />` for public pages; redirects to `/dashboard` when authenticated.
- **`src/router/protectedRoute.jsx`** – Renders `<Outlet />` for protected pages; redirects to `/login` when not authenticated.
- **`src/services/axios.jsx`** – Request interceptor adds `Authorization: Bearer <token>`; response interceptor calls `POST /auth/refresh` on 401 and redirects to `/login` if refresh fails.

### Login flow

1. User submits login form → `POST /login`.
2. Backend returns `data.data.accessToken`.
3. Page calls `login(accessToken)` (stores token, sets `isAuthenticated`).
4. Page navigates to `/dashboard`.

### Logout flow

1. User clicks Logout (e.g. in Navbar) → `logout()` from `useAuth()`.
2. Token is removed from sessionStorage and `isAuthenticated` is set to `false`.
3. `ProtectedRoute` re-renders and redirects to `/login`.

### Adding a new protected route

In `appRouter.jsx`, add a child of the existing `ProtectedRoute` + `AppLayout`:

```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/your-new-path" element={<YourComponent />} />
  </Route>
</Route>
```

### Trips page & Google Maps

The **Trips** page (`/trips`, linked from the sidebar) shows a map where users can set **start** and **destination** and view the route.

- **Env:** Add `VITE_GOOGLE_MAPS_API_KEY=your_key` to `.env`.
- **Google Cloud:** Enable **Maps JavaScript API** and **Places API**; enable **Billing** on the project (free tier available).
- **API key restrictions:** For local dev, under HTTP referrers add `http://localhost:5173` or `http://localhost:5173/*` so you don’t get **RefererNotAllowedMapError**.
- **Libraries:** The app uses the modern **Place Autocomplete** via `PlaceAutocompleteElement` (see [Places migration](https://developers.google.com/maps/documentation/javascript/places-migration-overview)). The Trips page uses the `NewPlaceSearch` component, which relies on `google.maps.places.PlaceAutocompleteElement` and the `gmp-select` event. **Styling:** PlaceAutocompleteElement uses Shadow DOM; use CSS variables or `::part()` on the wrapper (e.g. `.place-autocomplete-wrapper`) if you need to style the inner input.

### Adding a new public route

Add a child under `PublicRoute`:

```jsx
<Route element={<PublicRoute />}>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<SignUp />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/your-public-path" element={<YourComponent />} />
</Route>
```

---

## React + Vite (template)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
