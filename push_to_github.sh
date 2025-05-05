#!/bin/bash

# Script to stage, commit, and push golf-league-tracker to GitHub

# Check if in correct directory
PROJECT_DIR="/c/Users/long_/Documents/Golf - Men's league/GolfApp"
if [ "$(pwd)" != "$PROJECT_DIR" ]; then
    echo "Error: Not in project directory. Navigating to $PROJECT_DIR"
    cd "$PROJECT_DIR" || { echo "Error: Directory $PROJECT_DIR not found"; exit 1; }
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository"
    git init
fi

# Ensure .gitignore exists to exclude unnecessary files
if [ ! -f .gitignore ]; then
    echo "node_modules/" > .gitignore
    echo "dist/" >> .gitignore
    echo ".env" >> .gitignore
    echo "Created .gitignore"
else
    echo ".gitignore already exists"
fi

# Stage all files
git add .
echo "Staged all files"

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "No changes to commit"
    exit 0
fi

# Commit changes
git commit -m "Update golf league tracker app" || { echo "Commit failed"; exit 1; }
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
git push -u origin main || { echo "Push failed. Check GitHub credentials or network."; exit 1; }
echo "Successfully pushed to GitHub"

# Verify
echo "Check your repository at https://github.com/Puzzle-Pals/GolfApp.git"