#!/bin/bash

# Create Python virtual environment
python -m venv venv
source venv/bin/activate

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd app
npm install
cd ..

# Create .env files
cat > backend/.env << EOL
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://localhost/dr_dao
AGENTKIT_API_KEY=your_api_key_here
WEB3_PROVIDER=http://localhost:8545
EOL

cat > app/.env << EOL
VITE_BACKEND_URL=http://localhost:5000
VITE_CHAIN_ID=84531
EOL

# Create database
createdb dr_dao

echo "Setup complete! Please update the API keys in the .env files."
echo "To start the application:"
echo "1. Start the backend: cd backend && flask run"
echo "2. Start the frontend: cd app && npm run dev" 