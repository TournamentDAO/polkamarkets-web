FROM node:20.8.1-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./

RUN yarn install

COPY . .

#RUN npx cross-env NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider" BABEL_SHOW_CONFIG_FOR=/app/src/index.tsx yarn build
RUN NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider" yarn build

ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "NODE_OPTIONS=--openssl-legacy-provider yarn start"]