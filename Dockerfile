FROM node:0.10.36

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json /usr/src/app/
RUN npm install

ADD . /usr/src/app

CMD "bin/bash"
