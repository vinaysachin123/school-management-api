# School Management APIs

A Node.js REST API using Express.js and MySQL to manage school data. The system allows users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location.

## Features
- Add a new school with precise geographical coordinates (latitude and longitude).
- List all schools sorted by their distance from a provided geographical location.
- Haversine formula for calculating distance.
- Robust input data validation using `zod`.

## Prerequisites
- Node.js (v14 or higher)
- MySQL

## Installation and Setup

1. **Clone or Download the Repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the Database**
   - Ensure your MySQL server is running.
   - You do NOT need to manually run an initialization script for the tables; the API will create the `schools` table automatically upon startup.
   - Configure the environment variables by editing `.env`:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=password
     DB_NAME=school_management
     ```
   - *Ensure the database (`school_management` or your custom name) exists before starting the server.* You can create it in MySQL Shell or phpMyAdmin.
     ```sql
     CREATE DATABASE school_management;
     ```

4. **Start the Server**
   ```bash
   node src/index.js
   # OR for development
   npm run dev
   ```

## Postman Collection
A file named `postman_collection.json` is provided in the repository root. You can import this directly into Postman to test the available endpoints.

## Hosting and Deployment
This API can be easily hosted on cloud platforms like:
1. **Render / Railway / Heroku**: These services support automated Node.js deployments from GitHub. You can set the Environment Variables in the service settings.
2. **Managed MySQL**: Use a managed database like PlanetScale, AWS RDS, or Aiven, and replace the `DB_HOST`, `DB_USER`, and `DB_PASSWORD` in your production environment variables.
