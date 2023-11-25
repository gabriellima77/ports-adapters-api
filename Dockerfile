FROM node:18.18.0

WORKDIR /home/app/api-test-hub

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

EXPOSE 3000