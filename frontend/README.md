# OpportunityOS Frontend

React + Vite frontend for the OpportunityOS Spring Boot API.

## Run locally

Start the backend from the repository root:

```bash
./mvnw spring-boot:run
```

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

The frontend uses `http://localhost:8080` as its API base URL. To point it at
another API without editing source code, create a local `frontend/.env` file:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

The backend must allow CORS requests from the Vite development origin.

## Production build

```bash
npm run build
npm run preview
```

The optimized files are written to `frontend/dist/`.

## Authentication

This learning project stores the signed-in username and password in
`sessionStorage` and sends them as an HTTP Basic Auth header to protected API
routes. Logging out or closing the browser tab clears the session credentials.
