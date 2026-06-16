# Run Guide — SwiftLink Telecom Services (STS)

This guide outlines step-by-step instructions to start the entire system from scratch on your PC.

---

## Step 1: Open VS Code & Project Directory
1. Open **VS Code**.
2. Go to **File > Open Folder...** and select:
   `C:\Users\ASHAY SHEREKAR\Desktop\CapStone_Project\CapStone_Project`

---

## Step 2: Ensure MySQL Database is Running
The database runs in the background as a Windows service. To verify it is running:
1. Open PowerShell as Administrator.
2. Run:
   ```powershell
   Get-Service -Name MySQL
   ```
   *(If the status shows **Stopped**, start it by running: `Start-Service -Name MySQL`)*

## Step 3: Start All Services at Once (Recommended)
You can run all the services at once using the automated batch script:
1. Open PowerShell or Command Prompt.
2. Navigate to the `telecom-field-engineer-system` directory:
   ```powershell
   cd .\telecom-field-engineer-system
   ```
3. Run the batch script:
   ```powershell
   .\start-all.bat
   ```
This will automatically open separate command prompt windows for each service, startup the Eureka Server first, wait 12 seconds, and then launch the backend services and Angular frontend.

---

## Step 3 (Alternative): Start Services Manually in Separate Terminals
If you prefer running services manually, you will need to open **5 separate terminal tabs** in VS Code (click the `+` button in the terminal panel to add tabs).

### 🖥️ Terminal 1: Eureka Discovery Server (Port 8761)
1. In VS Code Terminal, navigate to the Eureka directory:
   ```powershell
   cd .\telecom-field-engineer-system\eureka-server
   ```
2. Start the server using Maven:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started EurekaServerApplication` (or open [http://localhost:8761](http://localhost:8761) in your browser).

---

### 🖥️ Terminal 2: Authentication Service (Port 8081)
1. Open a new terminal tab and navigate to the Auth Service:
   ```powershell
   cd .\telecom-field-engineer-system\auth-service
   ```
2. Start the service:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started AuthServiceApplication`.

---

### 🖥️ Terminal 3: Ticket Service (Port 8082)
1. Open a new terminal tab and navigate to the Ticket Service:
   ```powershell
   cd .\telecom-field-engineer-system\ticket-service
   ```
2. Start the service:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started TicketServiceApplication`.

---

### 🖥️ Terminal 4: Engineer Service (Port 8083)
1. Open a new terminal tab and navigate to the Engineer Service:
   ```powershell
   cd .\telecom-field-engineer-system\engineer-service
   ```
2. Start the service:
   ```powershell
   & "C:\Users\ASHAY SHEREKAR\.vscode\extensions\oracle.oracle-java-26.0.0\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
   ```
3. **Wait** until you see: `Started EngineerServiceApplication`.

---

### 🖥️ Terminal 5: Angular Frontend (Port 4200)
1. Open a new terminal tab and navigate to the Frontend:
   ```powershell
   cd .\telecom-field-engineer-system\frontend-angular
   ```
2. Start the Angular dev server:
   ```powershell
   npm start
   ```
3. **Wait** until you see: `➜ Local: http://localhost:4200/`.

---

## Step 4: Open in Web Browser
- Access the **User Interface**: [http://localhost:4200](http://localhost:4200)
- Access the **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761)
- Refer to [credentials.md](file:///c:/Users/ASHAY%20SHEREKAR/Desktop/CapStone_Project/CapStone_Project/telecom-field-engineer-system/docs/credentials.md) for logins and passwords!
