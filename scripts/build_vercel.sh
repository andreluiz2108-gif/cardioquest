#!/usr/bin/env bash
set -e

echo "=== CardioQuest: Initializing Flutter Web Build for Vercel ==="

# Clone Flutter stable if not already cached
if [ ! -d "flutter" ]; then
  echo "Cloning Flutter SDK (stable branch)..."
  git clone https://github.com/flutter/flutter.git -b stable --depth 1 flutter
else
  echo "Flutter SDK directory found."
fi

# Add Flutter to PATH
export PATH="$PATH:$(pwd)/flutter/bin"

echo "Flutter version:"
flutter --version

echo "Building Flutter Web Release..."
flutter config --enable-web
flutter pub get
flutter build web --release

echo "=== Build Complete! Artifacts in build/web ==="
