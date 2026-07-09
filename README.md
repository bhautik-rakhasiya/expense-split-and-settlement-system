# Expense Sharing Application

A full-stack Expense Sharing Application built with **Node.js**, **Express.js**, **MongoDB**, **React.js**, and **Vite**. The application allows users to create groups, add shared expenses, view each member's net balance, and generate the minimum number of transactions required to settle all debts.

The project is organized as a **monorepo**, containing both the backend and frontend applications in a single repository.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcrypt

## Group Management

* Create Groups
* Add Members to Groups
* View Group Details

## Expense Management

* Add Expenses
* Support multiple expenses within a group
* Track payer, amount, description, and split details

## Group Summary

* Calculate each member's net balance
* Display who should pay and who should receive money

## Settlement Calculation

* Generate the minimum number of transactions required to settle all outstanding balances

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Joi Validation

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Context API

---

# Project Structure

```text
expense-split-and-settlement-system/

├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── Postman/
│   │   └── SplitEase.postman_collection.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# Project Overview

The application follows a simple expense-sharing workflow:

1. Register or log in to the application.
2. Create a group and add members.
3. Add expenses paid by different members.
4. View the group's overall expense summary.
5. Generate settlement suggestions to minimize the number of transactions between members.

Example:

* Alice pays ₹6,000 for Hotel.
* Bob pays ₹2,000 for Dinner.
* Charlie pays ₹800 for Fuel.
* David pays ₹1,200 for Lunch.

The backend calculates the final balance for every member and returns the optimal settlement transactions.

---

# Getting Started

## Clone the Repository

Clone the repository using:

```bash
git clone git@github.com:bhautik-rakhasiya/expense-split-and-settlement-system.git
```

Move into the project directory:

```bash
cd expense-split-and-settlement-system
```

---

# Install Dependencies

## Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend

npm install
```

## Frontend

Open another terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend

npm install
```

---

# Environment Variables

## Backend Environment Setup

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/expense-sharing

JWT_SECRET=your-secret-key

JWT_EXPIRES_IN=7d
```

## Frontend Environment Setup

Create a `.env` file inside the `frontend` directory if required.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# Running the Application

## Start Backend

Navigate to the backend directory:

```bash
cd backend
```

Start the development server:

```bash
npm run dev
```

Backend will start on:

```text
http://localhost:5000
```

---

## Start Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

Frontend will start on:

```text
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

---

## Groups

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| POST   | `/api/groups`          | Create a new group |
| GET    | `/api/groups`          | Get user's groups  |
| GET    | `/api/groups/:groupId` | Get group details  |

---

## Expenses

| Method | Endpoint                        | Description      |
| ------ | ------------------------------- | ---------------- |
| POST   | `/api/groups/:groupId/expenses` | Add expense      |
| GET    | `/api/groups/:groupId/expenses` | Get all expenses |

---

## Summary

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| GET    | `/api/groups/:groupId/summary` | Get member balances |

---

## Settlements

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| GET    | `/api/groups/:groupId/settlements` | Get settlement suggestions |

---

# Authentication

Protected APIs require a JWT access token.

Include the token in the request headers:

```http
Authorization: Bearer <your-jwt-token>
```

---

# Testing the Project

The project can be tested using:

* Postman
* Thunder Client
* Insomnia

The repository contains a ready-to-use Postman collection for testing all backend APIs.

---

# Postman Collection Guide

A Postman collection is available inside the backend project:

```text
backend/Postman/SplitEase.postman_collection.json
```

Follow these steps to test the APIs:

## Step 1: Import Collection

1. Open Postman.
2. Click on **Import**.
3. Select the collection file:

```text
SplitEase.postman_collection.json
```

4. Click **Import**.

The complete API collection will be added to your Postman workspace.

---

## Step 2: Configure variables

The collection contains pre-configured collection variables. Open the **Variables** tab of the imported collection in Postman:

1. **`baseUrl`**: Set to `http://localhost:5000/api` by default. Update if your backend runs on a different port.
2. **`authToken`**: This is updated automatically! The registration and login requests contain test scripts that capture the returned JWT and save it to this variable.
3. **`groupId`**: Set this to the `_id` of a created group to run group-specific API tests.

Use the base URL variable in requests:

```text
{{baseUrl}}/auth/login
```

---

## Step 3: Test API Flow

Follow this order while testing:

### Authentication

1. Register a new user.

```
POST /api/auth/register
```

2. Login with registered credentials.

```
POST /api/auth/login
```

3. Copy the JWT token from the response.

---

### Group Management

4. Create a new group.

```
POST /api/groups
```

5. Add members to the group.

6. Fetch group details.

```
GET /api/groups/:groupId
```

---

### Expense Management

7. Add expenses for different members.

```
POST /api/groups/:groupId/expenses
```

8. Retrieve all expenses.

```
GET /api/groups/:groupId/expenses
```

---

### Summary and Settlement

9. Check group balances.

```
GET /api/groups/:groupId/summary
```

10. Generate settlement suggestions.

```
GET /api/groups/:groupId/settlements
```

---

# Frontend Testing

Launch the frontend application and verify the following flows:

* Register a new account.
* Login successfully.
* Navigate to the Groups page.
* Create a group.
* View group details.
* Add expenses.
* Check the Summary page.
* Review Settlement suggestions.
* Logout.

---

# Settlement Logic

The backend calculates settlements in two steps.

## Step 1: Calculate Net Balance

Every expense updates the balance of users:

* Add the expense amount to the payer's balance.
* Subtract each participant's share from their balance.

## Step 2: Generate Settlement

Users are divided into:

* Creditors (positive balance)
* Debtors (negative balance)

The settlement algorithm matches debtors with creditors and generates the minimum number of transactions required to clear all balances.

Example:

```text
Balances

Alice     +3500

Bob       -500

Charlie   -1700

David     -1300
```

Settlement:

```text
Bob      → Alice      ₹500

Charlie  → Alice      ₹1700

David    → Alice      ₹1300
```

---

# Scripts

## Backend

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---

## Frontend

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Future Improvements

* Custom expense splitting
* Unequal percentage-based splits
* Edit and delete expenses
* Invite users via email
* Profile management
* Expense categories
* File attachments for receipts
* Real-time updates
* Notifications
* Pagination and filtering
* Docker support
* Automated testing
* CI/CD pipeline

