FROM node:16-alpine

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY app.js .
COPY views ./views

EXPOSE 3000
CMD ["node", "app.js"]