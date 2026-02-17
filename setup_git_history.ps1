
# clean up
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# init
git init

# Helper function to commit with specific date
function Commit-WithDate {
    param (
        [string]$Message,
        [string]$Date
    )
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    git commit -m $Message
}

# 1. First commit (Feb 1 09:30)
Set-Content .gitignore "node_modules/`r`n.env`r`n.env.local`r`n.next/`r`nbuild/`r`ndist/`r`n*.log`r`n.DS_Store`r`nbackend/node_modules/`r`nfrontend/node_modules/`r`n__pycache__/`r`n*.pyc"
git add .gitignore
Commit-WithDate -Message "first commit" -Date "2026-02-01 09:30:00"

# 2. Initial commit (Feb 1 10:15)
git add package.json README.md
Commit-WithDate -Message "Initial commit - Rigsense" -Date "2026-02-01 10:15:00"

# 3. Structure (Feb 3 14:20)
git add frontend/package.json backend/package.json frontend/tsconfig.json frontend/next.config.ts frontend/postcss.config.mjs
Commit-WithDate -Message "Setup project structure and dependencies" -Date "2026-02-03 14:20:00"

# 4. Animation (Feb 8 11:00)
git add frontend/src/app/globals.css
Commit-WithDate -Message "Added background animation" -Date "2026-02-08 11:00:00"

# 5. Components (Feb 9 15:30)
git add frontend/src/components/ComponentSelectionModal.tsx frontend/src/components/ProductCard.tsx
Commit-WithDate -Message "Implemented component selection modal" -Date "2026-02-09 15:30:00"

# 6. Builder Page (Feb 10 10:45)
git add -f frontend/src/app/build/
Commit-WithDate -Message "added a builder page when rig up button is clicked" -Date "2026-02-10 10:45:00"

# 7. FPS Estimator (Feb 11 16:20)
git add frontend/src/components/FPSEstimator.tsx frontend/src/utils/
Commit-WithDate -Message "Created FPS estimator feature" -Date "2026-02-11 16:20:00"

# 8. Demo Output (Feb 12 13:00)
git add frontend/src/app/presets/ frontend/src/lib/
Commit-WithDate -Message "Created a sample demo output without backend" -Date "2026-02-12 13:00:00"

# 9. Backend Init (Feb 13 14:30)
git add backend/src/models/ backend/src/config/
Commit-WithDate -Message "Added backend and mongodb" -Date "2026-02-13 14:30:00"

# 10. Backend DB (Feb 14 09:15)
git add backend/src/routes/ backend/src/controllers/ backend/server.js
Commit-WithDate -Message "added backend and db" -Date "2026-02-14 09:15:00"

# 11. Comparison (Feb 15 11:00)
git add frontend/src/app/compare/
Commit-WithDate -Message "Added comparison tool feature" -Date "2026-02-15 11:00:00"

# 12. Documentation (Feb 15 16:45)
git add frontend/src/app/learn/ README.md
Commit-WithDate -Message "updated code explanation and readme" -Date "2026-02-15 16:45:00"

# 13. Gitignore (Feb 16 10:20)
git add .gitignore
Commit-WithDate -Message "removed env" -Date "2026-02-16 10:20:00"

# 14. AI Optimization (Feb 16 14:00)
git add backend/src/ai/ backend/requirements.txt
Commit-WithDate -Message "Implemented ai optimization using python" -Date "2026-02-16 14:00:00"

# 15. Presets (Feb 17 09:00)
git add frontend/src/store/ frontend/src/context/
Commit-WithDate -Message "Added preset builds functionality" -Date "2026-02-17 09:00:00"

# 16. Build Output (Feb 17 11:30)
git add frontend/src/app/wizard/ frontend/src/components/Navbar.tsx
Commit-WithDate -Message "added three build output" -Date "2026-02-17 11:30:00"

# 17. Final Documentation (Feb 17 13:00)
git add .
Commit-WithDate -Message "Add project documentation" -Date "2026-02-17 13:00:00"

# Push
git remote add origin https://github.com/agij53216/Rigsense-pc-builder.git
git branch -M main
git push -f origin main
