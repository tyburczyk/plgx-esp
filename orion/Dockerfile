FROM node:latest

WORKDIR /usr/src/app

EXPOSE 4000
ENV NEXUS_HOST=0.0.0.0

COPY . .

COPY package.json .
COPY package-lock.json .

RUN npm config set loglevel warn && \
  npm --production=false install

RUN npm run build

CMD [ "npm", "start" ]
