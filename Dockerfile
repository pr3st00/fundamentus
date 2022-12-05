FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV PORT=8082
EXPOSE 8082

CMD [ "npm", "start" ]
