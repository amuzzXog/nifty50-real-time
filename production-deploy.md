# Production Deployment Guide

## Local Production Server

```bash
# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn wsgi:app --bind 0.0.0.0:5000 --workers 4

# Or with specific configuration
gunicorn wsgi:app --bind 0.0.0.0:5000 --workers 4 --timeout 120 --access-logfile -
```

## Heroku Deployment

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Deploy
git add .
git commit -m "Production ready"
git push heroku main
```

## VPS/Server Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn (production)
gunicorn wsgi:app --bind 0.0.0.0:5000 --workers 4 --daemon

# With systemd service
sudo systemctl start nifty-dashboard
sudo systemctl enable nifty-dashboard
```

## Docker Deployment

```bash
# Build image
docker build -t nifty-dashboard .

# Run container
docker run -p 5000:5000 nifty-dashboard
```

## Files Created:
- wsgi.py - WSGI entry point
- Procfile - Heroku configuration
- Updated requirements.txt with Gunicorn