FROM keymetrics/pm2:latest-alpine

WORKDIR /the/workdir/path
# Bundle APP files
COPY app app/
COPY dist dist/
COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 8000

# Show current folder structure in logs
# RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json" ]
