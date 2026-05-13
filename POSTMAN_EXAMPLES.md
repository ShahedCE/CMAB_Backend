# CMAB Archive API - Postman Collection Examples

## Base URL
```
http://localhost:3000/archives
```

## Authentication
All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Create Souvenir Archive

**Method:** POST
**URL:** `/archives`
**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
title: "CMAB Souvenir 2024"
category: "souvenir"
year: "2024"
description: "Annual CMAB souvenir publication for the year 2024 featuring all activities and achievements."
coverImage: [file: souvenir-cover.jpg]
file: [file: cmab-souvenir-2024.pdf]
isPublished: "true"
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "CMAB Souvenir 2024",
  "category": "souvenir",
  "year": "2024",
  "description": "Annual CMAB souvenir publication for the year 2024 featuring all activities and achievements.",
  "coverImageUrl": "/uploads/archive/filename.jpg",
  "fileUrl": "/uploads/archive/filename.pdf",
  "isPublished": true,
  "createdAt": "2026-05-10T16:00:00.000Z",
  "updatedAt": "2026-05-10T16:00:00.000Z"
}
```

---

## 2. Create Committee Archive

**Method:** POST
**URL:** `/archives`
**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
title: "CMAB Executive Committee 2023-2024"
category: "committee"
year: "2023-2024"
description: "Executive committee members for the session 2023-2024"
coverImage: [file: committee-group-photo.jpg]
membersJson: ation\":\"Vice President\",\"photoUrl\":\"/uploads/archive/vice-president.jp"[{\"name\":\"Dr. Ahmed Rahman\",\"designation\":\"President\",\"photoUrl\":\"/uploads/archive/president.jpg\"},{\"name\":\"Prof. Fatema Khatun\",\"designg\"},{\"name\":\"Mr. Karim Uddin\",\"designation\":\"General Secretary\",\"photoUrl\":\"/uploads/archive/secretary.jpg\"}]"
isPublished: "true"
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "CMAB Executive Committee 2023-2024",
  "category": "committee",
  "year": "2023-2024",
  "description": "Executive committee members for the session 2023-2024",
  "coverImageUrl": "/uploads/archive/filename.jpg",
  "membersJson": [
    {
      "name": "Dr. Ahmed Rahman",
      "designation": "President",
      "photoUrl": "/uploads/archive/president.jpg"
    },
    {
      "name": "Prof. Fatema Khatun",
      "designation": "Vice President",
      "photoUrl": "/uploads/archive/vice-president.jpg"
    },
    {
      "name": "Mr. Karim Uddin",
      "designation": "General Secretary",
      "photoUrl": "/uploads/archive/secretary.jpg"
    }
  ],
  "isPublished": true,
  "createdAt": "2026-05-10T16:00:00.000Z",
  "updatedAt": "2026-05-10T16:00:00.000Z"
}
```

---

## 3. Create Photo Album Archive

**Method:** POST
**URL:** `/archives`
**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
title: "Dhaka Division Annual Meet 2024"
category: "photo_album"
division: "Dhaka"
date: "2024-03-15"
caption: "Annual meeting and photo session of Dhaka Division members"
description: "Complete photo coverage of Dhaka Division annual meeting held on March 15, 2024 at Bangladesh Medical Association premises."
coverImage: [file: album-cover.jpg]
images: [file: photo-1.jpg, photo-2.jpg, photo-3.jpg]
imagesJson: "[{\"imageUrl\":\"/uploads/archive/photo-1.jpg\",\"caption\":\"Opening session\",\"date\":\"2024-03-15\"},{\"imageUrl\":\"/uploads/archive/photo-2.jpg\",\"caption\":\"Executive committee meeting\",\"date\":\"2024-03-15\"},{\"imageUrl\":\"/uploads/archive/photo-3.jpg\",\"caption\":\"Group photo session\",\"date\":\"2024-03-15\"}]"
isPublished: "true"
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Dhaka Division Annual Meet 2024",
  "category": "photo_album",
  "division": "Dhaka",
  "date": "2024-03-15",
  "caption": "Annual meeting and photo session of Dhaka Division members",
  "description": "Complete photo coverage of Dhaka Division annual meeting held on March 15, 2024 at Bangladesh Medical Association premises.",
  "coverImageUrl": "/uploads/archive/filename.jpg",
  "imagesJson": [
    {
      "imageUrl": "/uploads/archive/photo-1.jpg",
      "caption": "Opening session",
      "date": "2024-03-15"
    },
    {
      "imageUrl": "/uploads/archive/photo-2.jpg",
      "caption": "Executive committee meeting",
      "date": "2024-03-15"
    },
    {
      "imageUrl": "/uploads/archive/photo-3.jpg",
      "caption": "Group photo session",
      "date": "2024-03-15"
    }
  ],
  "isPublished": true,
  "createdAt": "2026-05-10T16:00:00.000Z",
  "updatedAt": "2026-05-10T16:00:00.000Z"
}
```

---

## 4. Get All Archives (Public)

**Method:** GET
**URL:** `/archives`

**Query Parameters (Optional):**
```
page: 1
limit: 10
category: souvenir
division: Dhaka
year: 2024
isPublished: true
search: CMAB
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "title": "CMAB Souvenir 2024",
      "category": "souvenir",
      "year": "2024",
      "description": "Annual CMAB souvenir publication...",
      "coverImageUrl": "/uploads/archive/filename.jpg",
      "fileUrl": "/uploads/archive/filename.pdf",
      "isPublished": true,
      "createdAt": "2026-05-10T16:00:00.000Z",
      "updatedAt": "2026-05-10T16:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 5. Get Single Archive (Public)

**Method:** GET
**URL:** `/archives/:id`

**Response:**
```json
{
  "id": "uuid-string",
  "title": "CMAB Souvenir 2024",
  "category": "souvenir",
  "year": "2024",
  "description": "Annual CMAB souvenir publication...",
  "coverImageUrl": "/uploads/archive/filename.jpg",
  "fileUrl": "/uploads/archive/filename.pdf",
  "isPublished": true,
  "createdAt": "2026-05-10T16:00:00.000Z",
  "updatedAt": "2026-05-10T16:00:00.000Z",
  "createdByAdmin": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@cmab.org"
  }
}
```

---

## 6. Update Archive (Admin Only)

**Method:** PATCH
**URL:** `/archives/:id`
**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data (Example - Update Souvenir):**
```
title: "Updated CMAB Souvenir 2024"
description: "Updated description for the annual CMAB souvenir publication."
coverImage: [file: new-cover.jpg]
isPublished: "true"
```

---

## 7. Delete Archive (Admin Only)

**Method:** DELETE
**URL:** `/archives/:id`
**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Archive deleted successfully"
}
```

---

## File Upload Notes

1. **Supported File Types:** 
   - Images: jpg, jpeg, png, gif, webp
   - Documents: pdf (for souvenirs)

2. **File Size Limit:** Depends on your multer configuration

3. **File Storage:** All files are stored in `uploads/archive/` directory

4. **File Naming:** Files are automatically renamed with timestamp and random number to avoid conflicts

5. **Multiple Images:** You can upload up to 10 images at once using the `images` field

---

## Error Responses

**400 Bad Request:**
```json
{
  "message": "Invalid imagesJson format",
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
  "message": "Archive not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Testing Tips

1. Use Postman's form-data option for file uploads
2. Make sure to set proper Content-Type header for multipart/form-data
3. Test with valid JWT token for admin operations
4. Verify file paths in response match your server's upload directory structure
5. Test pagination and filtering with different query parameters
