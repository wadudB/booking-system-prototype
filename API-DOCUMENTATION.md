# Hospital Booking API

Welcome to the Hospital Booking API! This guide covers the endpoints for our booking system.

**Base URL**: `http://localhost:3000/api` (development)

## Authentication

We use JWT-based authentication via NextAuth.js with session cookies.


## Request & Response Examples

### Login

```http
POST /auth/signin
```

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Success:** Returns user session data

### List Hospitals

```http
GET /hospitals
```

**Success:**
```json
[
  {
    "id": "c4b8d8d2-0a1e-4e6f-b74d-957954a5d780",
    "name": "City General Hospital",
    "location": "Downtown, New York"
  }
]
```

### Create Booking

```http
POST /bookings
```

**Request:**
```json
{
  "serviceId": "f9b5bdf2-16d7-48ec-8f73-1d3a0f4738a9",
  "date": "2023-10-20T15:00:00Z"
}
```

**Success:** Returns the created booking object

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message explaining the issue"
}
```

Common status codes:
- `400` - Bad request (invalid data)
- `401` - Unauthorized (authentication required)
- `404` - Resource not found
- `500` - Server error
