# Build context is the repo ROOT (the server imports ../../src/data).
FROM node:20-slim

WORKDIR /app

# better-sqlite3 may compile from source on some platforms.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server ./server
COPY src/data ./src/data

ENV SCOLRLY_DATA_DIR=/data
VOLUME /data

WORKDIR /app/server
EXPOSE 4000
CMD ["node", "src/index.js"]
