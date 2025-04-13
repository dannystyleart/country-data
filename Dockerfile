FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy sourcefiles
COPY . .

# Linting
RUN npm run lint
RUN npm run type-check

RUN npm run build

# Production image
FROM node:22-alpine AS prodution

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --production --frozen-lockfile

EXPOSE 3000

CMD ["node", "dist/main.js"]
