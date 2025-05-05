#!/bin/bash

# Script to stage, commit, and push golf-league-tracker to GitHub

# Navigate to project directory
cd "C:\Users\long_\Documents\Golf - Men's league\GolfApp" || { echo "Directory not found"; exit 1; }

# Ensure .gitignore exists to exclude unnecessary files
if [ ! -f .gitignore ]; then
    echo "node_modules/" > .gitignore
    echo "dist/" >> .gitignore
    echo ".env" >> .gitignore
    echo "Created .gitignore"
fi

# Stage all files
git add .
echo "Staged all files"

# Commit changes
git commit -m "Update golf league tracker app" || { echo "Nothing to commit or commit failed"; exit 1; }
echo "Committed changes"

# Ensure branch is named 'main'
git branch -M main
echo "Set branch to main"

# Set remote repository if not already set
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/Puzzle-Pals/GolfApp.git
    echo "Added remote origin"
else
    echo "Remote origin already set"
fi

# Push to GitHub
git push -u origin main || { echo "Push failed. Check credentials or network."; exit 1; }
echo "Successfully pushed to GitHub"

# Verify
echo "Check your repository at https://github.com/Puzzle-Pals/GolfApp"