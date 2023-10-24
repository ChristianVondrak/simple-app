# Etapa de dependencias
FROM node:18-alpine as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Etapa de construcción
FROM deps as builder
WORKDIR /app
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --production

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]