# How to Run SwiftLink Telecom Services (STS)

## Step-by-Step Instructions

### Step 1: Verify MySQL Database is Running
All services connect to local MySQL databases. Let's make sure MySQL is running on your machine:
1. Open a PowerShell terminal in VS Code or separately as Administrator.
2. Verify MySQL service status:
   ```powershell
   Get-Service -Name MySQL
   ```
3. If it says **Stopped**, start it with:
   ```powershell
   Start-Service -Name MySQL
   ```

> [!NOTE]
> The services are configured to connect to MySQL on `localhost:3306` with username `root` and password `admin`. If your local MySQL setup has a different password, you can update it in the `application.properties` file of each service.

---

### Step 2: Initialize Database and Seed Sample Data (Optional)
The applications will auto-create empty databases and tables when they boot up. However, to pre-populate users, tickets, and engineers for testing:
1. Open your MySQL client (like MySQL Workbench, DBeaver, or command line).
2. Execute the following SQL files in order:
   * First, run [schema.sql](file:///c:/Users/ASHAY%20SHEREKAR/Desktop/CapStone_Project/CapStone_Project/telecom-field-engineer-system/database/schema.sql)
   * Next, run [sample-data.sql](file:///c:/Users/ASHAY%20SHEREKAR/Desktop/CapStone_Project/CapStone_Project/telecom-field-engineer-system/database/sample-data.sql)

---

### Step 3: Start Services in Separate Terminals
You will need to run the services in **5 separate terminal tabs** in VS Code. Click the `+` button in your VS Code terminal panel to open a new tab for each.

#### 🖥️ Terminal 1: Eureka Discovery Server (Port 8761)
This keeps track of all other microservices. It **must** be started first and be fully ready before starting the others.
1. Navigate to the Eureka directory:
   ```powershell
   cd .\telecom-field-engineer-system\eureka-server
   ```
2. Start the server:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started EurekaServerApplication` in the logs.
4. You can optionally open [http://localhost:8761](http://localhost:8761) in your browser to view the Eureka status page.

#### 🖥️ Terminal 2: Authentication Service (Port 8081)
Handles logins, user registration, and security answers.
1. Open a new terminal tab and navigate to the Auth service directory:
   ```powershell
   cd .\telecom-field-engineer-system\auth-service
   ```
2. Start the service:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started AuthServiceApplication` in the logs.

#### 🖥️ Terminal 3: Ticket Service (Port 8082)
Handles customer ticket creation and viewing.
1. Open a new terminal tab and navigate to the Ticket service directory:
   ```powershell
   cd .\telecom-field-engineer-system\ticket-service
   ```
2. Start the service:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started TicketServiceApplication` in the logs.

#### 🖥️ Terminal 4: Engineer Service (Port 8083)
Handles engineers, allocations, schedules, and hazards.
1. Open a new terminal tab and navigate to the Engineer service directory:
   ```powershell
   cd .\telecom-field-engineer-system\engineer-service
   ```
2. Start the service:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started EngineerServiceApplication` in the logs.

#### 🖥️ Terminal 5: Angular Frontend (Port 4200)
This is the user interface.
1. Open a new terminal tab and navigate to the frontend directory:
   ```powershell
   cd .\telecom-field-engineer-system\frontend-angular
   ```
2. Start the dev server:
   ```powershell
   npm start
   ```
3. **Wait** until you see: `➜ Local: http://localhost:4200/`

---

### Step 4: Use the Application
1. Open your web browser and navigate to: [http://localhost:4200](http://localhost:4200)
2. Log in using one of the pre-seeded credentials (all default passwords are `password123`):
   * **Admin:** `admin@sts.com`
   * **Customer (User):** `priya@email.com`
   * **Field Engineer:** `suresh@sts.com`

> [!TIP]
> Refer to [credentials.md](file:///c:/Users/ASHAY%20SHEREKAR/Desktop/CapStone_Project/CapStone_Project/telecom-field-engineer-system/docs/credentials.md) for more pre-seeded user accounts and passwords.
