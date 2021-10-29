FROM node:14-alpine

ARG BASE_URL_API

WORKDIR /usr/src/nuxt-app

COPY . /usr/src/nuxt-app/

RUN yarn

RUN yarn build

EXPOSE 3000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# set app port
ENV NUXT_PORT=3000

# set env
ENV BASE_URL_API=${BASE_URL_API}

# start the app
CMD [ "yarn", "start" ]
