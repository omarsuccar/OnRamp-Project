# CareerLink: Job Portal with Node.js, Express, React, and MongoDB

CareerLink is a job portal application designed to connect job applicants with recruiters. This project features backend built with Node.js, Express, and MongoDB, and a dynamic frontend using React and Material-UI.

## What's Inside:

- **Backend:**
  - Node.js and Express-based API server
  - MongoDB for data storage
  - JWT authentication for secure login and signup
  - RESTful API endpoints for managing users, companies, jobs, and applications

- **Frontend:**
  - React for building user interfaces
  - Material-UI for responsive and modern component design
  - User and Company dashboards
  - Job posting and application management

## Features:

### Backend
- **Authentication:**
  - JWT-based authentication for both users and companies
  - Secure login and signup routes

- **Database:**
  - MongoDB for schema-based data modeling
  - User and Company profiles with relations to jobs and applications

- **Job Management:**
  - Post, view, update, and delete job listings
  - Apply for jobs, track applications, and manage job postings

- **Middleware:**
  - Authentication middleware for protecting routes
  - Error handling and logging

### Frontend
- **Authentication:**
  - User and company-specific login and signup forms
  - Cookie-based session management

- **User Interface:**
  - Responsive design using Material-UI components
  - Dynamic dashboards for users and companies
  - Profile management and job application tracking for users
  - Job posting and applicant management for companies

- **Navigation:**
  - React Router for client-side routing
  - Protected routes based on authentication status

## Getting Started

### Prerequisites
Ensure you have the following installed:

- Node.js with a version >=14.x
- MongoDB with a version>=4.x
- npm (Node Package Manager) or yarn

### Installation

1. **Clone the repository:**





## Running the Application

- **Backend:** The API server will run at [http://localhost:5000](http://localhost:5000).
- **Frontend:** The React frontend will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

### Backend

- **`/models`**: Mongoose models for Users, Companies, and Jobs.
- **`/controllers`**: Controllers for handling API requests.
- **`/routes`**: Express routes for Users and Companies.
- **`/middleware`**: Middleware for authentication and error handling.
- **`/server.js`**: Main entry point for the backend server.

### Frontend

- **`/components`**: Reusable React components.
- **`/pages`**: Pages for different views (login, signup, dashboard).
- **`/App.js`**: Main React component that handles routing.
- **`/menu.js`**: Component that serves as the dashboard for users and companies.

## Usage

### User Functionality

- **Signup/Login:** Users can create an account or log in.
- **View Jobs:** Browse and search for job postings.
- **Apply for Jobs:** Submit applications for available jobs.
- **Track Applications:** View jobs you have applied to and their status.

### Company Functionality

- **Signup/Login:** Companies can create an account or log in.
- **Post Jobs:** Create new job postings.
- **Manage Jobs:** View and manage existing job postings.
- **View Applicants:** Review applicants for each job posting.

## Troubleshooting Common Errors

### MongoDB Connection Issues

- Ensure MongoDB is running locally or update the `dbURI` in your `.env` file with the correct connection string.

### CORS Errors

- If you encounter CORS errors, make sure that the frontend and backend are correctly configured to allow cross-origin requests.

