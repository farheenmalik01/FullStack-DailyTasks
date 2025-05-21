FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps  # Remove --build-from-source

COPY . .
EXPOSE 50000
CMD ["npm", "start"]
