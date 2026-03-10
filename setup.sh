#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Grievance Resolution System Setup ===${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 14+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"

# Check if MongoDB is running
echo -e "\n${YELLOW}Checking MongoDB...${NC}"
if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not detected. Please start MongoDB:${NC}"
    echo "   Mac:   brew services start mongodb-community"
    echo "   Linux: sudo service mongod start"
    echo "   Windows: Run MongoDB Community Service or mongod.exe"
fi

# Setup Backend
echo -e "\n${YELLOW}=== Setting up Backend ===${NC}"
cd grievance-backend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env created. Please update with your values.${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install > /dev/null 2>&1
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Setup Frontend
echo -e "\n${YELLOW}=== Setting up Frontend ===${NC}"
cd ../grievance-frontend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Frontend .env created${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

echo -e "\n${GREEN}=== Setup Complete! ===${NC}\n"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start MongoDB (if not running)"
echo "2. Start Backend:   cd grievance-backend && npm run dev"
echo "3. Start Frontend:  cd grievance-frontend && npm start"
echo -e "\n${YELLOW}Backend URL:  http://localhost:5000${NC}"
echo -e "${YELLOW}Frontend URL: http://localhost:3000${NC}\n"
