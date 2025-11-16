# 🔌 API Documentation - Meal Plan Pro

## 📋 Overview

The Meal Plan Pro API provides endpoints for recipe management, meal planning, user authentication, and data synchronization. The API follows RESTful principles and uses JWT authentication.

## 🔗 Base Configuration

```typescript
// API Configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // When authenticated
};
```

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "preferences": {
    "dietaryRestrictions": ["vegetarian"],
    "allergies": ["nuts"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {...}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {refresh_token}
```

## 🍳 Recipe Management

### Get All Recipes
```http
GET /api/recipes
Authorization: Bearer {token}
```

**Query Parameters:**
- `category` - Filter by category (breakfast, lunch, dinner, snack)
- `search` - Search by name or ingredients
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "id": 1,
      "name": "Avocado Toast",
      "image": "🥑",
      "time": "5 min",
      "servings": 1,
      "category": "Breakfast",
      "ingredients": ["2 slices whole grain bread", "1 ripe avocado"],
      "instructions": ["Toast bread slices", "Mash avocado"],
      "nutrition": {
        "calories": 250,
        "protein": 8,
        "carbs": 30,
        "fat": 12
      },
      "createdBy": 1,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "hasMore": true
}
```

### Get Recipe Details
```http
GET /api/recipes/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "recipe": {
    "id": 1,
    "name": "Avocado Toast",
    "image": "🥑",
    "time": "5 min",
    "servings": 1,
    "category": "Breakfast",
    "ingredients": ["2 slices whole grain bread", "1 ripe avocado"],
    "instructions": ["Toast bread slices", "Mash avocado"],
    "nutrition": {...},
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Delicious and easy!",
        "userName": "Jane Doe",
        "date": "2024-01-01T00:00:00Z"
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 10
  }
}
```

### Create Recipe
```http
POST /api/recipes
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Custom Smoothie",
  "image": "🥤",
  "time": "3 min",
  "servings": 1,
  "category": "Breakfast",
  "ingredients": ["1 banana", "1 cup almond milk", "1 tbsp honey"],
  "instructions": ["Blend all ingredients", "Serve immediately"],
  "nutrition": {
    "calories": 180,
    "protein": 4,
    "carbs": 35,
    "fat": 3
  }
}
```

### Update Recipe
```http
PUT /api/recipes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Recipe Name",
  "ingredients": ["updated", "ingredients", "list"]
}
```

### Delete Recipe
```http
DELETE /api/recipes/{id}
Authorization: Bearer {token}
```

## 📅 Meal Planning

### Get Meal Plan
```http
GET /api/meal-plans
Authorization: Bearer {token}
```

**Query Parameters:**
- `week` - Week offset (0 = current week, 1 = next week, -1 = last week)
- `startDate` - Specific start date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "mealPlan": {
    "weekOf": "2024-01-01",
    "meals": [
      {
        "id": 1,
        "recipeId": 1,
        "recipeName": "Avocado Toast",
        "day": "Monday",
        "mealTime": "Breakfast",
        "servings": 2,
        "image": "🥑",
        "time": "5 min"
      }
    ]
  }
}
```

### Add Meal to Plan
```http
POST /api/meal-plans
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipeId": 1,
  "recipeName": "Avocado Toast",
  "day": "Monday",
  "mealTime": "Breakfast",
  "servings": 2,
  "image": "🥑",
  "time": "5 min"
}
```

### Update Meal Plan Item
```http
PUT /api/meal-plans/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "day": "Tuesday",
  "mealTime": "Lunch",
  "servings": 3
}
```

### Remove Meal from Plan
```http
DELETE /api/meal-plans/{id}
Authorization: Bearer {token}
```

## 🛒 Shopping Lists

### Generate Shopping List
```http
POST /api/shopping-lists/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "weekOf": "2024-01-01",
  "mealIds": [1, 2, 3, 4, 5]
}
```

**Response:**
```json
{
  "success": true,
  "shoppingList": {
    "id": 1,
    "weekOf": "2024-01-01",
    "items": [
      {
        "ingredient": "2 slices whole grain bread",
        "category": "Bakery",
        "checked": false
      },
      {
        "ingredient": "1 ripe avocado",
        "category": "Produce",
        "checked": false
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Shopping List
```http
GET /api/shopping-lists/{id}
Authorization: Bearer {token}
```

### Update Shopping List Item
```http
PUT /api/shopping-lists/{id}/items/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "checked": true
}
```

## ⭐ Reviews & Ratings

### Add Review
```http
POST /api/recipes/{recipeId}/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Amazing recipe! Easy to follow and delicious."
}
```

### Get Recipe Reviews
```http
GET /api/recipes/{recipeId}/reviews
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` - Number of reviews (default: 10)
- `offset` - Pagination offset

## 🔍 Discovery

### Get Discover Recipes
```http
GET /api/discover/recipes
Authorization: Bearer {token}
```

**Query Parameters:**
- `category` - Filter by category
- `featured` - Get featured recipes only
- `trending` - Get trending recipes

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "id": 1,
      "name": "Trending Recipe",
      "image": "🍝",
      "time": "30 min",
      "servings": 4,
      "category": "Dinner",
      "featured": true,
      "trending": true,
      "averageRating": 4.8,
      "totalReviews": 25
    }
  ]
}
```

## 👤 User Profile

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "preferences": {
    "dietaryRestrictions": ["vegan"],
    "allergies": ["dairy", "nuts"],
    "favoriteCategories": ["breakfast", "dinner"]
  }
}
```

### Get Saved Recipes
```http
GET /api/users/saved-recipes
Authorization: Bearer {token}
```

### Save Recipe
```http
POST /api/users/saved-recipes
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipeId": 1
}
```

### Unsave Recipe
```http
DELETE /api/users/saved-recipes/{recipeId}
Authorization: Bearer {token}
```

## 📊 Analytics

### Get User Analytics
```http
GET /api/analytics/user
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalRecipesCreated": 5,
    "totalMealsPlanned": 28,
    "favoriteCategory": "Breakfast",
    "averageCookingTime": "25 min",
    "weeklyMealPlanCompletion": 85,
    "topIngredients": ["avocado", "chicken", "rice"]
  }
}
```

## 🔔 Notifications

### Get Notifications
```http
GET /api/notifications
Authorization: Bearer {token}
```

### Mark Notification as Read
```http
PUT /api/notifications/{id}/read
Authorization: Bearer {token}
```

### Update Notification Settings
```http
PUT /api/users/notification-settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "mealReminders": true,
  "shoppingListReminders": true,
  "newRecipeAlerts": false,
  "weeklyMealPlanReminder": true
}
```

## 🔧 API Client Implementation

### TypeScript API Service
```typescript
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Recipes
  async getRecipes(params?: RecipeQueryParams) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/recipes?${queryString}`);
  }

  async getRecipeDetails(id: string) {
    return this.request(`/recipes/${id}`);
  }

  // Meal Plans
  async getMealPlan(week?: number) {
    return this.request(`/meal-plans?week=${week || 0}`);
  }

  async addToMealPlan(mealData: MealPlanItem) {
    return this.request('/meal-plans', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes
- `AUTHENTICATION_REQUIRED` - 401 Unauthorized
- `FORBIDDEN` - 403 Forbidden
- `NOT_FOUND` - 404 Not Found
- `VALIDATION_ERROR` - 400 Bad Request
- `RATE_LIMIT_EXCEEDED` - 429 Too Many Requests
- `INTERNAL_ERROR` - 500 Internal Server Error

## 🔒 Security

### Authentication
- JWT tokens with expiration
- Refresh token mechanism
- Secure token storage

### Input Validation
- Server-side validation for all inputs
- Sanitization of user-generated content
- SQL injection prevention

### Rate Limiting
- API rate limiting per user
- Brute force protection
- DDoS protection

## 📈 Performance

### Caching
- Response caching for static data
- ETags for conditional requests
- CDN integration for assets

### Pagination
- Cursor-based pagination for large datasets
- Configurable page sizes
- Total count optimization

### Optimization
- Database query optimization
- Response compression
- Efficient data serialization