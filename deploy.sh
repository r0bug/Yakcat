#!/bin/bash

# YakCat Deployment Script for webcat.yakimafinds.com

echo "🚀 Deploying YakCat to webcat.yakimafinds.com..."

# Build the project
echo "📦 Building production..."
npm run build

# Deploy to Vercel
echo "☁️  Deploying to Vercel..."
npx vercel --prod --yes

# Get the deployment URL
DEPLOYMENT_URL=$(npx vercel ls --json | jq -r '.deployments[0].url' 2>/dev/null)

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "❌ Could not get deployment URL. Please check Vercel dashboard."
    exit 1
fi

echo "✅ Deployed to: https://$DEPLOYMENT_URL"

# Set custom domain
echo "🔗 Updating webcat.yakimafinds.com..."
npx vercel alias set $DEPLOYMENT_URL webcat.yakimafinds.com

echo "✨ Deployment complete!"
echo "🌐 Site is live at: https://webcat.yakimafinds.com"