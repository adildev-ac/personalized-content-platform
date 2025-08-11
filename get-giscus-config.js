#!/usr/bin/env node

// Script to help get Giscus configuration values
// This script provides guidance on how to get the required IDs

console.log('=== Giscus Configuration Helper ===\n');

console.log('Repository: adildev-ac/personalized-content-platform\n');

console.log('To get the correct configuration values:\n');

console.log('Method 1: Use Giscus Website (Recommended)');
console.log('1. Visit https://giscus.app');
console.log('2. Enter repository: adildev-ac/personalized-content-platform');
console.log('3. Select mapping: pathname (recommended)');
console.log('4. Select discussion category (usually "General")');
console.log('5. Copy the generated configuration values\n');

console.log('Method 2: Use GitHub API/GraphQL');
console.log('1. Get Repository ID:');
console.log('   curl -H "Authorization: token YOUR_GITHUB_TOKEN" \\');
console.log('        -X POST \\');
console.log('        -d \'{"query":"query { repository(owner: \\"adildev-ac\\", name: \\"personalized-content-platform\\") { id } }"}\' \\');
console.log('        https://api.github.com/graphql\n');

console.log('2. Get Discussion Categories:');
console.log('   curl -H "Authorization: token YOUR_GITHUB_TOKEN" \\');
console.log('        -X POST \\');
console.log('        -d \'{"query":"query { repository(owner: \\"adildev-ac\\", name: \\"personalized-content-platform\\") { discussionCategories(first: 10) { nodes { id name } } } }"}\' \\');
console.log('        https://api.github.com/graphql\n');

console.log('Current .env.local file should contain:');
console.log('NEXT_PUBLIC_GISCUS_REPO=adildev-ac/personalized-content-platform');
console.log('NEXT_PUBLIC_GISCUS_REPO_ID=<repo_id_from_graphql>');
console.log('NEXT_PUBLIC_GISCUS_CATEGORY=General');
console.log('NEXT_PUBLIC_GISCUS_CATEGORY_ID=<category_id_from_graphql>\n');

console.log('Prerequisites checklist:');
console.log('✓ Repository is public: adildev-ac/personalized-content-platform');
console.log('✓ Discussions are enabled (mentioned by user)');
console.log('✓ Giscus app needs to be installed on the repository');
console.log('  Install at: https://github.com/apps/giscus\n');

console.log('Once configured, the comments will appear on article pages and the test page.');