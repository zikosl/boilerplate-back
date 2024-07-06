FROM node:20.11.0-bullseye

# Create app directory
WORKDIR /app



COPY package*.json ./

RUN corepack enable

RUN pnpm install


COPY package*.json ./prisma/

COPY . . 
RUN npx prisma generate


CMD [ "pnpm", "run", "dev" ]
