FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
# Copy all the directories inside the directory of Client
COPY . . 

CMD ["npm","run","dev"]
