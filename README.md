# NestJS Basic Implementation

This repository contains the solution for the NestJS backend developer test. The project demonstrates a basic RESTful API with user management, PostgreSQL integration, message queue setup, and API performance/security enhancements.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Message Queue Integration](#message-queue-integration)
7. [Performance and Security](#performance-and-security)
8. [Testing](#testing)
9. [License](#license)

---

## Features

- RESTful API for user management:
  - `POST /users`: Create a new user.
  - `GET /users`: Retrieve all users.
- PostgreSQL database integration.
- Message queue integration using RabbitMQ (or Redis) to send a welcome message on user signup.
- Optimized query for fetching users.
- Security measures and performance optimizations.

---

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- RabbitMQ or Redis (for message queue)
- Yarn or npm

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/basic-nestjs.git
   cd basic-nestjs
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:

   - Create a PostgreSQL database.
   - Configure `DATABASE_URL` in the `.env` file:

     ```env
     DATABASE_URL=postgres://username:password@localhost:5432/database_name
     ```

4. Start the RabbitMQ/Redis service.

5. Run the application:

   ```bash
   npm run start
   ```

---

## Usage

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

---

## API Endpoints

### Base URL

`http://localhost:3000`

### Endpoints

1. **POST /users**

   - **Description**: Create a new user.
   - **Request Body**:

     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "age": 25
     }
     ```

   - **Response**:

     ```json
     {
       "id": 1,
       "name": "John Doe",
       "email": "john.doe@example.com",
       "age": 25
     }
     ```

2. **GET /users**
   - **Description**: Retrieve all users.
   - **Response**:

     ```json
     [
       {
         "id": 1,
         "name": "John Doe",
         "email": "john.doe@example.com",
         "age": 25
       }
     ]
     ```

3. **GET /users?where[age]=18&order=ASC**
   - **Description**: Retrieve all users equal to 20 and order by name DESC.
   - **Query Params**:
     - `where[age]=20`
     - `order=DESC`
   - **Response**:

     ```json
     [
       {
         "id": 1,
         "name": "John Doe",
         "email": "john.doe@example.com",
         "age": 25
       }
     ]
     ```

4. **GET /users/age/${age}**
   - **Description**: It will Retrieve all users greater than 18 and order by name ASC.
   - **Query Params**:
     - `age=18`
   - **Response**:
     ```json
     [
       {
         "id": 1,
         "name": "John Doe",
         "email": "john.doe@example.com",
         "age": 18
       }
     ]
     ```

---

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INT NOT NULL
);

-- Query for users over the age of 18, sorted by name:
SELECT * FROM users WHERE age > 18 ORDER BY name ASC;

-- Indexes for optimization:
CREATE INDEX idx_users_email ON users (email);
```

---

## Message Queue Integration

### Setup

- **Queue**: RabbitMQ (or Redis)
- **Message**: Sends a "Welcome" message when a user signs up.

### Configuration

1. **Install dependencies**:

   ```bash
   npm install @nestjs/microservices amqplib
   ```

2. **Add a queue client** to the application (`src/users.service.ts`):

   ```typescript
   @Inject('MESSAGE_QUEUE') private readonly messageQueue: ClientProxy;
   ```

3. **Emit a welcome message** upon user creation:

   ```typescript
   this.messageQueue.emit("user_created", { email, name });
   ```

4. **Consume messages** in the application:

   ```typescript
   @MessagePattern('user_created')
   handleUserCreated(data: { email: string; name: string }) {
     console.log(`Welcome ${data.name}!`);
   }
   ```

---

## Performance and Security

### Performance Optimizations

1. **Caching**: Implement Redis to cache frequently accessed data.
2. **Database Indexing**: Add indexes to optimize query performance (e.g.`email`).
3. **Pagination**: Use `limit` and `offset` in queries to handle large datasets.
4. **Load Balancing**: Use a load balancer for horizontal scaling.

### Security Measures

1. **Data Validation**: Use `class-validator` to validate request payloads.
2. **Rate Limiting**: Implement rate limiting to prevent abuse.
3. **Authentication & Authorization**: Secure endpoints with JWT or OAuth2.
4. **Sanitize Inputs**: Use libraries like `xss` to prevent SQL injection and XSS attacks.
5. **HTTPS**: Use HTTPS to encrypt communication.

---

## Testing

Run tests with:

```bash
npm run test
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
