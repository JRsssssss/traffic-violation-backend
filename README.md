# Traffic Violation Backend

This is the backend API for managing traffic violations, built with Express, TypeScript, TSOA, and Prisma.

## Authentication

The API uses JWT (JSON Web Token) authentication to protect routes based on user roles. There are two main roles:

- **Officer**: Can view and add violations, generate tickets
- **Admin**: Has all Officer permissions plus the ability to manage users and perform administrative operations

### How Authentication Works

1. Users must authenticate via the `/User/login` endpoint with their username and password
2. The API returns a JWT token that must be included in the Authorization header for subsequent requests
3. TSOA middleware verifies tokens and checks for appropriate roles based on the endpoint Tags

### Setting Up Authentication

1. Copy the `.env.example` file to `.env`
2. Set a secure random string as your `JWT_SECRET` in the `.env` file
3. Restart the server to apply the changes

## API Usage

### Login and Get Token

```
POST /User/login
{
  "username": "your_username",
  "password": "your_password"
}
```

### Using the Token

Include the token in the Authorization header for all protected API requests:

```
Authorization: Bearer your_jwt_token_here
```

## Development

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and update the values
3. Run database migrations: `npx prisma migrate dev`
4. Generate TSOA routes and specs: `npm run tsoa`
5. Start the development server: `npm run dev`

### Building for Production

1. Build the project: `npm run build`
2. Start the server: `npm start`

## API Documentation

The API documentation is available at `/api-docs` when the server is running.
