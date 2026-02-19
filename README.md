# AI Assistant Project

This project is a comprehensive AI-powered application where users can interact with an intelligent AI Assistant via a modern UI.

The system is composed of three main parts working together:

*   **Frontend (Next.js)**: A user interface where users send prompts to the AI Assistant.
*   **AI Agent (FastAPI + LangChain)**: An intelligent agent that processes user requests. It utilizes various **tools** to fetch real-time data from the backend server and maintains conversation context/memory using **MongoDB**.
*   **Backend Server (Express + PostgreSQL)**: The core business logic and data layer. It manages application data (such as products, inventory, users) which is safely stored in a **PostgreSQL** database.

## Prerequisites

Before running the project, ensure you have the following installed:

*   **Node.js** (v18 or higher)
*   **Python** (v3.10 or higher)
*   **Docker** & **Docker Compose** (for databases)

## Project Structure

*   `ai/`: Python FastAPI application for the AI Agent (uses MongoDB).
*   `backend/`: Node.js Express application for the main API (uses PostgreSQL).
*   `frontend/`: Next.js application for the user interface.

## Database Schema

The backend uses a relational database (PostgreSQL) to store structured data. Here are the main entities:

*   **Customer**: Represents clients.
    *   *Key Fields*: `uuid`, `customer_code`, `name` (first/last), `contact` (email/phone), `address`, `type` (General/VIP/Wholesale).
*   **Employee**: Represents staff members.
    *   *Key Fields*: `uuid`, `employee_code`, `name`, `position` (Sales, Manager, Cashier), `contact`.
*   **Product**: Items available for sale.
    *   *Key Fields*: `uuid`, `product_code`, `name`, `category` (Electronics, Clothing, Home), `price` (cost/selling).
*   **Inventory**: Stock levels for products.
    *   *Key Fields*: `uuid`, `warehouse_name`, `quantity`, linked to `Product`.
*   **SalesTransaction**: Records of sales.
    *   *Key Fields*: `uuid`, `total_amount`, `payment_method` (Cash/Card/QR), `status`, linked to `Customer` and `Employee`.
    *   *Items*: Detailed list of products sold in each transaction.

---

## Getting Started

### 1. Backend Server (Node.js + PostgreSQL)

The backend handles core business logic and data persistence using PostgreSQL.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Environment Setup:**
    Ensure you have a `.env` file with the necessary configuration.

3.  **Start the Database:**
    Run the PostgreSQL container using Docker Compose:
    ```bash
    docker-compose up -d
    ```

4.  **Install Dependencies:**
    ```bash
    npm install
    ```

5.  **Seed the Database (Optional but Recommended):**
    Populate the database with initial data:
    ```bash
    npm run seed
    ```

6.  **Start the Server:**
    Run the development server:
    ```bash
    npm run dev
    ```
    The backend server will typically run on `http://localhost:8000` (check your `.env` or console output).

### 2. AI Server (Python FastAPI + MongoDB)

The AI server hosts the LangChain-based agent and connects to MongoDB for chat history.

1.  **Navigate to the AI directory:**
    ```bash
    cd ai
    ```

2.  **Environment Setup:**
    Ensure you have a `.env` file configured.

3.  **Start the Database:**
    Run the MongoDB container:
    ```bash
    docker-compose up -d
    ```

4.  **Create and Activate Virtual Environment:**
    *   **Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    *   **macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

5.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

6.  **Start the AI Agent:**
    ```bash
    python -m uvicorn app.main:app --reload --port 8888
    ```
    The AI server runs on port `8888`.

### 3. Frontend Application (Next.js)

The frontend provides the user interface for interacting with the AI Assistant.

1.  **Navigate to the frontend app directory:**
    ```bash
    cd frontend/my-ai-app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.