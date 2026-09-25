# MongoDB Atlas Setup & Deployment Guide

This document explains how to set up **MongoDB Atlas** as the production database for the Medsync Healthcare AI Platform.

---

## 1. Create a MongoDB Atlas Account & Cluster

1. Navigate to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Click **Build a Database** and select **M0 (Free)** or your desired dedicated tier.
3. Select your cloud provider (AWS / GCP / Azure) and choose the nearest region (e.g. `ap-south-1` for Mumbai, India).
4. Name your cluster (e.g., `MedsyncCluster`) and click **Create Cluster**.

---

## 2. Configure Database Security

### A. Create Database User
1. In the left navigation, go to **Security** -> **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password Authentication**:
   - Username: `medsync_admin`
   - Password: `<GENERATE_SECURE_PASSWORD>` (store this securely).
4. Assign built-in role: **Read and write to any database**.
5. Click **Add User**.

### B. Configure Network Access (IP Whitelist)
1. In the left navigation, go to **Security** -> **Network Access**.
2. Click **Add IP Address**.
3. For cloud deployments, add your server's static IP or `0.0.0.0/0` (allow from anywhere with strict password auth).
4. Click **Confirm**.

---

## 3. Retrieve Connection String

1. Go to **Deployments** -> **Database**.
2. Click **Connect** next to your cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string URI. Format:
   ```text
   mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/healthcare_ai_demo?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database credentials.

---

## 4. Local & Production Deployment Steps

### A. Environment Configuration
Create or edit your `.env` file in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/healthcare_ai_demo?retryWrites=true&w=majority
PORT=8000
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-32-char-refresh-secret
```

### B. Run Database Seed Script
Populate Sunrise Multispeciality Hospital (`HOSP-DEMO-001`), 9 departments, 8 doctors, 3 receptionists, 20 patients, 42 appointments, 20 consultations, 15 prescriptions, 15 reports, 12 follow-ups, and notifications:
```bash
npm run seed
```

### C. Start Development Server
```bash
# Start backend API (connects to MongoDB before starting)
npm run dev:api

# Start frontend application
npm run dev:web
```

---

## 5. Connection Health & Reliability Features
- **Pooling & Events**: Auto-reconnect listeners log connectivity, disconnects, and errors.
- **Fail-Safe Startup**: The API server will not start in an inconsistent state if MongoDB connection fails.
- **Compound Indexes**: Automatic index generation for `{ hospitalId: 1, patientId: 1 }`, `{ hospitalId: 1, doctorId: 1, date: 1 }`, and `{ email: 1 }`.
