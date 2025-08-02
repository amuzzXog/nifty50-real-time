# Netlify Deployment Instructions

## Option 1: Static Deployment (Recommended)

1. **Prepare files:**
```bash
# Keep only these files for static deployment:
- index.html
- app.js (modified for mock data)
- netlify.toml
- package.json
```

2. **Deploy via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

3. **Deploy via Netlify Dashboard:**
- Drag and drop the folder to netlify.com
- Or connect GitHub repository

## Option 2: Full-Stack with Netlify Functions

1. **Create functions folder:**
```bash
mkdir .netlify/functions
```

2. **Convert server.py to JavaScript function**

3. **Deploy:**
```bash
netlify deploy --prod
```

## Quick Commands:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir .

# Or deploy for preview
netlify deploy --dir .
```

## Files needed for deployment:
- index.html
- app.js
- netlify.toml
- package.json