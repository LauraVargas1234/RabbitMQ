FROM node:16-alpine

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY publisher.js .

EXPOSE 3001
CMD ["node", "publisher.js"]