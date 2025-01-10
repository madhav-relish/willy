# Collaborative Whiteboard App

Welcome to the Collaborative Whiteboard App! This application allows users to create and join rooms to collaborate in real-time on a digital whiteboard. Users can draw, erase, and save their progress, which is persisted in a PostgreSQL database. When users rejoin a room, they can see their previous work.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Deployment](#deployment)
- [Features](#features)

## Technologies Used

### Frontend
- **Next.js**: A React framework for server-rendered applications.
- **Socket.IO**: For real-time communication between clients and the server.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **JavaScript Canvas**: For drawing on the whiteboard.

### Backend
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **Prisma**: ORM for database management.
- **PostgreSQL**: Relational database for storing user data and drawings.

## Getting Started

### Frontend

To run the frontend application:

1. Navigate to the `apps/frontend` directory:
`cd apps/frontend`

3. Install dependencies:
`pnpm install`

4. Start the development server:
``pnpm run dev``

5. To build the application for production: `pnpm run build`


### Backend

To run the backend application:

1. Navigate to the `apps/backend` directory:
`cd apps/backend`

2. Install dependencies:
`pnpm install`

3. Build the application:
`pnpm run build`

4. Start the server:
`pnpm start`


## Deployment

The backend is deployed on Render, and the frontend is deployed on Vercel. Make sure to set up environment variables for both deployments according to your configuration.

## Features

- **Real-Time Collaboration**: Multiple users can draw on the whiteboard simultaneously.
- **Room Management**: Users can create and join rooms using unique identifiers.
- **Persistent Storage**: User progress is saved in a PostgreSQL database, allowing them to rejoin and see their previous work.
- **Responsive Design**: The application is styled with Tailwind CSS for a modern look and feel.
