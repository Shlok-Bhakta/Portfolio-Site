FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with correct Alpine packages
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    && npm ci --only=production \
    && apk del .build-deps

# Copy the built application
COPY dist/ ./dist/

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
