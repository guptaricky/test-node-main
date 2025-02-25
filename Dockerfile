# Use official Node.js 22 image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
