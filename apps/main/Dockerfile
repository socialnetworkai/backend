# Check out https://hub.docker.com/_/node to select a new base image
FROM node:20.11-alpine

ARG port
ARG service
ENV SERVICE=$service
ENV PORT=$port

# Set to a non-root built-in user `node`
USER node

# Create app directory
RUN mkdir -p /home/node/app

# Устанавливаем рабочую директорию как корень проекта
WORKDIR /home/node/app

# Install app dependencies
# Копируем package.json в корень проекта
COPY --chown=node package*.json ./
COPY --chown=node nest-cli.json ./
COPY --chown=node tsconfig*.json ./

# Копируем структуру проекта
COPY --chown=node apps/ ./apps/
COPY --chown=node libs/ ./libs/

RUN npm ci

# Выполняем сборку из корня проекта
RUN npm run build:${SERVICE}

# Создаем папку для production и копируем только необходимые файлы
RUN mkdir -p /home/node/dist/production
RUN cp -r dist/apps/${SERVICE} /home/node/dist/production/

# Устанавливаем рабочую директорию для запуска
WORKDIR /home/node/dist/production/${SERVICE}

# Bind to all network interfaces so that it can be mapped to the host OS
EXPOSE ${PORT}

# Запускаем приложение
CMD node main