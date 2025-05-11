# Use official Node.js LTS image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package manifests & install deps
COPY package*.json ./
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the port our Express server will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
