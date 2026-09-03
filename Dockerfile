FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV IS_DOCKER=true

RUN npm run build

EXPOSE 4173

CMD ["npx", "vite", "preview", "--host"]