#!/bin/bash

# Deployment Preparation Script for Oasis App
# This script checks if your app is ready for deployment

echo "🚀 Oasis Deployment Readiness Check"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check 1: Environment variables
echo "📋 Checking environment variables..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✅ .env.local found${NC}"

    if grep -q "VITE_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_URL is set${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_URL is missing${NC}"
    fi

    if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_ANON_KEY is set${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY is missing${NC}"
    fi
else
    echo -e "${RED}❌ .env.local not found${NC}"
fi

echo ""

# Check 2: .gitignore
echo "📁 Checking .gitignore..."
if [ -f .gitignore ]; then
    if grep -q ".env.local" .gitignore; then
        echo -e "${GREEN}✅ .env.local is in .gitignore (secrets are safe)${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.local should be in .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .gitignore not found${NC}"
fi

echo ""

# Check 3: Dependencies
echo "📦 Checking dependencies..."
if [ -f package.json ]; then
    echo -e "${GREEN}✅ package.json found${NC}"

    if [ -d node_modules ]; then
        echo -e "${GREEN}✅ node_modules exists${NC}"
    else
        echo -e "${YELLOW}⚠️  node_modules not found. Run: npm install${NC}"
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
fi

echo ""

# Check 4: Build directory
echo "🔨 Checking build directory..."
if [ -d dist ]; then
    echo -e "${GREEN}✅ dist directory exists (previous build found)${NC}"
    echo "   Run 'npm run build' to create fresh build"
else
    echo -e "${YELLOW}⚠️  No dist directory. Run: npm run build${NC}"
fi

echo ""

# Check 5: Git repository
echo "📦 Checking Git repository..."
if [ -d .git ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"

    # Check for remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✅ Git remote 'origin' is set${NC}"
        git remote -v | head -2
    else
        echo -e "${YELLOW}⚠️  No Git remote set. You'll need to add one:${NC}"
        echo "   git remote add origin https://github.com/YOUR-USERNAME/oasis-app.git"
    fi
else
    echo -e "${YELLOW}⚠️  Git not initialized. Run: git init${NC}"
fi

echo ""

# Summary
echo "═══════════════════════════════════"
echo "📊 Summary & Next Steps"
echo "═══════════════════════════════════"
echo ""

echo "To deploy to Vercel:"
echo "1. ${GREEN}npm run build${NC} - Test production build"
echo "2. ${GREEN}git add .${NC} - Stage all files"
echo "3. ${GREEN}git commit -m \"Ready for deployment\"${NC} - Commit changes"
echo "4. ${GREEN}git push origin main${NC} - Push to GitHub"
echo "5. Go to ${GREEN}https://vercel.com${NC} and import your repo"
echo ""

echo "Environment variables to set in Vercel:"
echo "- VITE_SUPABASE_URL"
echo "- VITE_SUPABASE_ANON_KEY"
echo ""

echo "📖 See DEPLOYMENT-GUIDE.md for full instructions"
echo ""
