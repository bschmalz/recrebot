FROM node:14

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.production .env

RUN yarn build
ADD ./src/scraper/data ./dist/src/scraper/data
ADD ./src/utils/templates ./dist/src/utils/templates

RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium
RUN chown -R node:node /usr/src/app
ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/src/index.js" ]
USER node
