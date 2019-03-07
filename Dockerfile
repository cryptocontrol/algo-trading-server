FROM node:9

ENV NODE_ENV production

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .

# Copy sensitive files
# COPY .env .

# Final configuration and then run!
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
