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
COPY db.js .
COPY passport.js .
COPY setupdb.js .

EXPOSE 3000

CMD npm start
