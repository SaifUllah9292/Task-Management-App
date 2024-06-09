# Task Management

This project is a task management application where users can sign up, log in, create, update, delete, and view their own tasks. It is built using Node.js and PostgreSQL.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (version 14 or above).
- You have installed PostgreSQL (version 12 or above).
- You have a PostgreSQL database created for this project.
- You have a code editor like VSCode.

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/task-management.git
   cd task-management
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory of the project and add the following variables with your PostgreSQL credentials:

   ```plaintext
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=your-database
   JWT_SECRET=your-secret-key
   ```

4. **Run database migrations:**

   ```sh
   npx sequelize-cli db:migrate
   ```

## Running the Project

To run the project, execute the following command in your terminal:

```sh
npm start
```
