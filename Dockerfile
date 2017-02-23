# docker build -t jm-pomelo:alpine .
FROM node:4-alpine
MAINTAINER Jeff YU, 2651339@qq.com

RUN apk add --no-cache \
        sysstat \
        util-linux \
    && apk add --no-cache --virtual .build-deps \
        binutils-gold \
        curl \
        g++ \
        gcc \
        gnupg \
        libgcc \
        linux-headers \
        make \
        python \
        tar \
    && npm install -g npm \
    && npm install -g pomelo \
    && apk del .build-deps \
    && rm -rf /tmp/* /root/.npm

WORKDIR /app
CMD pomelo start -e production
