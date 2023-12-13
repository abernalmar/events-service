FROM node:19

WORKDIR /app

COPY package.json .
COPY package-lock.json . 

RUN npm install

COPY bin/ ./bin
COPY public ./public
COPY routes/ ./routes
COPY models/ ./models
COPY app.js .

EXPOSE 3000

CMD npm start
