#!/bin/bash

# 🚀 VYBE Domain Setup Script for vybebd.store
# This script will help you deploy and configure your custom domain

echo "🌐 VYBE Domain Setup for vybebd.store"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build the frontend
echo -e "${BLUE}Step 1: Building frontend...${NC}"
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Deploying to Vercel...${NC}"
echo ""
echo "Please follow these steps when prompted:"
echo "1. Set up and deploy? → Y"
echo "2. Which scope? → Select your account"
echo "3. Link to existing project? → N"
echo "4. Project name? → vybe (or your choice)"
echo "5. Directory? → Press Enter"
echo "6. Override settings? → N"
echo ""

read -p "Press Enter to continue with Vercel deployment..."

vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 NEXT STEPS - DNS CONFIGURATION${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to Spaceship (https://www.spaceship.com/)"
echo "2. Navigate to: Domain → vybebd.store → DNS Settings"
echo ""
echo -e "${BLUE}Add these DNS records:${NC}"
echo ""
echo "RECORD 1 (Frontend - Main Domain):"
echo "  Type: A"
echo "  Name: @"
echo "  Value: 76.76.21.21"
echo "  TTL: 3600"
echo ""
echo "RECORD 2 (Frontend - WWW):"
echo "  Type: CNAME"
echo "  Name: www"
echo "  Value: cname.vercel-dns.com"
echo "  TTL: 3600"
echo ""
echo "RECORD 3 (Backend API):"
echo "  Type: CNAME"
echo "  Name: api"
echo "  Value: vybe-backend-93eu.onrender.com"
echo "  TTL: 3600"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}3. After adding DNS records:${NC}"
echo "   - Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "   - Select your 'vybe' project"
echo "   - Go to Settings → Domains"
echo "   - Click 'Add' and enter: vybebd.store"
echo "   - Also add: www.vybebd.store"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}4. Update Backend (Render):${NC}"
echo "   - Go to: https://dashboard.render.com"
echo "   - Select: vybe-backend-93eu"
echo "   - Settings → Custom Domain"
echo "   - Add: api.vybebd.store"
echo "   - Environment → Add/Update:"
echo "     CLIENT_URL=https://vybebd.store"
echo "     CORS_ORIGIN=https://vybebd.store"
echo "   - Click 'Save Changes'"
echo "   - Click 'Manual Deploy' → 'Deploy latest commit'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}⏱️  DNS Propagation:${NC}"
echo "   DNS changes take 5-60 minutes to propagate globally."
echo "   Check status: https://dnschecker.org/#A/vybebd.store"
echo ""
echo -e "${GREEN}🎉 Your site will be live at:${NC}"
echo "   Frontend: https://vybebd.store"
echo "   API: https://api.vybebd.store/api"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}Need help? Check DOMAIN_SETUP_GUIDE.md${NC}"
echo ""
