#!/bin/bash

#
# Runs the fundamentus container
#

CONTAINER_NAME=fundamentus

# Defaults. Values from .env file can overwrite those
DOCKER_USER=pr3st00
SERVER_PORT=8082

if [[ -f .env ]]; then
        echo "Loading variables from .env file"
        . ./.env
fi

docker run --restart always -d -p ${SERVER_PORT}:${SERVER_PORT} \
  --name $CONTAINER_NAME ${DOCKER_USER}/${CONTAINER_NAME}

# EOF
