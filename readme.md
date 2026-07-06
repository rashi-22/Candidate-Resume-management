├── backend/          # NestJS application
└── frontend/         # React application

cd backend

npm install

# Server Port configuration
PORT=3000

# Database Configuration Credentials 
check .env.example file for database configuration

# Mailtrap sandbox.smtp.mailtrap.io

use this configuration for email verification 

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=051916b36e0bd8 // sandbox user name for mailtrap.io
MAIL_PASS=0ebf9e906bcbfa // sandbox password for mailtrap.io (already mentioned in API)


cd frontend

npm install

# Development mode with hot-reloading active from backend/
npm run start:dev

# from frontend/
npm run start


for admin login use static username: 'admin' and password: 'admin123'
