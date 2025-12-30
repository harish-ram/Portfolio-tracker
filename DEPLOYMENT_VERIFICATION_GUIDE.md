# Deployment & Verification Guide - Multi-User Data Isolation

## Build Status

✅ **BUILD SUCCESS**
- All 90 source files compiled successfully
- Test classes compiled (6 test files)
- JAR artifact created: `portfolio-manager.jar`
- No compilation errors or warnings related to new code

## Pre-Deployment Checklist

### Code Quality
- [x] All source files compile without errors
- [x] SecurityUtils properly extracts user context
- [x] TransactionService enforces user isolation
- [x] All 5 controllers validate authentication
- [x] Repository methods filter by user_id
- [x] Database schema migration prepared
- [x] Test suite created (8 test scenarios)

### Database Preparation

Before deploying to production:

```sql
BACKUP DATABASE:
mysqldump -u root -p portfolio > backup_pre_multiuser_$(date +%Y%m%d_%H%M%S).sql

VERIFY BACKUP:
mysql -u root -p portfolio < backup_pre_multiuser_*.sql
```

## Deployment Steps

### Step 1: Stop Current Application
```bash
# If running
pkill -f "portfolio-manager.jar"
# Or via systemd
sudo systemctl stop portfolio-manager
```

### Step 2: Backup Current Database
```bash
mysqldump -u root -p portfolio > backup_pre_multiuser_$(date +%Y%m%d_%H%M%S).sql
```

### Step 3: Deploy New JAR
```bash
cp portfolio-manager/target/portfolio-manager.jar /opt/portfolio-manager/
chmod +x /opt/portfolio-manager/portfolio-manager.jar
```

### Step 4: Start Application
```bash
# Direct start
java -jar /opt/portfolio-manager/portfolio-manager.jar

# Or via systemd
sudo systemctl start portfolio-manager
```

### Step 5: Verify Application Startup
```bash
# Check logs for successful startup
tail -f /var/log/portfolio-manager.log

# Expected output:
# [INFO] Started Application in X.XXX seconds
# [INFO] Tomcat started on port 8080
```

## Automatic Database Migration

Hibernate will automatically:

1. **Create `portfolios` table**
   ```sql
   CREATE TABLE portfolios (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       user_id BIGINT NOT NULL UNIQUE,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id)
   )
   ```

2. **Modify `transactions` table**
   - Add `user_id BIGINT NOT NULL` column
   - Add foreign key constraint to users table
   - Add indices for performance

3. **Verify migration**
   ```sql
   SHOW CREATE TABLE transactions\G
   SHOW CREATE TABLE portfolios\G
   SHOW INDEX FROM transactions\G
   ```

## Post-Deployment Verification

### 1. Application Health Check

```bash
curl http://localhost:8080/api/auth/status
# Expected response:
{
  "authenticated": false,
  "message": "Not authenticated"
}
```

### 2. Database Verification

```sql
-- Verify new tables
SHOW TABLES;
-- Should show: portfolios table exists

-- Verify transactions structure
DESC transactions;
-- Should show: user_id column exists, NOT NULL

-- Verify indices
SHOW INDEX FROM transactions;
-- Should show: idx_transactions_user_id and idx_transactions_user_symbol

-- Verify users table
DESC users;
-- Should show: all original columns intact
```

### 3. Manual User Isolation Test

**Test Scenario: Two Users**

```bash
# Step 1: User 1 Login
curl -X GET http://localhost:8080/api/auth/user \
  -H "Authorization: Bearer USER1_GOOGLE_TOKEN"
# Note the user ID (e.g., id: 1)

# Step 2: User 1 Creates Transaction
curl -X POST http://localhost:8080/api/transactions \
  -H "Authorization: Bearer USER1_GOOGLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": '$(date +%s000)',
    "symbol": "AAPL",
    "type": "BUY",
    "noOfShares": 5,
    "price": 150,
    "cost": 10
  }'
# Note the transaction ID (e.g., id: 1)

# Step 3: User 2 Login
curl -X GET http://localhost:8080/api/auth/user \
  -H "Authorization: Bearer USER2_GOOGLE_TOKEN"
# Note the user ID (e.g., id: 2)

# Step 4: User 2 Get All Transactions
curl -X GET http://localhost:8080/api/transactions \
  -H "Authorization: Bearer USER2_GOOGLE_TOKEN"
# Expected: Empty list or no AAPL transaction from User 1

# Step 5: User 2 Try to Access User 1's Transaction
curl -X GET http://localhost:8080/api/transactions/1 \
  -H "Authorization: Bearer USER2_GOOGLE_TOKEN"
# Expected: 400 Bad Request with message "Transaction not found or unauthorized"

# Step 6: User 1 Verify Their Transaction Still Exists
curl -X GET http://localhost:8080/api/transactions/1 \
  -H "Authorization: Bearer USER1_GOOGLE_TOKEN"
# Expected: Transaction details for AAPL
```

