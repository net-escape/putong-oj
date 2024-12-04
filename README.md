# Putong OJ

Just a Putong Online Judge...

## Development

Running MongoDB, Redis and the Judger part in Docker:

```bash
# at /
docker compose --profile dev up
```

Start the backend development server:

```bash
# at /backend
pnpm run dev
```

Start the frontend development server:

```bash
# at /frontend
pnpm run dev
```

## Production

Build the Docker image:

```bash
# at /
docker compose --profile prod build
```

Running the production server:

```bash
# at /
docker compose --profile prod up
```
