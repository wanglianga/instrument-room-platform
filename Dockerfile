FROM node:18-alpine

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