### 4. Database-Level Verification

```sql
-- Verify data isolation at DB level
SELECT id, user_id, symbol, type FROM transactions;

-- Verify each transaction has user_id
SELECT COUNT(*) FROM transactions WHERE user_id IS NULL;
-- Should return: 0

-- Verify portfolio created for each user
SELECT user_id, name FROM portfolios;

-- Verify unique constraint on user_id in portfolios
INSERT INTO portfolios (user_id, name) VALUES (1, 'Test');
-- Should fail with UNIQUE constraint violation

-- Verify referential integrity
-- Try to create orphan transaction (should fail)
INSERT INTO transactions (user_id, date, symbol, type, number_of_shares, price) 
VALUES (999999, 1234567890, 'TEST', 'BUY', 1, 100);
-- Should fail with FOREIGN KEY constraint violation
```

## Data Migration Strategy

### For Existing Transactions Without User_id

If you have existing transactions:

**Option 1: Assign to Admin User**
```sql
-- Assuming Admin User has ID 1
UPDATE transactions 
SET user_id = 1 
WHERE user_id IS NULL;

-- Verify
SELECT COUNT(*) FROM transactions WHERE user_id IS NULL;
-- Should return: 0
```

**Option 2: Assign Based on Email/Pattern**
```sql
-- If transactions have metadata linking to users
UPDATE transactions t
SET user_id = (SELECT u.id FROM users u LIMIT 1)
WHERE t.user_id IS NULL AND t.created_by IS NOT NULL;
```

**Option 3: Create Default User**
```sql
INSERT INTO users (google_id, email, name, created_at, updated_at) 
VALUES ('default-user', 'admin@example.com', 'Default User', NOW(), NOW());

UPDATE transactions 
SET user_id = LAST_INSERT_ID() 
WHERE user_id IS NULL;
```

## Monitoring & Logging

### Enable Debug Logging

**application.properties:**
```properties
logging.level.org.ozsoft.portfoliomanager.util=DEBUG
logging.level.org.ozsoft.portfoliomanager.service=DEBUG
logging.level.org.springframework.security=INFO
```

### Log Locations to Monitor

```
INFO logs:
- Application startup
- User authentication
- Portfolio access

DEBUG logs:
- getUserId() calls
- User context extraction
- Authorization checks

ERROR logs:
- Unauthorized access attempts
- Missing transactions
- Database constraint violations
```

### Sample Error Logs to Watch For

**Expected (Normal):**
```
[DEBUG] SecurityUtils: getCurrentUserId() called for user: user1@example.com -> userId: 1
[DEBUG] TransactionService: getUserTransactions(1) - Found 5 transactions
[INFO] TransactionController: User 1 fetching transactions page 0
```

**Unexpected (Errors):**
```
[ERROR] SecurityUtils: No authenticated user found
[ERROR] TransactionService: Transaction not found or unauthorized
[WARN] Database: FOREIGN KEY constraint failed
[ERROR] Hibernate: Could not execute statement: Foreign key violation
```

## Troubleshooting

### Issue: Application Won't Start

**Symptom:** Application fails to start with migration error

**Solution:**
```bash
# Check database connection
mysql -u root -p -e "SELECT VERSION();"

# Check Hibernate logs for DDL errors
grep -i "error\|exception" /var/log/portfolio-manager.log

# If DDL issue, manually create tables
mysql -u root -p portfolio < migration_script.sql
```

### Issue: Users See All Data

**Symptom:** User A can see transactions from User B

**Cause:** SecurityUtils not being called or user_id filtering missing

**Verification:**
```java
// Check if SecurityUtils is called in controller
curl -X GET http://localhost:8080/api/transactions \
  -H "Authorization: Bearer TOKEN"

// Check logs for:
// [DEBUG] SecurityUtils: getCurrentUserId() -> userId

// If not present, SecurityUtils isn't being called
```

