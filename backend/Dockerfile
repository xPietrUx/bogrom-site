FROM node:lts-alpine3.22
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]
