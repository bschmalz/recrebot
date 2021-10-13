# Recrebot

A trip building tool that automates the process of checking trip availability for you and notifying you in real time if any openings appear for requested trips.

Currently supported trip types are:

- Recreation.gov Campgrounds
- Reserve California Campgrounds
- Recreation.gov Trail Permits

* Mt. Whitney
* Inyo National Forest
* Sierra National Forest
* Humboldt-Toiyabe National Forest
* SeKi National Park

## Technology Breakdown

Frontend:

- NextJS
- Chakra UI
- GraphQl/Apollo
- Typescript
- Type GraphQl
- Mapbox
- NextPWA

Backend:

- Express JS
- Typeorm / Postgres
- Graphql / Apollo Server
- Redis
- Puppeteer
- Gmail
- Twillio SMS

Deployment

- Docker
- Dokku
- Vercel

Testing

- Cypress

### Dependencies

- Recent version of node, yarn.

### Installing

- In both the server and web folder, run yarn install;

### Executing program

Frontend

- Run 'yarn dev'

Backend

In one prompt run 'yarn watch'
in another run 'yarn dev'

Testing

Frontend: run 'cypress run'

## Deployment

BE (from server dir):
./deploy.sh

or...
docker build -t [username]/[appname]:[version] .
docker push [username]/[appname]:[version]

ssh root@000.1111.2222.3333
docker pull [username]/[appname]:[version]
docker tag [username]/[appname]:[version] dokku/[appname]:latest
dokku tags:deploy [appname] latest

FE (from web dir):
vercel --prod

## Useful Commands

- When developing on the FE, run 'yarn gen' to generate new React hooks based on graphql changes.

- Migrations, npx typeorm migration:generate -n [migName]

## Authors

Brian Schmalz
