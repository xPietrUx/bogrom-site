FROM node:lts-alpine3.22
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

RUN chown -R node:node /app

USER node

EXPOSE 3000
CMD [ "npm", "run", "start" ]
