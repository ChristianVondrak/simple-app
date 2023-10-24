# Etapa de Dependencias
FROM node:18-alpine as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Etapa de Construcción
FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npm install -g @nestjs/cli
RUN nest build

# Etapa de Producción
FROM node:18-alpine as runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g @nestjs/cli

COPY --from=builder /app/dist ./dist

# Comando para iniciar la aplicación
CMD ["nodemon","index.js"]