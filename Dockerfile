FROM node:lts

ENV TZ=Europe/Berlin

USER node

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
EXPOSE 3000

CMD [ "node", "index.js" ]
