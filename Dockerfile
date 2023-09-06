FROM node:alpine as development

WORKDIR /usr/src/app

COPY tsconfig.json tsconfig.json
COPY package*.json ./

RUN npm install

COPY ./src/cars ./src/cars
COPY libs ./libs

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "./dist/main"]