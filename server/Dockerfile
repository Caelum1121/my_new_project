# Use Node.js 22 as base image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first (for build cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the backend source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start app with PM2 runtime (best for Docker)
CMD ["pm2-runtime", "index.js"]
