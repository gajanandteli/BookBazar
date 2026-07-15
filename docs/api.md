# BookBazaar API Documentation

## Authentication
- POST /api/auth/google
- POST /api/auth/email/send-otp
- POST /api/auth/email/verify-otp
- POST /api/auth/mobile/send-otp
- POST /api/auth/mobile/verify-otp

## Books
- GET /api/books
- POST /api/books
- GET /api/books/:id
- PUT /api/books/:id
- DELETE /api/books/:id

## Users
- GET /api/users/profile
- PUT /api/users/profile

## Health
- GET /health
