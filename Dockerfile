# Use official Node.js 16 image
FROM docker.arvancloud.ir/node:16

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose application port (adjust based on your app)
EXPOSE 3000

# Run the application using npm start
CMD ["npm", "start"]
