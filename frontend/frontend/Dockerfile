FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:ssr

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package*.json ./

RUN npm install --only=production

CMD ["node", "dist/server/server.mjs"]
