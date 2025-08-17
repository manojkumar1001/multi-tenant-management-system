# Multi Tenant Management System

## Local Setup

1. Clone the repository:
   ```
   git clone git@github.com:<your-username>/multi-tenant-management-system.git
   ```
2. Change into the project directory:
   ```
   cd multi-tenant-management-system
   ```
3. Copy the example environment file and update it:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file to add your `SECRET_KEY` and Neon database connection string.
4. Install dependencies:
   ```
   npm install
   ```
5. Seed the database:
   ```
   npm run seed
   ```
6. Start the development server:
   ```
   npm run dev
   ```

## Deployment

1. In the Vercel dashboard, select **Import Project** and add your GitHub repository.
2. During the New Project setup, update the environment variables using the values from your `.env` file.
3. Click **Deploy** to launch the application.

### Endpoints

You can explore and test the API using the included Postman collection: `multi-tenant Event mgmt.postman_collection.json`.

#### Authentication

- **Login**: `POST /api/users/login`
  - Request Body:
    ```json
    {
      "email": "john.admin@techcorp.com",
      "password": "password123"
    }
    ```
  - Returns a JWT token required for accessing protected routes.
  - Add the token in the `Authorization` header as `Bearer <token>`.

#### Core Endpoints

- **Users**: `GET /api/users` – List all users.
- **Tenants**: `GET /api/tenants` – List all tenants.
  - `GET /api/tenants/dashboard ` – Retrieve all the information regarding that particular tenant
- **Events**:
  - `GET /api/events` – List all events
- **GET /api/bookings** – List all bookings (admin access).
  - `POST /api/bookings/book-event` – Book an event by providing `eventId`.
  - `POST /api/bookings/cancel-booking` – Cancel a booking by providing `bookingId`.
  - `GET /api/bookings/my-bookings` – Retrieve the logged-in user’s bookings.
- **GET /api/bookinglogs** – View booking activity logs.
- **GET /api/notifications** – List all notifications.
- **GET /api/notifications/my-notifications** – Get notifications for the logged-in user.
- **POST /api/notifications/{id}/read** – Mark a notification as read.

---

You can import the Postman collection into Postman to quickly test all these endpoints with sample data and authentication flows.
