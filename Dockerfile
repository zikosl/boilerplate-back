FROM node:20.11.0-bullseye

# Create app directory

RUN useradd -ms /bin/bash maper
USER maper

WORKDIR /app


COPY package*.json ./


RUN sudo apt-get update \
    && sudo apt-get install -y wget gnupg \
    && sudo wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - \
    && sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && sudo apt-get update \
    && sudo apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && sudo rm -rf /var/lib/apt/lists/*

RUN corepack enable

RUN pnpm install

RUN npx puppeteer browsers install chrome  

COPY package*.json ./prisma/

COPY . . 
RUN npx prisma generate


CMD [ "pnpm", "run", "dev" ]
