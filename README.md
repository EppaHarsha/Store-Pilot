# Store Pilot (Full-stack)

## Structure

- `client/`: React + Vite + Tailwind frontend
- `server/`: Node.js (Express) backend

## Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

## Install

From the repo root:

```bash
npm install
```

## Development

Runs both backend and frontend:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`
- Health check: `http://localhost:3001/health`

## Build

```bash
npm run build
```

## Production start (server)

```bash
npm run start
```

## Environment variables

### `server/`

- `PORT` (default `3001`)
- `CLIENT_ORIGIN` (default `http://localhost:5173`)

