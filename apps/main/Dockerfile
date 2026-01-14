# Check out https://hub.docker.com/_/node to select a new base image
FROM node:20.11-alpine
ARG port
ARG service
ENV SERVICE=$service
ENV PORT=$port
# Set to a non-root built-in user `node`

USER node
WORKDIR /app

# Копируем всё
COPY . .

RUN npm ci
RUN npm run build:main

# Находим точный путь к main.js
RUN find /app -name "main.js" -type f | grep -v node_modules

WORKDIR /app/dist/apps/main
CMD ["node", "main.js"]