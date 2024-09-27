# Judger
FROM node:16
WORKDIR /app

RUN apt update && \
    apt install -y gcc g++ build-essential default-jdk python3

COPY backend/package.json .
COPY backend/pnpm-lock.yaml .
RUN npm i -g pnpm@latest-6 && \
    pnpm install -P

COPY backend/ .
COPY resolver/ services/Judger
RUN cd services && make -C Judger

COPY manage.js .
RUN ROLE=judger node manage.js

CMD ["npx", "pm2", "start", "pm2.config.json", "--no-daemon"]
