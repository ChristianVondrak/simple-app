# Etapa de dependencias
FROM node:18-alpine as deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY dummy.js index.js ./
RUN npm install


FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npm run build


FROM node:18-alpine as runner
WORKDIR /app

COPY package.json package-lock.json ./
COPY dummy.js index.js ./
COPY --from=builder /app/dist ./dist
RUN npm install

CMD ["npm", "run", "start"]