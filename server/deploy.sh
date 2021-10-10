#!/bin/bash

echo What should the version be?
read VERSION 

docker build -t recrebot/reddit-api:$VERSION .
docker push recrebot/reddit-api:$VERSION
ssh root@165.232.148.239 "docker pull recrebot/reddit-api:$VERSION && docker tag recrebot/reddit-api:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"