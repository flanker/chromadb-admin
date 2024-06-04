# Chromadb Admin

Admin UI for Chroma embedding database. Built with Next.js

![screely-1696786774071](https://github.com/flanker/chromadb-admin/assets/109811/6d4369d4-d10c-49f7-8342-89849f271dbe)

## Authentication support

<img width="743" alt="image" src="https://github.com/flanker/chromadb-admin/assets/109811/c15cab9a-db80-4e2f-b732-a3bd5ef557da">

## Run locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run with docker

build docker image:

```bash
docker build -t chromaadmin .
```

run docker:

```bash
docker run -p 3000:3000 chromaadmin
```

*NOTE*: use `http://host.docker.internal:8000` for connection string, if you want to connect to a chromadb instance running locally.
