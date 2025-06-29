# REST API Documentation

A comprehensive guide to the REST API interface, standards, and best practices.

## Table of Contents

- [Overview](#overview)
- [Base URL & Versioning](#base-url--versioning)
- [Authentication](#authentication)
- [HTTP Methods](#http-methods)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Status Codes](#status-codes)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Filtering & Querying](#filtering--querying)
- [Rate Limiting](#rate-limiting)
- [Content Negotiation](#content-negotiation)
- [CORS](#cors)
- [Examples](#examples)

## Overview

This API follows RESTful principles and uses JSON for data exchange. All endpoints are designed to be intuitive, consistent, and follow industry best practices.

### Key Principles

- **Stateless**: Each request contains all information needed to process it
- **Resource-based**: URLs represent resources, not actions
- **HTTP Methods**: Use appropriate HTTP verbs for operations
- **Consistent**: Uniform interface across all endpoints
- **Cacheable**: Responses include appropriate cache headers

## Base URL & Versioning

### Base URL
```
https://api.example.com/v1
```

### Versioning Strategy

**URL Path Versioning** (Recommended)
```
GET /v1/users
GET /v2/users
```

**Header Versioning** (Alternative)
```
GET /users
Accept: application/vnd.api+json;version=1
```

### Version Lifecycle
- **v1**: Current stable version
- **v2**: Next version (in development)
- **Deprecation**: 6-month notice before removal

## Authentication

### Bearer Token Authentication
```http
Authorization: Bearer <jwt_token>
```

### API Key Authentication (Alternative)
```http
X-API-Key: <api_key>
```

### Authentication Flow
1. **Login**: `POST /auth/login` → Returns JWT token
2. **Refresh**: `POST /auth/refresh` → Returns new JWT token
3. **Logout**: `POST /auth/logout` → Invalidates token

## HTTP Methods

| Method | Purpose | Request Body | Response Body | Idempotent |
|--------|---------|--------------|---------------|------------|
| `GET` | Retrieve resource(s) | No | Yes | Yes |
| `POST` | Create new resource | Yes | Yes | No |
| `PUT` | Update entire resource | Yes | Yes | Yes |
| `PATCH` | Partial update | Yes | Yes | No |
| `DELETE` | Remove resource | No | Optional | Yes |
| `HEAD` | Get headers only | No | No | Yes |
| `OPTIONS` | Get allowed methods | No | Yes | Yes |

### Method Usage Examples

```http
GET    /users           # List all users
GET    /users/123       # Get specific user
POST   /users           # Create new user
PUT    /users/123       # Update entire user
PATCH  /users/123       # Update user fields
DELETE /users/123       # Delete user
```

## Request Format

### Content Type
```http
Content-Type: application/json
```

### Request Structure
```json
{
  "data": {
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### URL Structure
```
/{version}/{resource}/{id}/{sub-resource}
```

Examples:
```
/v1/users
/v1/users/123
/v1/users/123/posts
/v1/users/123/posts/456
```

## Response Format

### Success Response Structure
```json
{
  "success": true,
  "data": {
    "id": "123",
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "relationships": {
      "posts": {
        "links": {
          "self": "/v1/users/123/posts"
        }
      }
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### Collection Response Structure
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "type": "user",
      "attributes": { /* user data */ }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    },
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "links": {
    "self": "/v1/users?page=1&limit=20",
    "first": "/v1/users?page=1&limit=20",
    "last": "/v1/users?page=8&limit=20",
    "next": "/v1/users?page=2&limit=20",
    "prev": null
  }
}
```

## Status Codes

### Success Codes
| Code | Description | Usage |
|------|-------------|-------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `202` | Accepted | Async operation started |
| `204` | No Content | Successful DELETE |

### Client Error Codes
| Code | Description | Usage |
|------|-------------|-------|
| `400` | Bad Request | Invalid request format |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Access denied |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource conflict |
| `422` | Unprocessable Entity | Validation errors |
| `429` | Too Many Requests | Rate limit exceeded |

### Server Error Codes
| Code | Description | Usage |
|------|-------------|-------|
| `500` | Internal Server Error | Unexpected server error |
| `502` | Bad Gateway | Upstream service error |
| `503` | Service Unavailable | Temporary unavailability |

## Error Handling

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      },
      {
        "field": "age",
        "code": "OUT_OF_RANGE",
        "message": "Age must be between 18 and 120"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_12345"
  }
}
```

### Standard Error Codes
```json
{
  "VALIDATION_ERROR": "Request validation failed",
  "AUTHENTICATION_ERROR": "Authentication failed",
  "AUTHORIZATION_ERROR": "Access denied",
  "RESOURCE_NOT_FOUND": "Requested resource not found",
  "RESOURCE_CONFLICT": "Resource already exists",
  "RATE_LIMIT_EXCEEDED": "Too many requests",
  "INTERNAL_ERROR": "Internal server error"
}
```

### Validation Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "code": "REQUIRED",
        "message": "Email is required"
      },
      {
        "field": "password",
        "code": "MIN_LENGTH",
        "message": "Password must be at least 8 characters",
        "constraint": { "minLength": 8 }
      }
    ]
  }
}
```

## Pagination

### Query Parameters
```
GET /users?page=2&limit=20&sort=createdAt&order=desc
```

### Parameters
- `page`: Page number (1-based, default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (default: `id`)
- `order`: Sort direction (`asc` or `desc`, default: `asc`)

### Single Field Sorting
```
GET /users?page=1&limit=10&sort=name&order=asc
GET /users?page=1&limit=10&sort=createdAt&order=desc
GET /users?page=1&limit=10&sort=email&order=asc
```

### Multi-Field Sorting
```
GET /users?page=1&limit=10&sort[]=name:asc&sort[]=createdAt:desc
GET /users?page=1&limit=10&sort=name,createdAt&order=asc,desc
```

### Pagination with Sorting Response
```json
{
  "data": [
    {
      "id": "456",
      "type": "user",
      "attributes": {
        "name": "Alice Smith",
        "email": "alice@example.com",
        "createdAt": "2024-01-20T15:30:00Z"
      }
    },
    {
      "id": "123",
      "type": "user",
      "attributes": {
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": true
    },
    "sorting": {
      "field": "createdAt",
      "order": "desc"
    }
  },
  "links": {
    "self": "/v1/users?page=2&limit=20&sort=createdAt&order=desc",
    "first": "/v1/users?page=1&limit=20&sort=createdAt&order=desc",
    "last": "/v1/users?page=8&limit=20&sort=createdAt&order=desc",
    "next": "/v1/users?page=3&limit=20&sort=createdAt&order=desc",
    "prev": "/v1/users?page=1&limit=20&sort=createdAt&order=desc"
  }
}
```

### Multi-Field Sorting Response
```json
{
  "data": [ /* sorted items */ ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    },
    "sorting": [
      {
        "field": "name",
        "order": "asc"
      },
      {
        "field": "createdAt",
        "order": "desc"
      }
    ]
  },
  "links": {
    "self": "/v1/users?page=1&limit=10&sort[]=name:asc&sort[]=createdAt:desc",
    "next": "/v1/users?page=2&limit=10&sort[]=name:asc&sort[]=createdAt:desc"
  }
}
```

### Combined with Filtering and Sorting
```
GET /users?page=1&limit=10&filter[status]=active&sort=name&order=asc
```

**Response maintains all query parameters in links:**
```json
{
  "data": [ /* filtered and sorted items */ ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    },
    "sorting": {
      "field": "name",
      "order": "asc"
    },
    "filters": {
      "status": "active"
    }
  },
  "links": {
    "self": "/v1/users?page=1&limit=10&filter[status]=active&sort=name&order=asc",
    "next": "/v1/users?page=2&limit=10&filter[status]=active&sort=name&order=asc",
    "last": "/v1/users?page=3&limit=10&filter[status]=active&sort=name&order=asc"
  }
}
```

### Cursor-Based Pagination (Alternative)
```json
{
  "data": [ /* items */ ],
  "meta": {
    "pagination": {
      "limit": 20,
      "hasNext": true,
      "hasPrev": true
    }
  },
  "links": {
    "next": "/v1/users?cursor=eyJpZCI6MTIzfQ&limit=20",
    "prev": "/v1/users?cursor=eyJpZCI6MTAwfQ&limit=20"
  }
}
```

## Filtering & Querying

### Basic Filtering
```
GET /users?status=active&role=admin
```

### Advanced Filtering
```
GET /users?filter[name][like]=john&filter[age][gte]=18&filter[age][lte]=65
```

### Search
```
GET /users?search=john&searchFields=name,email
```

### Inclusion of Related Resources
```
GET /users?include=posts,comments
GET /users/123?include=posts.comments
```

### Field Selection (Sparse Fieldsets)
```
GET /users?fields[user]=name,email&fields[post]=title
```

### Filter Operators
| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `filter[status][eq]=active` |
| `ne` | Not equal | `filter[status][ne]=inactive` |
| `gt` | Greater than | `filter[age][gt]=18` |
| `gte` | Greater than or equal | `filter[age][gte]=18` |
| `lt` | Less than | `filter[age][lt]=65` |
| `lte` | Less than or equal | `filter[age][lte]=65` |
| `like` | Contains | `filter[name][like]=john` |
| `in` | In array | `filter[status][in]=active,pending` |
| `nin` | Not in array | `filter[status][nin]=deleted,banned` |

## Rate Limiting

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

### Rate Limit Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "resetAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

### Rate Limiting Strategies
- **Per API Key**: 10,000 requests/hour
- **Per IP**: 1,000 requests/hour
- **Per User**: 5,000 requests/hour

## Content Negotiation

### Accept Headers
```http
Accept: application/json
Accept: application/xml
Accept: application/vnd.api+json
```

### Content-Type Response
```http
Content-Type: application/json; charset=utf-8
```

### Compression
```http
Accept-Encoding: gzip, deflate
Content-Encoding: gzip
```

## CORS

### Allowed Origins
```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
Access-Control-Max-Age: 86400
```

### Preflight Request
```http
OPTIONS /v1/users HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

## Examples

### Create User
```http
POST /v1/users
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
  }
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Get Users with Filtering
```http
GET /v1/users?filter[status]=active&sort=createdAt&order=desc&page=1&limit=10
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "type": "user",
      "attributes": {
        "name": "John Doe",
        "email": "john@example.com",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "links": {
    "self": "/v1/users?filter[status]=active&sort=createdAt&order=desc&page=1&limit=10",
    "next": "/v1/users?filter[status]=active&sort=createdAt&order=desc&page=2&limit=10"
  }
}
```

### Update User
```http
PATCH /v1/users/123
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "type": "user",
    "attributes": {
      "name": "John Smith"
    }
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "type": "user",
    "attributes": {
      "name": "John Smith",
      "email": "john@example.com",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

### Validation Error Example
```http
POST /v1/users
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "type": "user",
    "attributes": {
      "name": "",
      "email": "invalid-email"
    }
  }
}
```

**Response: 422 Unprocessable Entity**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "name",
        "code": "REQUIRED",
        "message": "Name is required"
      },
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_12345"
  }
}
```

---

## Implementation Notes

### NestJS Integration

This documentation can be implemented in NestJS using:

- **Decorators**: `@Get()`, `@Post()`, `@Body()`, `@Query()`, `@Param()`
- **DTOs**: For request/response validation
- **Interceptors**: For response formatting
- **Guards**: For authentication/authorization
- **Filters**: For error handling
- **Swagger**: For API documentation generation

### Best Practices Summary

1. **Use HTTP status codes correctly**
2. **Implement consistent error handling**
3. **Provide meaningful error messages**
4. **Support pagination for collections**
5. **Use proper HTTP methods**
6. **Version your API**
7. **Implement rate limiting**
8. **Support filtering and sorting**
9. **Use HTTPS in production**
10. **Document your API thoroughly** 
