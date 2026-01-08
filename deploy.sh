#!/bin/bash

# Brandspark Deployment Script for stencilwash.com
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying Brandspark to brandspark.stencilwash.com"

# Configuration
DOMAIN="brandspark.stencilwash.com"
APP_DIR="/opt/brandspark"
NGINX_CONF="/etc/nginx/sites-available/brandspark"

# Create app directory
echo "📁 Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone or pull latest code
echo "📥 Getting latest code..."
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull origin master
else
    git clone https://github.com/EricGrill/domainbuilder.git $APP_DIR
    cd $APP_DIR
fi

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build --no-cache

# Stop existing containers
echo "⏹️ Stopping existing containers..."
docker-compose down || true

# Start containers
echo "▶️ Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
    docker-compose logs frontend
fi

if curl -s http://localhost:8001/options > /dev/null; then
    echo "✅ API is running"
else
    echo "❌ API failed to start"
    docker-compose logs api
fi

# Setup nginx
echo "🔧 Configuring nginx..."
sudo cp nginx/brandspark.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/brandspark

# Test nginx configuration
sudo nginx -t

# Get SSL certificate if not exists
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "🔐 Obtaining SSL certificate..."
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@stencilwash.com
else
    echo "🔐 SSL certificate already exists"
fi

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

echo ""
echo "✨ Deployment complete!"
echo "🌐 Visit: https://$DOMAIN"
echo ""
echo "📋 Useful commands:"
echo "   docker-compose logs -f     # View logs"
echo "   docker-compose restart     # Restart services"
echo "   docker-compose down        # Stop services"
