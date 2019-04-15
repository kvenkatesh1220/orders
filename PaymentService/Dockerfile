FROM node:latest

# Create app directory
#RUN mkdir -p /usr/src/app/monolith
WORKDIR /app

COPY package.json /app
RUN npm install
#RUN npm install --only=dev

COPY . /app

EXPOSE 8082

CMD ["npm", "start"]