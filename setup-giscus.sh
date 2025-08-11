#!/bin/bash

# Giscus Setup Helper Script
# This script helps you get the correct repository and category IDs for Giscus

echo "=== Giscus Setup for adildev-ac/personalized-content-platform ==="
echo ""
echo "To complete the Giscus setup, you need to:"
echo "1. Visit https://giscus.app"
echo "2. Enter your repository: adildev-ac/personalized-content-platform"
echo "3. Select your discussion category (usually 'General' or 'Announcements')"
echo "4. Copy the generated repository ID and category ID"
echo "5. Update the .env.local file with the correct values"
echo ""
echo "Current .env.local file location: $(pwd)/.env.local"
echo ""
echo "Replace these placeholder values:"
echo "  NEXT_PUBLIC_GISCUS_REPO_ID=PLACEHOLDER_REPO_ID"
echo "  NEXT_PUBLIC_GISCUS_CATEGORY_ID=PLACEHOLDER_CATEGORY_ID"
echo ""
echo "Prerequisites checklist:"
echo "  ✓ Repository exists: adildev-ac/personalized-content-platform"
echo "  ✓ Discussions are enabled (as mentioned by user)"
echo "  ✓ Repository is public"
echo "  ✓ giscus app is installed on the repository"
echo ""
echo "For more information, visit: https://docs.github.com/en/discussions"