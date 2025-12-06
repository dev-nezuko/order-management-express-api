#!/bin/bash

# Script to run the test suite against the solutions directory
# This allows developers/interviewers to verify the solutions are correct

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🔄 Backing up src/ directory..."
rm -rf src_backup
cp -r src src_backup

echo "📦 Copying solutions to src/..."
cp solutions/config/* src/config/
cp solutions/db/*.ts src/db/
cp solutions/db/repositories/* src/db/repositories/
cp solutions/services/* src/services/
cp solutions/middleware/* src/middleware/
cp solutions/routes/* src/routes/
cp solutions/errors/* src/errors/
cp solutions/app.ts src/

echo "🧪 Running tests against solutions..."
echo ""

# Run tests and capture exit code
set +e
npm test
TEST_EXIT_CODE=$?
set -e

echo ""
echo "🔄 Restoring original src/ directory..."
rm -rf src
mv src_backup src

if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ All tests passed! Solutions are correct."
  exit 0
else
  echo ""
  echo "❌ Some tests failed. Please check the solutions."
  exit 1
fi

