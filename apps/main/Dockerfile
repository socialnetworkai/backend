# Check out https://hub.docker.com/_/node to select a new base image
FROM node:20.11-alpine

ARG port
ARG service
ENV SERVICE=$service
ENV PORT=$port

USER node

# Создаем директорию приложения
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Копируем файлы зависимостей
COPY --chown=node package*.json ./
COPY --chown=node nest-cli.json ./
COPY --chown=node tsconfig*.json ./

# Копируем исходный код
COPY --chown=node apps/ ./apps/
COPY --chown=node libs/ ./libs/

RUN npm ci

# Собираем приложение
RUN npm run build:${SERVICE}

# Проверяем, что сборка прошла успешно (опционально)
RUN ls -la /home/node/app/dist/apps/${SERVICE}/

# Запускаем приложение из директории сборки
WORKDIR /home/node/app/dist/apps/${SERVICE}

EXPOSE ${PORT}

CMD ["node", "main.js"]
