# Multi-User Data Isolation Implementation Guide

## Overview

This document provides a comprehensive guide to the multi-user data isolation implementation for the Portfolio Manager application. The system has been redesigned to support multiple users with secure, isolated data spaces.

## Architecture Changes

### 1. Database Schema Updates

#### New Tables/Modifications:

**Portfolios Table** (New)
```sql
CREATE TABLE portfolios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    current_cost DECIMAL(19,4),
    current_value DECIMAL(19,4),
    total_cost DECIMAL(19,4),
    annual_income DECIMAL(19,4),
    total_income DECIMAL(19,4),
    realized_result DECIMAL(19,4),
    total_return DECIMAL(19,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Transactions Table** (Modified)
- **Added Column**: `user_id BIGINT NOT NULL` - Foreign key to users table
- **Index**: Added composite index on `(user_id, symbol)` for fast lookups

**Stocks Table** (Unchanged)
- Stocks remain global reference data accessible to all users

**Users Table** (Existing)
- No changes required; already has proper structure

### 2. Entity Updates

#### TransactionEntity
```java
// New field added
@Column(name = "user_id", nullable = false)
private Long userId;

// Constructor for user context
public TransactionEntity(Long userId) {
    this.userId = userId;
}

// Getters and setters
public Long getUserId() { return userId; }
public void setUserId(Long userId) { this.userId = userId; }
```

#### PortfolioEntity (New)
```java
@Entity
@Table(name = "portfolios")
public class PortfolioEntity {
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;
    
    // Stores portfolio summary metrics
    private BigDecimal currentCost;
    private BigDecimal currentValue;
    private BigDecimal totalCost;
    private BigDecimal annualIncome;
    private BigDecimal totalIncome;
    private BigDecimal realizedResult;
    private BigDecimal totalReturn;
    
    // Portfolio metadata
    private String name;
    private String description;
    
