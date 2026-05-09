# Backend Architecture - Visual Reference Guide

## Current Architecture Issues

```
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS ROUTES                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ GET /employee/employeeList    ❌ NO AUTH            │   │
│  │ GET /employee/:empCode        ❌ NO AUTH            │   │
│  │ POST /hashAllEmpPassword      ❌ NO AUTH ⚠️DANGER  │   │
│  │ GET /equipment/equipmentList  ❌ NO AUTH            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ❌ Auth middleware imported but NOT USED
        ❌ Anyone can access all endpoints
        ❌ No password hashing protection


┌─────────────────────────────────────────────────────────────┐
│                  DATABASE CONNECTION                         │
│  encrypt: false  ❌ All data sent UNENCRYPTED               │
│  No caching      ❌ Auth queries DB every request           │
│  No batching     ❌ Password updates 1 per query (N+1)      │
└─────────────────────────────────────────────────────────────┘
```

---

## Recommended Architecture (Future State)

### Three-Tier Architecture with Security Layers

```
┌───────────────────────────────────────────────────────────────────────┐
│                          CLIENT REQUEST                               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ↓
┌───────────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (server.js)                          │
├───────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │           MIDDLEWARE LAYER (Security & Logging)                 │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  • CORS Middleware         ✓ Allow safe origins                │  │
│  │  • Logger Middleware       ✓ Add correlation IDs               │  │
│  │  • Request Validation      ✓ Input validation (joi)            │  │
│  │  • Rate Limiter           ✓ Prevent brute force attacks        │  │
│  │  • Auth Middleware        ✓ JWT verification + caching         │  │
│  │  • Error Handler          ✓ Centralized error responses        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │            ROUTING LAYER (Request Routing)                      │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  • GET    /api/auth/login        [Public]                      │  │
│  │  • GET    /api/employee/list     [Protected] ✓                 │  │
│  │  • GET    /api/employee/:code    [Protected] ✓                 │  │
│  │  • POST   /api/employee/hash     [Protected + Admin] ✓         │  │
│  │  • GET    /api/equipment/list    [Protected] ✓                 │  │
│  │  • GET    /api/health            [Public] Health check         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │          SERVICE LAYER (Business Logic)                         │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  • AuthService                                                  │  │
│  │    - login()              Validate credentials → generate JWT   │  │
│  │    - validateToken()      Cache-aware token validation          │  │
│  │                                                                 │  │
│  │  • EmployeeService                                              │  │
│  │    - getEmployeeList()    Pagination + search                  │  │
│  │    - getEmployeeByCode()  Single employee retrieval            │  │
│  │    - hashAllPasswords()   Batch operation (not N+1)            │  │
│  │                                                                 │  │
│  │  • EquipmentService                                             │  │
│  │    - getEquipmentList()   Pagination + search                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │       REPOSITORY LAYER (Data Access Abstraction)                │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  • BaseRepository                                               │  │
│  │    - query()              Execute parameterized queries         │  │
│  │    - batchUpdate()        Batch operations                      │  │
│  │    - cacheResult()        Cache management                      │  │
│  │                                                                 │  │
│  │  • AuthRepository                                               │  │
│  │    - getTokenByEmployee() Secure token lookup                   │  │
│  │    - saveToken()          Token persistence                     │  │
│  │                                                                 │  │
│  │  • EmployeeRepository     Database operations                   │  │
│  │  • EquipmentRepository    Database operations                   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │    DATABASE LAYER (SQL Server + Caching)                        │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────┐    ┌──────────────────────────┐   │  │
│  │  │    Primary DB Pool      │    │    Cache Layer (Redis)   │   │  │
│  │  │                         │    │                          │   │  │
│  │  │ • ITMIS Database        │    │ • Token validation       │   │  │
│  │  │   encrypt: true ✓       │    │ • Employee lists         │   │  │
│  │  │   pooling: enabled ✓    │    │ • Equipment lists        │   │  │
│  │  │                         │    │ • TTL: 5-60 minutes      │   │  │
│  │  │ • YET_Organization DB   │    └──────────────────────────┘   │  │
│  │  │   encrypt: true ✓       │                                   │  │
│  │  │   pooling: enabled ✓    │                                   │  │
│  │  └─────────────────────────┘                                   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              ↓                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │         LOGGING & MONITORING                                    │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  • Request Logs       Method, Path, Duration, Correlation ID   │  │
│  │  • Error Logs         Stack traces, correlation IDs            │  │
│  │  • Performance Logs   Query times, cache hits                  │  │
│  │  • Security Logs      Auth failures, suspicious requests       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Critical Security Improvements

### Before vs After

#### BEFORE: Unsecured Route
```javascript
❌ CURRENT
router.get('/employeeList', async (req, res, next) => {
    // Anyone can access - no authentication!
    const employees = await getEmployeeList(req.query);
    res.json(employees);
});
```

#### AFTER: Properly Secured Route
```javascript
✅ RECOMMENDED
router.use(auth);  // Apply to all routes
router.use(validateInput);  // Validate parameters

