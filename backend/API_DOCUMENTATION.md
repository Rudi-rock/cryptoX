# CryptoSolve API Documentation

Complete API reference for the CryptoSolve USDT/INR exchange platform.

## Base URL

```
http://localhost:3000/api
```

In production, replace with your backend URL.

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained via the `/auth` endpoint and are valid for 24 hours.

## Response Format

All endpoints return JSON with the following format:

**Success:**
```json
{
  "success": true,
  "data": {...}
}
```

**Error:**
```json
{
  "error": "Error message",
  "details": [...]
}
```

---

## Endpoints

### Auth Endpoints

#### Login / Signup

**Endpoint:** `POST /auth`

**Public:** Yes

**Request Body:**
```json
{
  "action": "login|signup",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"  // Required for signup
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Validation:**
- Email must be valid
- Password must be at least 6 characters
- For signup: passwords must match

---

### Wallet Endpoints

#### Get Wallet Balances

**Endpoint:** `GET /wallet`

**Protected:** Yes

**Response:**
```json
{
  "success": true,
  "wallet": {
    "userId": "uuid",
    "usdtBalance": 125.50,
    "inrBalance": 10500.00,
    "trc20Address": "TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c"
  }
}
```

**Notes:**
- Returns live USDT balance from Tatum
- INR balance is from database
- Address is TRC-20 format

#### Generate Deposit Address

**Endpoint:** `POST /wallet`

**Protected:** Yes

**Request Body:**
```json
{
  "currency": "USDT"
}
```

**Response:**
```json
{
  "success": true,
  "address": "TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c",
  "message": "Deposit address generated successfully"
}
```

**Notes:**
- Returns existing address if already created
- Generate once per user
- Share with users for receiving USDT

---

### Order Endpoints

#### Get Open Orders

**Endpoint:** `GET /orders`

**Protected:** Yes

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "side": "buy|sell",
      "order_type": "limit|market",
      "price": 84.50,
      "amount": 10.5,
      "total_cost": 887.25,
      "filled_pct": 50,
      "status": "open|partially_filled|filled|cancelled",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### Place Order

**Endpoint:** `POST /orders`

**Protected:** Yes

**Request Body:**
```json
{
  "side": "buy|sell",
  "orderType": "limit|market",
  "price": 84.50,
  "amount": 10.5,
  "totalCost": 887.25
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "uuid",
    "side": "buy",
    "order_type": "limit",
    "price": 84.50,
    "amount": 10.5,
    "total_cost": 887.25,
    "filled_pct": 0,
    "status": "open"
  }
}
```

**Validation:**
- Price must be positive
- Amount must be positive
- Sufficient balance required (checked in UI)

#### Cancel Order

**Endpoint:** `DELETE /orders?orderId={id}`

**Protected:** Yes

**Query Parameters:**
- `orderId` (required): UUID of order to cancel

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

#### Fill Order (Admin)

**Endpoint:** `PATCH /orders/{id}/fill`

**Protected:** Yes

**Request Body:**
```json
{
  "buyerAddress": "0x..." // Optional, for USDT transfer
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order marked as filled",
  "txHash": "0x..."
}
```

---

### Order Book Endpoint

#### Get Live Order Book

**Endpoint:** `GET /orderbook`

**Protected:** No (Public)

**Response:**
```json
{
  "success": true,
  "orderBook": {
    "bids": [
      {
        "price": 84.20,
        "amount": 150.5,
        "total": 12673.40
      }
    ],
    "asks": [
      {
        "price": 84.50,
        "amount": 200.0,
        "total": 16900.00
      }
    ],
    "timestamp": 1705329000000
  }
}
```

**Notes:**
- Real-time aggregated orders from order book
- Returns top 50 bids and asks
- Sorted by price automatically

---

### P2P Endpoints

#### Get P2P Advertisements

**Endpoint:** `GET /p2p`

**Protected:** No (Public)

**Response:**
```json
{
  "success": true,
  "ads": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "side": "buy|sell",
      "rate": 84.50,
      "min_limit": 500,
      "max_limit": 50000,
      "payment_methods": ["UPI", "IMPS"],
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 10
}
```

#### Create P2P Advertisement

**Endpoint:** `POST /p2p`

**Protected:** Yes

**Request Body:**
```json
{
  "side": "buy|sell",
  "rate": 84.50,
  "minLimit": 500,
  "maxLimit": 50000,
  "paymentMethods": ["UPI", "IMPS"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "P2P ad created successfully",
  "ad": {
    "id": "uuid",
    "user_id": "uuid",
    "side": "buy",
    "rate": 84.50,
    "min_limit": 500,
    "max_limit": 50000,
    "payment_methods": ["UPI", "IMPS"],
    "status": "active"
  }
}
```

**Validation:**
- Rate must be positive
- Min limit must be less than max limit
- Payment methods must be valid

#### Initiate P2P Trade

**Endpoint:** `POST /p2p/{id}/trade`

**Protected:** Yes

**Request Body:**
```json
{
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "P2P trade initiated",
  "escrow": {
    "id": "uuid",
    "trade_id": "trade_1705329000",
    "buyer_id": "uuid",
    "seller_id": "uuid",
    "usdt_amount": 59.17,
    "inr_amount": 5000,
    "status": "locked"
  }
}
```

**Notes:**
- Amount must be within min/max limits
- Funds are locked in escrow
- Both parties notified of trade initiation

---

### KYC Endpoints

#### Get KYC Status

**Endpoint:** `GET /kyc`

**Protected:** Yes

**Response:**
```json
{
  "success": true,
  "kycStatus": "not_started|pending|verified|rejected",
  "verificationId": "uuid"
}
```

#### Submit KYC Documents

**Endpoint:** `POST /kyc`

**Protected:** Yes

**Request Body:**
```json
{
  "selfieImage": "data:image/jpeg;base64,...",
  "aadhaarImage": "data:image/jpeg;base64,...",
  "fullName": "John Doe",
  "dateOfBirth": "1990-05-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "KYC submission successful",
  "verificationId": "uuid",
  "status": "success|failure",
  "result": {
    "facialMatch": true,
    "documentVerified": true,
    "livelinessDetected": true,
    "ageEstimated": 34
  }
}
```

**Validation:**
- Images must be base64 encoded
- Full name minimum 3 characters
- Date of birth must be YYYY-MM-DD format

---

### Withdrawal Endpoints

#### INR Withdrawal

**Endpoint:** `POST /withdraw`

**Protected:** Yes

**Request Body:**
```json
{
  "type": "inr",
  "amount": 5000,
  "upiId": "user@upi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "INR withdrawal initiated",
  "transferId": "payout_uuid",
  "status": "PENDING|SUCCESS|FAILED"
}
```

#### USDT Withdrawal

**Endpoint:** `POST /withdraw`

**Protected:** Yes

**Request Body:**
```json
{
  "type": "usdt",
  "amount": 10.5,
  "toAddress": "TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c"
}
```

**Response:**
```json
{
  "success": true,
  "message": "USDT withdrawal completed",
  "txHash": "0x..."
}
```

**Validation:**
- Amount must be positive
- UPI ID format: `user@upi`
- TRC-20 address format: starts with 'T', 34 characters
- Sufficient balance required

---

### Price Endpoint

#### Get USDT/INR Price

**Endpoint:** `GET /price`

**Protected:** No (Public)

**Response:**
```json
{
  "success": true,
  "price": {
    "rate": 84.50,
    "symbol": "USDT/INR",
    "timestamp": 1705329000000
  }
}
```

**Notes:**
- Response cached for 5 minutes
- Real price from CoinGecko API
- Updated every 30 seconds

---

## Error Codes

### 400 Bad Request
Invalid input or validation failure

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
Missing or invalid authentication token

```json
{
  "error": "Missing authentication token"
}
```

### 404 Not Found
Resource not found

```json
{
  "error": "Order not found"
}
```

### 500 Internal Server Error
Server-side error

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Recommended limits for production:
- Login: 5 requests per minute per IP
- Order placement: 30 requests per minute per user
- Other endpoints: 100 requests per minute per user

---

## Pagination

Currently not implemented. All endpoints return all matching results. Future versions will include:
- `?limit=50`
- `?offset=0`
- `?sort=created_at`
- `?order=desc`

---

## WebSocket (Future)

Real-time subscriptions via WebSocket:
```javascript
const ws = new WebSocket('ws://localhost:3000/orders');
ws.onmessage = (event) => {
  const order = JSON.parse(event.data);
  // Handle order update
};
```

---

## SDK Usage (JavaScript)

Use the provided `src/api/client.js`:

```javascript
const api = new CryptoSolveAPI();

// Login
const result = await api.login('user@example.com', 'password123');
console.log(result.token); // Save for later use

// Get wallet
const wallet = await api.getWallet();
console.log(wallet.wallet.usdtBalance);

// Place order
const order = await api.placeOrder('buy', 'limit', 84.50, 10.5);
console.log(order.order.id);
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication with JWT
- Order management
- P2P trading
- KYC verification
- Withdrawal handling
- Live price feed

---

## Support

For API questions and issues:
1. Check this documentation
2. Review error messages carefully
3. Check implementation examples in `src/api/client.js`
4. Review backend logs for detailed errors
