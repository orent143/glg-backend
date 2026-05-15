# GLG Backend

## Environment variables

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Sample curl commands

### Public customer signup

```
curl -X POST http://localhost:3000/users/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@example.com\",\"password\":\"StrongPass123!\"}"
```

### Admin invite (pharmacist/admin)

```
curl -X POST http://localhost:3000/users/auth/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -d "{\"email\":\"pharmacist@example.com\",\"role\":\"pharmacist\"}"
```

### List auth users (admin only)

```
curl -X GET http://localhost:3000/users/auth-users \
  -H "Authorization: Bearer YOUR_ADMIN_JWT"
```

### Create auth user (admin only)

```
curl -X POST http://localhost:3000/users/auth-users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -d "{\"email\":\"admin2@example.com\",\"password\":\"StrongPass123!\",\"email_confirm\":true}"
```

