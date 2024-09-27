# Frontend
FROM node:16 AS frontend_builder
WORKDIR /app
COPY frontend/ .
RUN npm i -g pnpm@latest-6 && \
    pnpm install && pnpm run build

# Backend
FROM node:16
WORKDIR /app

RUN apt update && \
    apt install -y gcc g++ build-essential default-jdk python3

COPY backend/package.json .
COPY backend/pnpm-lock.yaml .
RUN npm i -g pnpm@latest-6 && \
    pnpm install -P

COPY backend/ .
COPY manage.js .
COPY --from=frontend_builder /app/dist /app/public

COPY resolver/ services/Judger
RUN cd services && make -C Judger

EXPOSE 3000
RUN node manage.js

CMD ["npx", "pm2", "start", "pm2.config.json", "--no-daemon"]
