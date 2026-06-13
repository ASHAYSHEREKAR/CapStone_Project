# STS System Credentials & Ports Reference

This document contains all passwords, usernames, and port numbers for the development environment.

## 1. Database Credentials

| Component | Host | Port | Database Name | Username | Password |
|---|---|---|---|---|---|
| **MySQL Instance** | `localhost` | `3306` | *Multiple (see below)* | `root` | `admin` |
| **Auth Database** | `localhost` | `3306` | `sts_auth_db` | `root` | `admin` |
| **Ticket Database** | `localhost` | `3306` | `sts_ticket_db` | `root` | `admin` |
| **Engineer Database** | `localhost` | `3306` | `sts_engineer_db` | `root` | `admin` |

*Note: The user previously specified `ashay@123` as an alternative password, but the current active password configured in `application.properties` and the system service is `admin`.*

---

## 2. Service Ports & Dashboards

| Service | Port | Endpoint / URL | Description |
|---|---|---|---|
| **Eureka Server** | `8761` | [http://localhost:8761](http://localhost:8761) | Registry dashboard showing active microservice status. |
| **Angular Frontend** | `4200` | [http://localhost:4200](http://localhost:4200) | Main user interface web app. |
| **Auth Service** | `8081` | [http://localhost:8081](http://localhost:8081) | REST API for user registration and authentication. |
| **Ticket Service** | `8082` | [http://localhost:8082](http://localhost:8082) | REST API for creating and managing support tickets. |
| **Engineer Service** | `8083` | [http://localhost:8083](http://localhost:8083) | REST API for engineer schedules, workloads, and hazards. |

---

## 3. Sample User Accounts (Pre-Seeded)

All sample accounts below are seeded with the default password: **`password123`**

| Name | Email | Role | Security Question | Security Answer |
|---|---|---|---|---|
| **Rajesh Kumar** | `admin@sts.com` | `ADMIN` | What is your pet name? | `tommy` |
| **Priya Sharma** | `priya@email.com` | `USER` | What city were you born in? | `mumbai` |
| **Amit Patel** | `amit@email.com` | `USER` | What is your favorite color? | `blue` |
| **Suresh Reddy** | `suresh@sts.com` | `ENGINEER` | What is your pet name? | `rocky` |
| **Deepak Nair** | `deepak@sts.com` | `ENGINEER` | What city were you born in? | `kerala` |
| **Karthik Iyer** | `karthik@sts.com` | `ENGINEER` | What is your favorite color? | `green` |
| **Vikram Singh** | `vikram@sts.com` | `ENGINEER` | What is your pet name? | `bruno` |

---

## 4. How to Reset a Password (Forgot Password Flow)

If a user forgets their password:
1. Navigate to the **Forgot Password** page in the Angular UI.
2. Enter the registered email address.
3. The UI will retrieve the associated **Security Question**.
4. Input the correct **Security Answer** (case-sensitive, e.g. `tommy`, `blue`, etc.).
5. The system will allow setting a new password.
