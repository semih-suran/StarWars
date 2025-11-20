# SWAPI Reborn

A small React + TypeScript project that lists Star Wars resources from the official SWAPI and shows details with safe images (where available). Built with Vite, Tailwind, Zustand, and lightly tested via Vitest + Testing Library.

This README explains how the project is organised, how to work locally, recommended fixes and cleanups, and testing/linting workflows.

---

## Quick start

### 1. install dependencies

`npm install`

### 2. run dev server

`npm run dev`

### 3. open http://localhost:5173

## Features

- React + TypeScript
- Global state management with Zustand
- Async data fetching with SWAPI
- UI cards for People, Planets, Starships, Vehicles, and Species
- Lazy‑loaded DetailView modal
- Accessible keyboard‑close modals (Escape + backdrop)
- Global search with store persistence
- Image rendering via SWAPI companion images
- Tested with React Testing Library + Vitest

## Requirements

- Node 18+
- npm

## Scripts

- `npm run dev` --- start Vite dev server\
- `npm run build` --- production build\
- `npm run preview` --- preview production build\
- `npm run test` --- run tests

## Project Structure

src/
api/
swapi.ts # central API layer for SWAPI requests
components/
cards/ # card components for each resource
PersonCard.tsx
PlanetCard.tsx
StarshipCard.tsx
VehicleCard.tsx
SpeciesCard.tsx
layout/
Layout.tsx
ui/
Thumbnail.tsx
SwapiImage.tsx
ResourceList.tsx
Modal.tsx
DetailView.tsx
Loading.tsx
ErrorState.tsx
Pagination.tsx
hooks/
useResource.ts # reusable paginated fetcher hook
store/
useSearchStore.ts
usePaginationStore.ts
useModalStore.ts
types/
index.ts
utils/
imageProvider.ts
test/
setup.ts # vitest setup for testing-library
main.tsx
App.tsx

## State Management (Zustand)

- `useSearchStore` controls global search\
- `useModalStore` manages modal visibility and resource info

## Testing

Tests use: - React Testing Library - @testing-library/jest-dom - Vitest
test runner

Run:

```
npm run test
```

## Development Notes

- Cards use `SwapiImage` for standardised images\
- Modal uses a portal + Escape handler\
- DetailView loads on demand

## License

MIT