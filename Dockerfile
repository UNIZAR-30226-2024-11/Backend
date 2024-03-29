FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
# COPY ./dist ./dist
# COPY .env .env

RUN npm install --omit-dev

EXPOSE 8000

USER node

CMD ["npm", "run", "start"]
