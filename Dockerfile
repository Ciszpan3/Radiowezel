# FROM node:18

# WORKDIR /app

# RUN mkdir /ssl

# COPY ./fullchain.pem /app/ssl/fullchain.pem
# COPY ./privkey.pem /app/ssl/privkey.pem

# ENV HTTPS=true
# ENV SSL_CRT_FILE=/app/ssl/fullchain.pem
# ENV SSL_KEY_FILE=/app/ssl/privkey.pem

# COPY package.json .

# COPY . .

# RUN npm install

# EXPOSE 80

# CMD ["npm", "start"]

# Etap budowania aplikacji

# FROM node:18 as build

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci
# COPY . ./
# RUN HTTPS=true npm run build

# # Etap uruchamiania aplikacji
# FROM nginx:stable-alpine

# # Skopiowanie certyfikatów SSL
# COPY ./fullchain.pem /etc/nginx/fullchain.pem
# COPY ./privkey.pem /etc/nginx/privkey.pem

# # Kopiowanie plików zbudowanej aplikacji React
# COPY --from=build /app/build /usr/share/nginx/html

# # Kopiowanie konfiguracji Nginx
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # Eksponowanie portów
# EXPOSE 80

# # Uruchomienie Nginx
# CMD ["nginx", "-g", "daemon off;"]



#nowy nginx

# Use the official Node.js runtime as the base image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# # Skopiowanie certyfikatów SSL
# COPY ./fullchain.pem /etc/nginx/fullchain.pem
# COPY ./privkey.pem /etc/nginx/privkey.pem

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/build /usr/share/nginx/html

# ENV SERVER_IP=address

# RUN rm /etc/nginx/conf.d/default.conf
# COPY ./nginx.conf /etc/nginx/conf.d

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
# CMD ["npm", "start"]
