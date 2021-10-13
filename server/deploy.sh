#!/bin/bash

echo What should the version be?
read VERSION 

docker build -t recrebot/recreserver:$VERSION .
docker push recrebot/recreserver:$VERSION
ssh root@165.232.148.239 "docker pull recrebot/recreserver:$VERSION && docker tag recrebot/recreserver:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"