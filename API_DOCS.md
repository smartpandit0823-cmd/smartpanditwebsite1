# SmartPandit API Documentation

## Auth (OTP Based)

### POST /api/auth/send-otp
**Body:** `{ "phone": "9876543210" }`  
**Response:** `{ "success": true, "message": "OTP sent", "expiresIn": 300 }`

### POST /api/auth/verify-otp
**Body:** `{ "phone": "9876543210", "otp": "123456", "name": "User", "email": "x@y.com", "city": "Pune" }` (name/email/city optional)  
**Response:** `{ "success": true, "user": { "id", "phone", "name", "email", "city" } }`  
Sets session cookie for subsequent requests.

### POST /api/auth/logout
Clears session.

### GET /api/auth/me
**Auth:** Cookie  
**Response:** `{ "user": { "id", "phone", "name", "email", "city" } }`

---

## Puja

### GET /api/puja
**Query:** ?category=&featured=true&search=&page=&limit=  
**Response:** `{ data: [...], total, page, totalPages }`

### GET /api/puja/:slug
**Response:** Full puja details.

### POST /api/puja/check-availability
**Body:** `{ "pujaId", "date" }`  
**Response:** `{ available, booked, maxPerDay, slotsLeft }`

### POST /api/puja/book
**Auth:** Cookie  
**Body:** `{ "pujaId", "package", "date", "time", "address", "notes?" }`  
**Response:** `{ success, booking: { id, amount, status, ... } }`

---

## Booking (User)

### GET /api/booking/:id
**Auth:** Cookie  
**Response:** Booking details.

### GET /api/my-bookings
**Auth:** Cookie  
**Query:** ?status=&page=&limit=  
**Response:** `{ data, total, page, totalPages }`

---

## Payment

### POST /api/payment/create
**Auth:** Cookie  
**Body:** `{ "entityType": "booking"|"order"|"astro", "entityId", "amount", "currency?" }`  
**Response:** `{ orderId, amount, key }` — use with Razorpay checkout.

### POST /api/payment/verify
**Auth:** Cookie  
**Body:** `{ "razorpay_order_id", "razorpay_payment_id", "razorpay_signature" }`  
**Response:** `{ success, entityType, entityId }`

---

## Store

### GET /api/products
**Query:** ?category=&search=&page=&limit=

### GET /api/products/:slug
**Response:** Product details.

### POST /api/cart/add
**Auth:** Cookie  
**Body:** `{ "productId", "quantity" }`

### POST /api/cart/update
**Auth:** Cookie  
**Body:** `{ "productId", "quantity" }` (0 = remove)

### GET /api/cart
**Auth:** Cookie  
**Response:** `{ items, total }`

### POST /api/order/create
**Auth:** Cookie  
**Body:** `{ "shippingAddress": { "name", "phone", "address", "city", "state", "pincode" } }`  
**Response:** `{ success, order: { id, totalAmount, status } }`  
Creates order from cart. Call payment/create with entityType=order, entityId=order.id.

### GET /api/orders/:id
**Auth:** Cookie

### GET /api/my-orders
**Auth:** Cookie  
**Query:** ?page=&limit=

---

## Astrology

### GET /api/astrology/services
**Response:** `{ data: [...] }`

### GET /api/astrology/services/:slug
**Response:** Service details with sessionTypes (minutes, price).

### POST /api/astrology/request
**Auth:** Cookie  
**Body:** `{ "serviceType", "birthDate", "birthTime?", "birthPlace", "problemCategory", "preferredDate?", "preferredTime?", "sessionType", "notes?" }`  
**Response:** `{ success, request: { id, amount, status } }`

### GET /api/astrology/request/:id
**Auth:** Cookie  
**Response:** Request details + **statusMessage** (e.g. "Your booking is confirmed", "Your call is scheduled for...")

### GET /api/my-consultations
**Auth:** Cookie  
**Query:** ?status=&page=&limit=

---

## CMS (Public)

### GET /api/offers
**Query:** ?type=puja|store|global  
**Response:** `{ data: [...] }`

### GET /api/banners
**Query:** ?position=home|puja|store  
**Response:** `{ data: [...] }`

### GET /api/sliders
**Response:** `{ data: [...] }`

---

## Notifications

### GET /api/notifications
**Auth:** Cookie  
**Query:** ?unread=true&limit=

### POST /api/notifications/:id/read
**Auth:** Cookie  
Marks notification as read.

---

## Admin APIs (NextAuth session required)

### POST /api/admin/bookings/:id/assign
**Body:** `{ "panditId" }`

### POST /api/admin/bookings/:id/status
**Body:** `{ "status", "note?" }`

### POST /api/admin/astrology/:id/assign
**Body:** `{ "astrologerId", "finalCallTime?" }`

### GET /api/admin/analytics
**Query:** ?period=7d|30d
