# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker's caching
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS production

WORKDIR /app

# Copy built files and necessary dependencies from the build stage
COPY --from=build /app ./

# Set permissions if needed
RUN ["chmod", "+x", "./entrypoint.sh"]

# Expose the port
EXPOSE 5009

# Specify the entrypoint
ENTRYPOINT ["sh", "./entrypoint.sh"]
