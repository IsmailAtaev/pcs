FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx kysely migrate:latest && node build/src/index.js"]
