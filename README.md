# Spotify Clone

A full-stack Spotify clone built with React, TypeScript, Node.js, and MongoDB.

## Features

- User authentication with Clerk
- Music streaming
- Album browsing
- Responsive design with Tailwind CSS
- Admin panel for managing songs and albums
- Real-time playback controls

## Tech Stack

### Frontend

- React with TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- React Router DOM
- Axios for API calls
- Shadcn UI components

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Cloudinary for file storage
- Clerk for authentication
- Express File Upload

## Prerequisites

- Node.js 18+ installed
- MongoDB database
- Cloudinary account
- Clerk account

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```sh
cd backend
```

2. Install dependencies:

```sh
npm install
```

3. Create a `.env` file in the backend directory with these variables:

```env
# Server configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_uri

# Authentication
ADMIN_EMAIL=your_admin_email
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# File storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server:

```sh
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```sh
cd frontend
```

2. Install dependencies:

```sh
npm install
```

3. Create a `.env` file in the frontend directory with these variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start the development server:

```sh
npm run dev
```

The application should now be running at `http://localhost:3000`

### Database Seeding

To populate your database with initial data:

```sh
cd backend
npm run seed:songs    # Seed individual songs
npm run seed:albums   # Seed albums and related songs
```

## Project Structure

```
├── backend/                # Backend source code
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── lib/          # Utilities and configurations
│   └── package.json
│
└── frontend/              # Frontend source code
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── stores/        # State management
    │   ├── lib/          # Utilities
    │   └── layout/       # Layout components
    └── package.json
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