**Solution:**
1. Verify `SecurityUtils.getCurrentUserId(userRepository)` in all controller methods
2. Check `@Autowired private UserRepository userRepository;` is present
3. Verify Spring Security configuration is active

### Issue: "Transaction not found or unauthorized"

**Cause:** Accessing transaction owned by different user

**Verification:**
```sql
-- Check transaction ownership
SELECT id, user_id, symbol FROM transactions WHERE id = <transaction_id>;

-- Check current user
-- Query: SELECT CURRENT_USER;
```

**Solution:**
- Verify you're logged in as correct user
- Use correct transaction ID for your user
- Check that user record exists in database

### Issue: Circular Dependency / Auto-wiring Error

**Symptom:** Spring fails to autowire SecurityUtils

**Solution:**
```java
// SecurityUtils should be a static utility, not @Component
// Remove @Component annotation if present
// Use static methods for user context extraction
```

## Rollback Procedure

If critical issues occur:

### Step 1: Stop Application
```bash
sudo systemctl stop portfolio-manager
```

### Step 2: Restore Database
```bash
# List available backups
ls -lh backup_pre_multiuser_*.sql

# Restore from backup
mysql -u root -p portfolio < backup_pre_multiuser_20250101_000000.sql

# Verify restoration
mysql -u root -p -e "SELECT COUNT(*) FROM transactions;"
```

### Step 3: Restore Previous JAR
```bash
# Restore from git
git checkout HEAD~1 -- portfolio-manager/
cd portfolio-manager && mvn clean package -DskipTests

# Or restore from archive
cp archive/portfolio-manager.jar.old /opt/portfolio-manager/portfolio-manager.jar
```

### Step 4: Restart Application
```bash
sudo systemctl start portfolio-manager
```

### Step 5: Verify Rollback
```bash
# Check logs
tail -f /var/log/portfolio-manager.log

# Test basic functionality
curl http://localhost:8080/api/auth/status
```

## Performance Verification

### Query Performance

```sql
-- Check index usage
EXPLAIN SELECT * FROM transactions WHERE user_id = 1;
-- Should use: idx_transactions_user_id

EXPLAIN SELECT * FROM transactions WHERE user_id = 1 AND symbol = 'AAPL';
-- Should use: idx_transactions_user_symbol

-- Check index statistics
SHOW INDEX FROM transactions\G
```

### Load Testing

```bash
# Simple load test (100 concurrent requests)
ab -n 100 -c 10 http://localhost:8080/api/transactions

# Monitor database
mysql -u root -p -e "SHOW PROCESSLIST;"
```

## Security Verification

### 1. Unauthenticated Access
```bash
# Should be denied
curl -X GET http://localhost:8080/api/transactions
# Expected: 401 Unauthorized
```

### 2. Invalid Token
```bash
# Should be denied
curl -X GET http://localhost:8080/api/transactions \
  -H "Authorization: Bearer INVALID_TOKEN"
# Expected: 401 Unauthorized
```

### 3. Cross-User Access
```bash
# Get User 1's transaction ID
# Try to access with User 2's token
curl -X GET http://localhost:8080/api/transactions/1 \
  -H "Authorization: Bearer USER2_TOKEN"
# Expected: 400/403 Unauthorized
```

## Sign-Off Checklist

- [ ] Code compiles without errors
- [ ] JAR artifact created successfully
- [ ] Database backup completed
- [ ] Application started without errors
- [ ] Health check endpoint responds
- [ ] Database schema verification passed
- [ ] User isolation test passed
- [ ] Cross-user access denied test passed
- [ ] Existing data migrated (if applicable)
- [ ] Logs reviewed for errors
- [ ] Performance baseline established
- [ ] Security tests passed
- [ ] Rollback procedure verified

## Next Steps for Production

1. **Staging Deployment**
   - Deploy to staging environment
   - Run full test suite
   - Perform user acceptance testing

2. **Production Deployment**
   - Schedule maintenance window
   - Notify users of maintenance
   - Deploy and monitor closely
   - Have rollback plan ready

3. **Monitoring**
   - Set up alerts for authorization errors
   - Monitor database performance
   - Track user access patterns
   - Review security logs daily

4. **Documentation**
   - Update API documentation
   - Document data isolation for users
   - Create user guides
   - Train support team

## Support Contact

For deployment issues:
- Check logs in `/var/log/portfolio-manager.log`
- Review SQL error messages
- Verify Spring Security configuration
- Test with curl commands as shown above
