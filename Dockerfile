FROM node:20.11.0-bullseye

# Create app directory
WORKDIR /app



COPY package*.json ./

RUN corepack enable

RUN pnpm install

RUN npx puppeteer browsers install chrome  

COPY package*.json ./prisma/

COPY . . 
RUN npx prisma generate


CMD [ "pnpm", "run", "dev" ]
