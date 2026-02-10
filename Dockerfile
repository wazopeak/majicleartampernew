FROM node:18-alpine AS builder

WORKDIR /app

# install dependencies
COPY package*.json ./
# Alpine needs build tools for some native modules. Install them before npm install.
ENV PYTHON=/usr/bin/python3
ENV npm_config_python=/usr/bin/python3
RUN apk add --no-cache python3 make g++ libc6-compat git \
 && npm install --legacy-peer-deps --prefer-offline --no-audit --loglevel verbose

# copy sources and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# lightweight static server
RUN npm install -g serve@14.1.2 --silent

# copy build output
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# serve listens on 0.0.0.0 inside container; host binding is controlled by docker-compose
CMD ["serve", "-s", "dist", "-l", "5173"]
