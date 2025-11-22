# SWAPI REBORN

A responsive, interactive React application that allows users to explore the Star Wars universe via the SWAPI. Built with a focus on clean architecture, type safety, and robust error handling.

**Live Demo:** [[Netlify](https://starwars-semih.netlify.app/)]

## 🛠 Tech Stack & Tools

- **Core:** React 18, TypeScript, Vite
- **State Management:** Zustand (Global), React Hooks (Local)
- **Styling:** Tailwind CSS
- **Data Fetching:** Axios + Custom Hooks (with AbortController)
- **Testing:** Vitest, React Testing Library

## 🏗 Architectural Decisions

### 1. Hybrid State Management
I chose a hybrid approach to state management to keep the application lightweight but scalable:
- **Zustand:** Used for truly global concerns that need to persist across routes (e.g., `usePaginationStore` for preserving page state per resource, `useModalStore` for UI overlays).
- **Local State:** Used for ephemeral UI data (e.g., loading spinners, form inputs) to avoid unnecessary global complexity.

### 2. Custom Data Fetching Hook (`useResource`)
Instead of reaching for a heavy library like TanStack Query immediately, I implemented a custom `useResource` hook to demonstrate understanding of asynchronous patterns.
- **Race Condition Handling:** Implements `AbortController` to cancel stale requests when navigating rapidly between pages.
- **Caching:** Features a simple in-memory `Map` cache to prevent redundant network requests for recently visited pages.
- **Error Handling:** Graceful fallbacks for network errors and empty states.

### 3. Component Composition
The UI is built using small, single-purpose components (e.g., `Thumbnail`, `swapi.ts` API layer). The `DetailView` uses `Promise.all` to fetch related resources (Films, Homeworld) in parallel, preventing "waterfall" loading states.

## ⚖️ Trade-offs & Known Limitations

In a production environment, I would address the following trade-offs made for this technical assessment:

1.  **Caching Strategy:** The current in-memory cache is simple but lacks invalidation logic (TTL) or persistence. For a larger app, I would migrate to **TanStack Query** to handle stale-while-revalidate, window focus refetching, and rigorous cache invalidation.
2.  **Global Search:** The Global Search feature performs a recursive fetch of all pages (`fetchAllPages`). While effective for this specific API (which lacks deep search), this is resource-intensive. In production, this should be offloaded to a backend search index (e.g., Elasticsearch).
3.  **Image Assets:** SWAPI does not provide images. I am using a third-party provider with fallback logic. In a real product, these assets would be hosted on a dedicated CDN.

## 🚀 Quick Start

### 1. Install dependencies
```
npm install
```
### 2. Run development server
```
npm run dev
```
### 2. Run tests
```
npm run test
```
## 📂 Project Structure
```
src/
├── api/            # Centralized Axios instances & endpoints
├── components/     #
│   ├── cards/      # Domain-specific cards (Person, Planet, etc.)
│   ├── ui/         # Reusable UI primitives (Modal, Pagination, Loading)
│   └── layout/     # Global layout wrappers
├── features/       # Feature-specific logic (Search, Lists)
├── hooks/          # Custom hooks (useResource, usePeople)
├── store/          # Zustand stores
├── types/          # TypeScript definitions
└── utils/          # Helpers (Image mapping, formatting)
```
## ✅ Key Features

- **Type Safety:** Full TypeScript coverage for API responses and Props.

- **Accessibility:** Modals manage focus and support `Escape` key closure.

- **Performance:** Lazy-loaded modals and parallel data fetching.

- **Robustness:** Handles API errors and "race conditions" during rapid navigation.

## License

MIT