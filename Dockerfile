FROM node:18-alpine as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install


FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN nest build


FROM node:18-alpine as runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g nodemon
RUN npm run start
COPY --from=builder /app/dist ./dist

CMD ["nodemon", "index.js"]