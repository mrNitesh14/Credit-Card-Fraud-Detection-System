FROM node:14

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY . /app

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80

