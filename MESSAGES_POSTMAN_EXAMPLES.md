# CMAB Messages API - Postman Collection Examples

## Base URL
```
http://localhost:4001/messages
```

## Authentication
All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Create Message

**Method:** POST
**URL:** `/messages`
**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "organizationName": "Dhaka Medical Association",
  "fatherName": "Dr. Ahmed Rahman",
  "message": "We are pleased to announce the upcoming annual medical conference scheduled for next month. All members are requested to attend the meeting on 15th June 2024 at the BMA auditorium."
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "organizationName": "Dhaka Medical Association",
  "fatherName": "Dr. Ahmed Rahman",
  "message": "We are pleased to announce the upcoming annual medical conference scheduled for next month. All members are requested to attend the meeting on 15th June 2024 at the BMA auditorium.",
  "createdAt": "2026-05-11T15:30:00.000Z",
  "updatedAt": "2026-05-11T15:30:00.000Z"
}
```

---

## 2. Update Message

**Method:** PATCH
**URL:** `/messages/:id`
**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body (JSON):**
```json
{
  "organizationName": "Dhaka Medical Association Updated",
  "fatherName": "Dr. Ahmed Rahman",
  "message": "We are pleased to announce the upcoming annual medical conference scheduled for next month. All members are requested to attend the meeting on 20th June 2024 at the BMA auditorium. Updated venue and time."
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "organizationName": "Dhaka Medical Association Updated",
  "fatherName": "Dr. Ahmed Rahman",
  "message": "We are pleased to announce the upcoming annual medical conference scheduled for next month. All members are requested to attend the meeting on 20th June 2024 at the BMA auditorium. Updated venue and time.",
  "createdAt": "2026-05-11T15:30:00.000Z",
  "updatedAt": "2026-05-11T16:45:00.000Z"
}
```

---

## 3. Get All Messages (Public)

**Method:** GET
**URL:** `/messages`

**Query Parameters (Optional):**
```
page: 1
limit: 10
search: Dhaka
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "organizationName": "Dhaka Medical Association",
      "fatherName": "Dr. Ahmed Rahman",
      "message": "We are pleased to announce the upcoming annual medical conference...",
      "createdAt": "2026-05-11T15:30:00.000Z",
      "updatedAt": "2026-05-11T15:30:00.000Z"
    },
    {
      "id": "uuid-string-2",
      "organizationName": "Chittagong Medical Association",
      "fatherName": "Dr. Karim Uddin",
      "message": "Monthly meeting reminder for all members...",
      "createdAt": "2026-05-10T14:20:00.000Z",
      "updatedAt": "2026-05-10T14:20:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## 4. Get Single Message (Public)

**Method:** GET
**URL:** `/messages/:id`

**Response:**
```json
{
  "id": "uuid-string",
  "organizationName": "Dhaka Medical Association",
  "fatherName": "Dr. Ahmed Rahman",
  "message": "We are pleased to announce the upcoming annual medical conference scheduled for next month. All members are requested to attend the meeting on 15th June 2024 at the BMA auditorium.",
  "createdAt": "2026-05-11T15:30:00.000Z",
  "updatedAt": "2026-05-11T15:30:00.000Z"
}
```

---

## 5. Delete Message (Admin Only)

**Method:** DELETE
**URL:** `/messages/:id`
**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Search Examples

### Search by Organization Name
```
GET /messages?search=Dhaka&page=1&limit=5
```

### Search by Father Name
```
GET /messages?search=Ahmed&page=1&limit=5
```

### Search by Message Content
```
GET /messages?search=conference&page=1&limit=5
```

### Pagination
```
GET /messages?page=2&limit=10
```

---

## Error Responses

**400 Bad Request (Validation Error):**
```json
{
  "message": "organizationName should not be empty, organizationName must be longer than or equal to 2 characters, organizationName must be shorter than or equal to 200 characters",
  "error": "Bad Request",
  "statusCode": 400
}
```

**400 Bad Request (Invalid UUID):**
```json
{
  "message": "Invalid uuid format",
  "error": "Bad Request",
  "statusCode": 400
}
```

**401 Unauthorized:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**404 Not Found:**
```json
{
  "message": "Message not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Validation Rules

### CreateMessageDto Validation:
- `organizationName`: Required, string, min 2 characters, max 200 characters
- `fatherName`: Required, string, min 2 characters, max 200 characters  
- `message`: Required, string, min 5 characters

### UpdateMessageDto Validation:
- All fields are optional
- Same validation rules as CreateMessageDto when provided

### Query Parameters:
- `page`: Optional, number, min 1, default 1
- `limit`: Optional, number, min 1, max 100, default 10
- `search`: Optional, string, searches in organizationName, fatherName, and message fields

---

## Testing Tips

1. Use valid UUID for message ID parameter
2. Include JWT token for admin operations
3. Test validation by sending invalid data
4. Test pagination with different page and limit values
5. Test search functionality with different search terms
6. All timestamps are in ISO 8601 format
7. Messages are ordered by createdAt in descending order (newest first)
