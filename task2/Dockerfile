FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps  # Remove --build-from-source

COPY . .
EXPOSE 50000
CMD ["npm", "start"]