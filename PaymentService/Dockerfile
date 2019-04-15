FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app/monolith
WORKDIR /usr/src/app/monolith

COPY package.json /usr/src/app/monolith/package.json
RUN npm install
#RUN npm install --only=dev

COPY . /usr/src/app/monolith

# EXPOSE 8080