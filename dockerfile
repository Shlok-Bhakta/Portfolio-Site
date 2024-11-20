FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN apk add --no-cache python3 make g++ \
    && npm ci --only=production \
    && apk del python3 make g++

# Copy the built application
COPY dist/ ./dist/

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