    // Timestamps for audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 3. Repository Layer

#### TransactionRepository (Updated)
New user-scoped query methods:
```java
List<TransactionEntity> findByUserIdOrderByDateAsc(Long userId);
List<TransactionEntity> findByUserIdAndSymbol(Long userId, String symbol);
List<TransactionEntity> findByUserId(Long userId);
Optional<TransactionEntity> findByIdAndUserId(Integer id, Long userId);
```

#### PortfolioRepository (New)
```java
@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioEntity, Long> {
    Optional<PortfolioEntity> findByUserId(Long userId);
}
```

### 4. Service Layer

#### TransactionService (Enhanced)
New user-scoped methods:
```java
public List<TransactionEntity> getUserTransactions(Long userId)
public TransactionEntity createUserTransaction(Long userId, TransactionDTO dto)
public TransactionEntity getUserTransactionById(Long userId, Integer id)
public void deleteUserTransaction(Long userId, Integer id)
public List<TransactionEntity> getUserTransactionsBySymbol(Long userId, String symbol)
```

#### PortfolioService (New)
```java
public PortfolioEntity getOrCreateUserPortfolio(Long userId)
public PortfolioEntity getUserPortfolio(Long userId)
public PortfolioEntity updatePortfolioMetrics(Long userId, ...)
public PortfolioEntity updatePortfolioName(Long userId, String name)
public PortfolioEntity updatePortfolioDescription(Long userId, String description)
```

### 5. Security & Authorization

#### SecurityUtils (New)
Utility class for extracting user context from Spring Security:
```java
public class SecurityUtils {
    public static String getCurrentUserGoogleId()
    public static Long getCurrentUserId(UserRepository userRepository)
    public static boolean isUserAuthenticated()
    
    public static class SecurityException extends RuntimeException { ... }
}
```

All controllers now call `SecurityUtils.getCurrentUserId(userRepository)` to:
1. Extract authenticated user from Spring Security context
2. Validate user exists in database
3. Return user ID for data filtering

### 6. Controller Updates

All controllers now enforce user authorization:

#### TransactionController
```java
@GetMapping
public List<TransactionDTO> getAllTransactions(...) {
    Long userId = SecurityUtils.getCurrentUserId(userRepository);
    // Returns only transactions for this user
}

@PostMapping
public TransactionDTO createTransaction(@RequestBody TransactionDTO dto) {
    Long userId = SecurityUtils.getCurrentUserId(userRepository);
    // Creates transaction for this user only
}

@DeleteMapping("/{id}")
public void deleteTransaction(@PathVariable int id) {
    Long userId = SecurityUtils.getCurrentUserId(userRepository);
    // Verifies ownership before deletion
}
```

#### PortfolioController
```java
@GetMapping("/metadata")
public PortfolioEntity getPortfolioMetadata() {
    Long userId = SecurityUtils.getCurrentUserId(userRepository);
    // Returns portfolio metadata for this user
}
```

## Data Isolation Guarantees

### 1. Transaction Isolation
- **Read Isolation**: Users can only read their own transactions
- **Write Isolation**: Users can only create transactions for themselves
- **Delete Isolation**: Users can only delete their own transactions
- **Query Scope**: All repository queries filtered by user_id

### 2. Portfolio Isolation
- **One Portfolio Per User**: Unique constraint on (user_id) in portfolios table
- **Metrics Isolation**: Each user has independent portfolio metrics
- **Update Isolation**: Users can only update their own portfolio

### 3. Stock Data (Non-Isolated)
- **Global Reference**: Stocks are shared across all users
- **No User Context Required**: Stock endpoints don't filter by user
- **Authentication Only**: Users must be authenticated but can access all stocks

## Migration Strategy

### Step 1: Database Migration
Use Hibernate's `ddl-auto=update` (already configured) to:
1. Create `portfolios` table
2. Add `user_id` column to `transactions` table
3. Add composite index on `(transactions.user_id, transactions.symbol)`

### Step 2: Data Migration for Existing Transactions
If you have existing transactions without user_id:

**Option A: Assign to Admin User**
```sql
UPDATE transactions 
SET user_id = 1 
WHERE user_id IS NULL;
```

**Option B: Assign to Default Users**
```sql
-- Assuming User 1 is the admin
UPDATE transactions 
SET user_id = 1 
WHERE user_id IS NULL;
```

**Option C: Ask Users to Re-import**
- Document the process for users
- Provide data export/import utilities
- Create new transactions with their user context

### Step 3: Verify Migration
```sql
-- Verify all transactions have user_id
SELECT COUNT(*) FROM transactions WHERE user_id IS NULL;
-- Should return 0

-- Verify portfolios created
SELECT * FROM portfolios;
-- Should have one entry per active user
```

## Security Considerations

### 1. Authentication
- All endpoints require valid OAuth2 token from Google
- User must be logged in via Google OAuth2
- User record must exist in database

### 2. Authorization
- Every data access call extracts user ID from security context
- All queries filtered by user_id at repository level
- Unauthorized access throws `IllegalArgumentException`

### 3. SQL Injection Prevention
- Using JPA repositories (parameterized queries)
- No direct SQL construction
- Hibernate handles parameter binding

### 4. Session Management
- Spring Security handles session management
- Logout clears security context
- User context automatically validated on each request

## Testing

### Unit Tests
Test cases in `DataIsolationTests.java`:

1. **testUser1CannotSeeUser2Transactions()**
   - Verifies user isolation at repository level
   - Ensures queries return only user's data

2. **testUser1TransactionsIsolatedFromUser2()**
   - Multiple users with different transactions
   - Verifies independent data sets

3. **testUnauthorizedAccessToUser2Transaction()**
   - User 1 attempts to access User 2's transaction
   - Throws exception with "unauthorized" message

4. **testUser1CannotDeleteUser2Transaction()**
   - Deletion authorization check
   - Verifies data remains after unauthorized delete attempt

5. **testTransactionsBySymbolAreUserScoped()**
   - Multiple users, same symbol
   - Verifies symbol queries are user-scoped

6. **testMultipleUsersCanHaveSameSymbol()**
   - Concurrent transactions from different users
   - Verifies count isolation

7. **testTransactionOrderingByDate()**
   - Verify transactions returned in chronological order
   - Within user scope

8. **testAuthenticationRequired()**
   - Unauthenticated requests rejected
   - Returns 401 Unauthorized

### Running Tests
```bash
mvn test -Dtest=DataIsolationTests
```

## API Endpoints

### Authenticated Endpoints (User-Scoped)

**Transactions**
- `GET /api/transactions` - List user's transactions
- `GET /api/transactions/{id}` - Get user's specific transaction
- `POST /api/transactions` - Create transaction for user
- `DELETE /api/transactions/{id}` - Delete user's transaction

**Portfolio**
- `GET /api/portfolio` - Get portfolio summary
- `GET /api/portfolio/metadata` - Get portfolio metadata
- `GET /api/portfolio/positions` - List user's positions
- `PUT /api/portfolio/metadata/name` - Update portfolio name
- `PUT /api/portfolio/metadata/description` - Update portfolio description

**Stocks** (Reference Data)
- `GET /api/stocks` - List all stocks
- `GET /api/stocks/{symbol}` - Get stock details
- `GET /api/stocks/search` - Search for stock

### Public Endpoints (No Authentication)
- Auth endpoints still accept unauthenticated requests for login flow

## Frontend Updates

### API Service
The `services/api.ts` already has proper structure. Ensure all calls:
1. Include auth token (handled by axios interceptors)
2. Expect user-scoped responses
3. Handle 401/403 errors appropriately

### Components
Components should:
1. Verify user is logged in via AuthContext
2. Display only user's data
3. Handle authorization errors gracefully

## Rollback Strategy

If you need to rollback to non-isolated mode:

1. **Keep Both Code Paths**: Maintain legacy methods in services
2. **Feature Flag**: Use configuration to toggle isolation
3. **Gradual Migration**: Migrate users progressively
4. **Data Backup**: Keep backup before migration

## Performance Considerations

### Indexes
Added indexes for fast queries:
```sql
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_symbol ON transactions(user_id, symbol);
CREATE UNIQUE INDEX idx_portfolio_user_id ON portfolios(user_id);
```

### Query Optimization
- Transactions filtered at repository level (before application)
- Minimal data transferred over network
- Pagination supported for large result sets

### Caching
Consider adding caching for:
```java
@Cacheable("userTransactions")
public List<TransactionEntity> getUserTransactions(Long userId)
```

## Troubleshooting

### Issue: "No authenticated user found"
**Cause**: User not logged in or session expired
**Solution**: 
1. Clear browser cookies
2. Log in again via Google OAuth2
3. Verify user record exists in database

### Issue: "Transaction not found or unauthorized"
**Cause**: Accessing transaction owned by different user
**Solution**:
1. Verify user_id in transaction matches current user
2. Check if user is logged in as correct account
3. Verify user_id was properly set during transaction creation

### Issue: Users see all transactions
**Cause**: `user_id` filtering not applied
**Solution**:
1. Verify `SecurityUtils.getCurrentUserId()` is called
2. Check repository queries use `findByUserId()` methods
3. Verify Spring Security is properly configured

## Future Enhancements

1. **Portfolio Sharing**: Allow users to share portfolios with read-only access
2. **Multi-Portfolio Support**: Let users manage multiple portfolios
3. **Audit Logging**: Track who accessed what and when
4. **Data Export**: User-specific export functionality
5. **Backup/Restore**: User-initiated data backup
6. **Role-Based Access**: Support admin role with override capabilities

## Compliance & Standards

### GDPR Compliance
- Users can access only their own data
- Users can request data export
- Users can request data deletion

### Data Residency
- All user data stays within database
- No cross-user data sharing
- Audit logs for compliance

### Security Standards
- OAuth2 for authentication (industry standard)
- SQL injection prevention (parameterized queries)
- HTTPS required for production
- Session timeout enforced

## Support & Documentation

For additional help:
1. Check security logs for access patterns
2. Review test cases for usage examples
3. Check API documentation for endpoint details
4. Monitor database logs for query execution
