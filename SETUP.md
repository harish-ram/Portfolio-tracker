# Complete Setup Guide

Comprehensive setup and configuration guide for Portfolio Manager.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Configuration](#database-configuration)
5. [Running the Application](#running-the-application)
6. [Project Structure](#project-structure)
7. [Configuration Details](#configuration-details)
8. [Troubleshooting](#troubleshooting)
9. [Development Workflow](#development-workflow)

---

## Prerequisites

### Required Software

| Component | Version | Download |
|-----------|---------|----------|
| Java JDK | 8+ | [oracle.com](https://www.oracle.com/java/technologies/downloads/) |
| Maven | 3.6+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| Node.js | 16+ | [nodejs.org](https://nodejs.org/) |
| npm | 8+ | Included with Node.js |

### Verify Installation

```bash
# Java
java -version

# Maven
mvn -version

# Node.js
node -v

# npm
npm -v
```

### System Requirements

- **OS:** Windows, macOS, or Linux
- **RAM:** 2GB minimum (4GB+ recommended)
- **Disk:** 500MB free space
- **Ports:** 8080 (backend), 5173 (frontend) available

### Check Port Availability

```bash
# Windows
netstat -ano | findstr ":8080"
netstat -ano | findstr ":5173"

# macOS/Linux
lsof -i :8080
lsof -i :5173
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd portfolio-manager
```

### Step 2: Build the Backend

```bash
mvn clean install
```

This will:
- Download all Maven dependencies (first time only)
- Compile Java source code
- Run any test suites
- Package the application

**Expected output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXXs
```

### Step 3: Verify Build

```bash
mvn clean compile
```

This should complete without errors.

### Step 4: Run the Backend

```bash
mvn clean spring-boot:run
```

**Expected output:**
```
[INFO] >>> spring-boot-maven-plugin:2.7.14:run (default-cli)
...
[INFO] Started Application in 12.345 seconds
```

The backend is ready when you see:
```
Tomcat started on port(s): 8080
```

### Backend API Base URL

```
http://localhost:8080/api
```

Test the API:
```bash
curl http://localhost:8080/api/stocks
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This reads `package.json` and installs all required packages to `node_modules/`.

**Expected output:**
```
added XXX packages in XX.XXXs
```

### Step 3: Run Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.4.21 ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

The frontend is ready at: `http://localhost:5173`

### Step 4: Test the Application

Open browser and navigate to:
```
http://localhost:5173
```

You should see:
- Dashboard with portfolio overview
- Navigation menu (Stocks, Portfolio, Transactions)
- Pre-loaded sample data

### NPM Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
tsc --noEmit
```

---

## Database Configuration

### Data Storage

The application uses **JSON file-based persistence**:

**File location:**
```
portfolio-manager/data/portfolio.json
```

**What's stored:**
- All stocks in your portfolio
- Transaction history
- Portfolio configuration

### H2 Database (Optional)

If using H2 in-memory database, configuration is in:
```
portfolio-manager/src/main/resources/application.properties
```

### Data Format

```json
{
  "roundTotals": true,
  "showClosedPositions": false,
  "stocks": {
    "AAPL": {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 192.53,
      "level": "GOAL"
    }
  },
  "transactions": [
    {
      "id": 1,
      "symbol": "AAPL",
      "type": "BUY",
      "noOfShares": 100,
      "price": 150
    }
  ]
}
```

### Backup Data

Automatic daily backups are created:
```
portfolio-manager/data/portfolio.json.2024-12-23
portfolio-manager/data/portfolio.json.2024-12-22
```

Last 5 backups are kept automatically.

---

## Running the Application

### Development Mode (Both Terminals)

**Terminal 1 - Backend:**
```bash
cd portfolio-manager
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:** http://localhost:5173

### Production Mode

**Build frontend:**
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

**Build backend:**
```bash
cd portfolio-manager
mvn clean package
```
Output: `portfolio-manager/target/portfolio-manager-0.1-SNAPSHOT.jar`

**Run JAR:**
```bash
java -jar portfolio-manager/target/portfolio-manager-0.1-SNAPSHOT.jar
```

---

## Project Structure

```
portfolio-manager-repo/
│
├── portfolio-manager/                  # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/org/ozsoft/
│   │   │   │   └── portfoliomanager/
│   │   │   │       ├── config/            # Configuration classes
│   │   │   │       ├── controller/        # REST API endpoints
│   │   │   │       ├── domain/            # Domain models
│   │   │   │       ├── dto/               # Data transfer objects
│   │   │   │       ├── entity/            # Database entities
│   │   │   │       ├── repository/        # Data repositories
│   │   │   │       ├── service/           # Business logic
│   │   │   │       └── Application.java   # Main class
│   │   │   └── resources/
│   │   │       └── application.properties # Configuration
│   │   └── test/                          # Test classes
│   ├── data/                              # JSON data storage
│   ├── pom.xml                            # Maven config
│   └── README.md
│
├── frontend/                             # React Frontend
│   ├── src/
│   │   ├── components/                   # Reusable components
│   │   │   ├── DataTable.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── pages/                        # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Stocks.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   └── Transactions.tsx
│   │   ├── services/                     # API integration
│   │   │   └── api.ts
│   │   ├── types/                        # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── utils/                        # Utility functions
│   │   ├── App.tsx                       # Root component
│   │   └── main.tsx                      # Entry point
│   ├── public/                           # Static assets
│   ├── dist/                             # Production build (after npm run build)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── eslintrc.cjs
│
└── Documentation/
    ├── README.md                         # Main overview
    ├── SETUP.md                          # This file
    ├── QUICKSTART.md                     # 5-minute quickstart
    ├── API_DOCUMENTATION.md              # API reference
    └── PERFORMANCE_OPTIMIZATION.md       # Performance details
```

---

## Configuration Details

### Backend Configuration

**File:** `portfolio-manager/src/main/resources/application.properties`

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.org.springframework=WARN
logging.level.org.ozsoft=DEBUG

# Database
spring.datasource.url=jdbc:h2:file:./data/portfolio
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update

# Compression
server.compression.enabled=true
server.compression.min-response-size=1024
server.compression.mime-types=application/json,application/xml

# HTTP/2
server.http2.enabled=true

# Thread Pool
server.tomcat.threads.max=200
server.tomcat.threads.min-spare=10
server.tomcat.max-connections=10000
```

### Frontend Configuration

**File:** `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

**File:** `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

### Environment-Specific Configuration

#### Development
- CORS: localhost:3000, localhost:5173
- Logging: DEBUG level
- Hot module reloading enabled

#### Production
- CORS: Configure for your domain
- Logging: WARN level
- Caching: Enabled for all static assets

---

## Troubleshooting

### Backend Issues

#### Backend won't start

**Error: Port 8080 already in use**

```bash
# Windows: Find and kill process
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :8080
kill -9 [PID]

# Or change port in application.properties
server.port=8081
```

**Error: Java not found**

```bash
# Install Java JDK
# Verify after installation
java -version
```

**Error: Maven not found**

```bash
# Add Maven to PATH or install fresh
# Verify after installation
mvn -version
```

#### Database errors

**Error: Cannot find portfolio.json**

```bash
# Create data directory
mkdir -p portfolio-manager/data

# Create empty portfolio.json
echo '{}' > portfolio-manager/data/portfolio.json
```

### Frontend Issues

#### Frontend won't start

**Error: npm modules not found**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: Port 5173 already in use**

```bash
# Change port in vite.config.ts
server: { port: 5174 }

# Or kill existing process
# Windows: netstat -ano | findstr :5173
# macOS: lsof -i :5173
```

#### API communication issues

**Error: 400 Bad Request from frontend**

```bash
# 1. Verify backend is running
curl http://localhost:8080/api/stocks

# 2. Check vite proxy in vite.config.ts
# Should have: target: 'http://localhost:8080'

# 3. Check API URL in frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

# 4. Restart both services
```

**Error: CORS errors**

```bash
# Check WebConfig.java for CORS settings
# Should allow localhost:5173

# Restart backend after any CORS changes
```

#### Build issues

**Error: TypeScript compilation failed**

```bash
cd frontend
npm run build  # See all errors
tsc --noEmit  # Run type checker
npm run lint  # Check linter
```

**Error: Styling issues after build**

```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist package-lock.json
npm install
npm run build
npm run preview
```

---

## Development Workflow

### Local Development

1. **Terminal 1 - Start Backend**
   ```bash
   cd portfolio-manager
   mvn spring-boot:run
   ```

2. **Terminal 2 - Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Application**
   ```
   http://localhost:5173
   ```

### Code Quality Checks

**Frontend:**
```bash
cd frontend
npm run lint      # ESLint
npm run build     # TypeScript check
```

**Backend:**
```bash
cd portfolio-manager
mvn clean compile
```

### Testing APIs

```bash
# Get all stocks
curl http://localhost:8080/api/stocks

# Get portfolio summary
curl http://localhost:8080/api/portfolio

# Get all transactions
curl http://localhost:8080/api/transactions

# Create a stock
curl -X POST http://localhost:8080/api/stocks \
  -H "Content-Type: application/json" \
  -d '{"symbol":"TEST","name":"Test Co."}'
```

### Git Workflow

```bash
# Clone repository
git clone [repository-url]
cd portfolio-manager-repo

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature
```

---

## Next Steps

1. ✅ **Quick Start** - See [QUICKSTART.md](QUICKSTART.md)
2. 📖 **API Reference** - See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. ⚡ **Performance** - See [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md)
4. 🚀 **Deploy** - Configure for production environment

---

## Railway Deployment

The application is optimized for deployment on Railway using a single service that packages both the React frontend and Spring Boot backend.

### 1. Preparation

Ensure your changes are pushed to GitHub. The repository includes:
- `nixpacks.toml`: Configuration for the Railway builder.
- `railway.json`: Service-specific settings.
- `.github/workflows/build.yml`: CI verification.

### 2. Deployment Steps

1.  **Create New Project**: Log in to [Railway](https://railway.app/) and click "New Project" -> "Deploy from GitHub repo".
2.  **Configure Variables**:
    -   `PORT`: Automatically set by Railway, but defaults to `8080`.
    -   `MARKETSTACK_API_KEY`: Get your key from [Marketstack](https://marketstack.com/).
    -   `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: For OAuth support.
3.  **Build Phase**: Railway will use Nixpacks to:
    -   Install Node.js and Maven.
    -   Build the React frontend (`npm run build`).
    -   Package the Spring Boot application with the frontend assets embedded in the JAR.
4.  **Networking**: Railway will provide a public URL. Ensure this URL is added to your Google OAuth Authorized Redirect URIs.

### 3. CI/CD Pipeline

Every push to the `main` or `develop` branches will trigger:
1.  **GitHub Actions**: Build verification and Playwright tests.
2.  **Railway Deployment**: Automatic redeployment upon successful build detection.

### 4. Database Persistence

By default, the application uses H2 file-based storage. On Railway, file-based storage is **ephemeral**.
-   **Recommendation**: Connect a PostgreSQL database for production persistence.
-   **Configuration**: Add `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` to your Railway variables.

---

## Support & Resources

- **Java Docs** - [docs.oracle.com](https://docs.oracle.com)
- **Spring Boot** - [spring.io](https://spring.io)
- **React** - [react.dev](https://react.dev)
- **Vite** - [vitejs.dev](https://vitejs.dev)
- **Tailwind CSS** - [tailwindcss.com](https://tailwindcss.com)

---

**Last Updated:** December 2024
