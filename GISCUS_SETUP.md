# Giscus Comments Setup

This project uses [Giscus](https://giscus.app) for comments on articles. Giscus is a comments system powered by GitHub Discussions.

## Quick Setup

1. **Ensure GitHub Discussions are enabled** for the repository `adildev-ac/personalized-content-platform` ✅
2. **Install the Giscus app** on your repository: https://github.com/apps/giscus
3. **Get configuration values** from https://giscus.app:
   - Enter repository: `adildev-ac/personalized-content-platform`
   - Select mapping: `pathname` (recommended)
   - Select discussion category (usually "General")
   - Copy the generated configuration values

4. **Update environment variables** in `.env.local`:
   ```bash
   NEXT_PUBLIC_GISCUS_REPO=adildev-ac/personalized-content-platform
   NEXT_PUBLIC_GISCUS_REPO_ID=<your_repo_id>
   NEXT_PUBLIC_GISCUS_CATEGORY=General
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=<your_category_id>
   ```

## Testing

- Visit `/test-giscus` to see the comments component in action
- Comments are automatically included on all article detail pages (`/articles/[slug]`)

## Component Features

The `GiscusComments` component:
- ✅ Shows helpful configuration message when not properly configured  
- ✅ Supports dark/light theme switching
- ✅ Uses pathname mapping for unique discussions per page
- ✅ Validates environment variables and detects placeholder values
- ✅ Gracefully handles missing configuration

## Helper Scripts

- Run `node get-giscus-config.js` for detailed setup instructions
- Run `./setup-giscus.sh` for a quick checklist

## Requirements

- Public repository with GitHub Discussions enabled
- Giscus app installed on the repository  
- Proper environment variables configured

Once configured, users can comment on articles using their GitHub accounts, and discussions will be stored in your repository's Discussions section.