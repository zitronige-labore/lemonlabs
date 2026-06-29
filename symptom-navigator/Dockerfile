FROM node:26.4-bookworm

WORKDIR /usr/local/symptometer
COPY ./ ./

RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "start"]