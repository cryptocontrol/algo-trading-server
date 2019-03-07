FROM node:9

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .

# Copy sensitive files
# COPY .env .
# COPY firebase.json .

# Final configuration and then run!
EXPOSE 6999
CMD [ "npm", "start" ]
