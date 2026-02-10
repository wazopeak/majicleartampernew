FROM node:20-alpine AS base

# Install OS packages required to build native dependencies such as bcrypt.
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Install dependencies separately to leverage Docker layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code.
COPY . .

ENV NODE_ENV=production \
    PORT=2010

EXPOSE 2010

CMD ["node", "index.js"]