/**
 * Get employee list with pagination
 * @route GET /api/employee/list
 * @access Private (requires authentication)
 * @param {number} page - Page number
 * @param {number} pageSize - Records per page (max 500)
 * @param {string} search - Search term
 */
router.get('/list', validateQuery, async (req, res, next) => {
    try {
        const employees = await employeeService.getList(
            req.query,
            req.user.employeeCode  // From JWT
        );
        res.json(employees);
    } catch (error) {
        next(error);
    }
});
```

---

## Performance Optimization: Before & After

### Issue 1: N+1 Password Hashing

#### ❌ CURRENT (Slow: ~1000 queries for 1000 employees)
```javascript
const employees = await getEmployeeList();
for (let i = 0; i < employees.length; i++) {
    const hashedPassword = await bcrypt.hash(password, 10);
    // 1 UPDATE query per employee ❌
    await executeUpdateQuery(
        `UPDATE Employee SET Password='${hashedPassword}' 
         WHERE EmployeeCode='${employees[i].code}'`
    );
}
// Total: ~1000 database round-trips
// Time: ~30-60 seconds ⏱️
```

#### ✅ RECOMMENDED (Fast: 1 batch query)
```javascript
const employees = await getEmployeeList();
const hashedPassword = await bcrypt.hash(password, 10);

// Single batch UPDATE
const updateStatement = `
    UPDATE Employee 
    SET Password = @hashedPassword
    WHERE EmployeeCode IN (${employees.map(e => `'${e.code}'`).join(',')})
`;

await batchUpdate(updateStatement, { hashedPassword });
// Total: 1 database operation
// Time: ~1-2 seconds ⚡ (30x faster!)
```

---

### Issue 2: Auth Token Validation

#### ❌ CURRENT (Slow: DB query every request)
```javascript
// Middleware: Executes on EVERY request
async function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    // Query database every single time ❌
    const result = await sqlPool.request()
        .input('token', sql.VarChar, token)
        .query(`SELECT * FROM token WHERE token = @token`);
    
    if (!result.recordset[0]) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = result.recordset[0];
    next();
}

