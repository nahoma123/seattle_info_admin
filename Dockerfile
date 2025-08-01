# Stage 1: Serve the React application with Nginx
FROM nginx:stable-alpine

# Copy the pre-built application from the context
COPY dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
