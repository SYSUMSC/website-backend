FROM node:lts
COPY . /app
WORKDIR /app
RUN npm install && \
    npm run build
COPY ./.env ./dist
WORKDIR /app/dist
EXPOSE 3000
ENTRYPOINT ["node", "main.js"]
