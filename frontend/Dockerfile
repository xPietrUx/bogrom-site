FROM node:lts-alpine3.22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:lts-alpine3.22
WORKDIR /app
ENV PORT=5137 
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 5137
CMD ["node", "build/index.js"]