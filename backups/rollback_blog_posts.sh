#!/bin/bash
# Rollback script for blog posts
# Usage: ./rollback_blog_posts.sh

echo "🔄 Rolling back blog posts to previous state..."
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo ""
echo "1. Go to Supabase Dashboard: https://supabase.com/dashboard"
echo "2. Select your project: lumina-deals"
echo "3. Navigate to: Table Editor > posts"
echo "4. Identify the 3 new posts created today (2025-12-21)"
echo "   - Ring Video Doorbell analysis"
echo "   - Echo Dot 5 analysis"  
echo "   - Fire TV Stick 4K Max analysis"
echo "5. Delete these 3 posts using the delete button"
echo ""
echo "✅ Rollback complete!"
echo ""
echo "Note: If you need to restore from CSV backup:"
echo "  - Use the backup file in: backups/posts_backup_2025-12-21.csv"
echo "  - Import via Supabase Dashboard > Table Editor > Import"
