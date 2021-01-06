FROM node:15.5.0-alpine
WORKDIR /usr/src/app

COPY "package-docker.json" "package.json"
RUN npm install --quiet && mv node_modules ../ && ln -sf ../node_modules node_modules && npm cache clean --force
COPY . .
EXPOSE 3080
CMD ["npm", "start"]