// For 100 requests/second: 100 DB queries/second ⏱️
```

#### ✅ RECOMMENDED (Fast: Cache + JWT verification)
```javascript
// Middleware: Cache-aware token validation
async function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    try {
        // 1. Verify JWT signature (instant, no DB) ⚡
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 2. Check cache first (Redis, instant) ⚡
        const cached = await cache.get(`token:${token}`);
        if (cached) {
            req.user = cached;
            return next();
        }
        
        // 3. Only query DB if needed (token new/expired from cache)
        const result = await tokenRepository.getByToken(token);
        if (!result) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        // 4. Cache for 5 minutes
        await cache.set(`token:${token}`, result, 300);
        
        req.user = result;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// For 100 requests/second: 100 cache hits/second (instant) ⚡
// DB hit only when cache expires (~1 per minute per token)
```

---

## Input Validation: Preventing Abuse

#### ❌ CURRENT: No Validation
```javascript
GET /api/employee/list?page=999999999&pageSize=999999999&search=<malicious>
// Problems:
// 1. Can request millions of records → Memory overflow → Crash
// 2. SQL injection via search parameter
// 3. DoS attack (request huge page size)
```

#### ✅ RECOMMENDED: Validated
```javascript
// Validation schema (joi)
const listSchema = joi.object({
    page: joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({ 'number.base': 'Page must be a number' }),
    
    pageSize: joi.number()
        .integer()
        .min(1)
        .max(500)  // Enforce maximum
        .default(10)
        .messages({ 'number.max': 'Max 500 records per request' }),
    
    search: joi.string()
        .max(100)  // Prevent huge search strings
        .allow('')
        .messages({ 'string.max': 'Search limited to 100 characters' })
});

// Middleware usage
router.get('/list', validate(listSchema), async (req, res, next) => {
    // Request is guaranteed valid here ✓
    const employees = await employeeService.getList(req.query);
    res.json(employees);
});

// Results:
// - Consistent, predictable results
// - No injection attacks possible
// - Memory safe
// - Better error messages
```

---

## Error Handling: Before & After

#### ❌ CURRENT: Generic but Opaque
```javascript
try {
    const result = await someQuery();
} catch (error) {
    // All errors return same message ❌
    return res.status(401).json({ message: 'Invalid token' });
}

// Problems:
// - Real errors hidden (debugging hard)
// - User can't distinguish error types
// - No logging for troubleshooting
```

#### ✅ RECOMMENDED: Structured with Logging
```javascript
try {
    const result = await someQuery();
} catch (error) {
    // Log detailed error server-side
    logger.error({
        correlationId: req.correlationId,
        message: error.message,
        stack: error.stack,
        userId: req.user?.id,
        endpoint: req.path
    });
    
    // Return generic message to client (security)
    res.status(500).json({
        message: 'An error occurred',
        correlationId: req.correlationId  // For support reference
    });
}

// Benefits:
// - Detailed logs for debugging ✓
// - No sensitive info leaked to client ✓
// - Support can search by correlation ID ✓
// - Security improved ✓
```

---

## File Structure Comparison

### Current Structure
```
Server/
├── index.js (mixed concerns)
├── db.js (database config only)
├── package.json
├── Middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── Routes/
│   ├── Auth/route.js
│   ├── Auth/Service/login.js
│   ├── Auth/Repository/sp_*.js
│   ├── Employee/route.js
│   ├── Employee/Service/*.js
│   ├── Employee/Repository/sp_*.js
│   └── [same for Equipment]
└── SQL/
    └── [stored procedures]

Issues:
❌ No centralized configuration
❌ No validators directory
❌ No utilities for logging/caching
❌ Middleware scattered with routes
❌ No constants definition
```

### Recommended Structure
```
Server/
├── src/
│   ├── app.js (Express setup)
│   ├── server.js (Entry point)
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── constants.js ✅ NEW
│   │   └── environment.js ✅ NEW
│   │
│   ├── middleware/
│   │   ├── auth.js (improved)
│   │   ├── errorHandler.js
│   │   ├── validation.js ✅ NEW
│   │   ├── logger.js ✅ NEW
│   │   └── rateLimit.js ✅ NEW
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── employee.js
│   │   ├── equipment.js
│   │   └── health.js ✅ NEW
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── employee.service.js
│   │   ├── equipment.service.js
│   │   └── token.service.js ✅ NEW
│   │
│   ├── repositories/
│   │   ├── base.repository.js ✅ NEW
│   │   ├── auth.repository.js
│   │   ├── employee.repository.js
│   │   └── equipment.repository.js
│   │
│   ├── validators/ ✅ NEW
│   │   ├── auth.validator.js
│   │   ├── employee.validator.js
│   │   └── equipment.validator.js
│   │
│   └── utils/ ✅ NEW
│       ├── logger.js
│       ├── cache.js
│       ├── jwt.js
│       └── response.js
│
├── .env
├── .env.example
├── package.json
└── README.md

Benefits:
✅ Clear separation of concerns
✅ Easy to find and update code
✅ Reusable middleware and utilities
✅ Scalable structure
✅ Better for team collaboration
```

---

## Dependencies to Add

### Critical (Must Have)
```json
{
  "joi": "^17.11.0",                    // Input validation
  "express-rate-limit": "^7.1.0",      // Rate limiting
  "uuid": "^9.0.1",                     // Unique IDs (if missing)
  "jsonwebtoken": "^9.1.2"              // JWT (make explicit)
}
```

### Recommended for Best Practices
```json
{
  "redis": "^4.6.11",                   // Token caching
  "dotenv": "^16.3.1",                  // Environment variables
  "winston": "^3.11.0",                 // Logging (better than console)
  "cors": "^2.8.5",                     // Already should be there
  "helmet": "^7.1.0"                    // Security headers
}
```

---

## Performance Benchmark Targets

### Current vs Target

| Operation | Current | Target | Improvement |
|-----------|---------|--------|-------------|
| Hash 1000 passwords | 30-60s | 1-2s | **30x faster** ⚡ |
| Auth check (DB hit) | 50-100ms | <1ms (cache) | **50-100x faster** ⚡ |
| Auth check (cache hit) | 50-100ms | <1ms | **50-100x faster** ⚡ |
| Get employee list | 100-200ms | 50-100ms | **2x faster** ⚡ |
| Error response | 50ms | <50ms | **Unchanged** |

---

## Testing Checklist for Security

### After Implementing Changes

```
Security Tests:
☐ Try accessing /employee/list without token → 401 Unauthorized
☐ Try accessing /employee/:code without token → 401 Unauthorized
☐ Try /employee/hashAllEmpPassword without admin → 403 Forbidden
☐ Try malicious pageSize=999999999 → Validated to max 500
☐ Try SQL injection in search parameter → Sanitized/parameterized
☐ Try 100 login attempts/sec → Rate limited after 5 attempts
☐ Verify database connection encrypted (wireshark or logs)
☐ Check correlation IDs in logs

Performance Tests:
☐ Hash 1000 passwords: should complete in <5 seconds
☐ Get 500 employees: should complete in <100ms
☐ 100 concurrent requests: should handle smoothly
☐ Cache hit rate: should be >80% for token validation

Code Quality Tests:
☐ All functions have JSDoc comments
☐ All error cases handled with try-catch
☐ No console.log statements (use logger)
☐ No hardcoded secrets in code
☐ All middleware properly chained
```

---

## Summary: Quick Action Items

### TODAY (30 minutes)
1. Add `router.use(auth);` to Employee routes
2. Add `router.use(auth);` to Equipment routes
3. Change `encrypt: false` → `encrypt: true`

### THIS WEEK (2-3 hours)
1. Add joi validation middleware
2. Add express-rate-limit
3. Fix error handling (generic messages)
4. Add logging middleware

### NEXT WEEK (3-4 hours)
1. Batch password updates
2. Add token caching with Redis
3. Create constants.js
4. Add JSDoc comments

### Result: Secure, Fast, Maintainable ✅
