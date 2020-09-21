FROM node:lts
RUN npm install && \
    npm run build
COPY ./dist /app
COPY ./.env /app
WORKDIR /app
EXPOSE 3000
ENTRYPOINT ["node", "main.js"]
