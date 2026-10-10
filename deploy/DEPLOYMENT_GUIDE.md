# 🚀 Smart Campus Platform - Enterprise Production Deployment Guide

This document provides complete instructions for deploying the **Smart Campus Full-Stack Unified Platform** across cloud providers, container clusters, or on-premise institutional servers.

---

## 📋 System Prerequisites

| Requirement | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Node.js** | v18.0.0 LTS | v20.x or v22.x LTS |
| **RAM** | 512 MB | 2 GB+ |
| **CPU** | 1 vCPU | 2+ vCPUs |
| **Disk Space** | 250 MB | 10 GB+ (with daily backups) |
| **Operating System** | Ubuntu 22.04 / Debian / Windows / macOS | Ubuntu 24.04 LTS or Alpine Linux |

---

## ⚡ Option 1: Docker & Docker Compose (Recommended)

Docker deployment provides container isolation, automated health-checks, restart policies, and persistent volume mounting.

### Step 1: Clone Repository & Configure Environment
```bash
git clone <your-repo-url> smart-campus
cd smart-campus
cp .env.example .env
```
Edit `.env` if custom ports or API keys are required.

### Step 2: Build & Launch Stack
```bash
docker compose up -d --build
```

### Step 3: Verify Status & Logs
```bash
docker compose ps
docker compose logs -f
```
The application will be live at:
* **Web & API:** `http://localhost:3042/`
* **Health Check:** `http://localhost:3042/api/health`

---

## 🌐 Option 2: Linux VPS (Ubuntu / Debian) with Nginx & PM2

For self-hosted virtual private servers (AWS EC2, DigitalOcean Droplet, Linode, Hetzner, Oracle Cloud).

### Step 1: Install Node.js 20 & Git
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

### Step 2: Setup Project
```bash
sudo mkdir -p /var/www/smart-campus
sudo chown -R $USER:$USER /var/www/smart-campus
git clone <your-repo-url> /var/www/smart-campus
cd /var/www/smart-campus
npm install --omit=dev
cp .env.example .env
```

### Step 3: Start Node.js with PM2 Cluster
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Step 4: Configure Nginx & SSL (Certbot)
```bash
sudo cp nginx.conf /etc/nginx/sites-available/smart-campus
# Edit domain name in /etc/nginx/sites-available/smart-campus:
sudo nano /etc/nginx/sites-available/smart-campus

sudo ln -s /etc/nginx/sites-available/smart-campus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install free Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d campus.yourcollege.edu
```

---

## 🏢 Option 3: Windows Server / Campus Local Intranet

For running within the college data center or local network.

1. Ensure **Node.js 18+** is installed on the Windows Server.
2. Open Windows Firewall and permit inbound TCP traffic on port `3042` and `3443`.
3. Navigate to the project root directory:
   ```cmd
   cd D:\Projects\smart-campus-platform
   ```
4. Double-click or execute:
   ```cmd
   scripts\deploy.bat
   ```
5. *(Optional Windows Service)* To run as an automatic Windows background service, use **NSSM** (Non-Sucking Service Manager):
   ```cmd
   nssm install SmartCampus "C:\Program Files\nodejs\node.exe" "D:\Projects\smart-campus-platform\backend\server.js"
   nssm set SmartCampus AppDirectory "D:\Projects\smart-campus-platform"
   nssm start SmartCampus
   ```

---

## ☁️ Option 4: Cloud Platform-as-a-Service (Render, Railway, Fly.io)

### Render.com
1. Create a **New Web Service** pointing to your Git repository.
2. Select **Node** environment.
3. Set **Build Command**: `npm install --omit=dev`
4. Set **Start Command**: `node backend/server.js`
5. Add Environment Variables:
   * `PORT`: `3042`
   * `NODE_ENV`: `production`
6. Add a **Persistent Disk** mounted at `/app/backend/data` to preserve database records across redeploys.

### Railway.app
1. Deploy from GitHub repository.
2. Railway detects the `Dockerfile` automatically.
3. Attach a Persistent Volume to `/app/backend/data`.

---

## 🏛️ Post-Deployment: Initial Setup & Production Clean Slate

### 1. Root Administrator Bootstrap
* **Default Admin ID:** `ADM-001`
* **Default Password:** `campus123`
* Once signed in, navigate to **Administrator Hub ➔ Change Password** to set a secure institutional password.

### 2. Clean Slate vs Demo Mode
* **Clean Slate Mode (Live Deployment):**
  * Click **"🧹 Reset to Clean Database (Wipe Demo Data)"** in the Admin Console.
  * Clears all sample dummy students, demo passes, and test attendance records.
  * Leaves the single Master Administrator account so you can register real college staff, security guards, wardens, and students.
* **Showcase Demo Mode:**
  * Click **"⚡ Load Sample Data"** if presenting the system to committees or accreditors (NAAC/NIRF).

### 3. Activating Live Government Bhashini & Grok Cloud APIs
1. Click **⚙️ API Config** in the top navigation bar.
2. Enter your **Bhashini ULCA User ID & Inference API Key** (from `bhashini.gov.in/ulca`).
3. Enter your **Grok (xAI) API Key** (from `console.x.ai`).
4. Click **Save Configuration**. The backend saves these credentials persistently to the institutional database.

### 4. Supabase Cloud PostgreSQL Database Setup (Project: `cvpupibxsrqrvfsnutmz`)
The platform supports dual-persistence: local JSON database for instant zero-downtime offline execution, plus cloud PostgreSQL synchronization on Supabase.
1. Target Project ID: `cvpupibxsrqrvfsnutmz` (URL: `https://cvpupibxsrqrvfsnutmz.supabase.co`).
2. Run Database Schema:
   * Open [Supabase SQL Editor](https://supabase.com/dashboard/project/cvpupibxsrqrvfsnutmz/sql/new).
   * Copy and paste [backend/supabase_schema.sql](backend/supabase_schema.sql) and execute.
3. Configure API Key:
   * Copy your `anon` or `service_role` key from [Supabase API Settings](https://supabase.com/dashboard/project/cvpupibxsrqrvfsnutmz/settings/api).
   * Set `SUPABASE_KEY=...` in your `.env` or paste it in the **SaaS Platform Owner Console ➔ ⚡ Supabase Cloud Database** tab in the web UI.
   * Click **🔄 Sync Local Data to Supabase** to populate cloud tables.

### 5. Multi-Tenant Onboarding & Payment Workflows
* **₹1 Subscription Plans (Weekly, Monthly, Yearly, Multi-Campus):**
  * All subscription plans are priced at ₹1 (One Rupee) for live automated payment testing.
  * Generates instant QR code for UPI ID `ashish.ss@ptyes` with fixed amount ₹1.00.
* **Flipkart / Razorpay Style Banking Verification:**
  * Uses automated banking order verification (`ORD-...`) connecting to NPCI bank switch.
  * Multi-stage 4-step banking check animation confirms transaction, RRN, and settlement token.
  * Automatically issues a **Unique Institution ID** (`INST-...` / `CAMPUS-...`) to partition institutional records.
  * All 4 campus roles (Administrator, Faculty, Student, Parent) register with the Institution ID for 1st-time setup, then access via Login ID + Password.

---

## 🔒 Security Hardening Checklist

- [x] **HTTP Security Headers:** X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, Referrer-Policy.
- [x] **Atomic Persistent Writes:** Database uses atomic swap writes to prevent data corruption during power loss.
- [x] **Universal QR Tokens:** Transparent, standard QR codes compatible with any 2D barcode scanner or smartphone camera without proprietary crypto dependencies.
- [x] **Offline PWA Caching:** Service Worker (`sw.js`) guarantees fast rendering on slow 2G/3G campus Wi-Fi.
- [x] **Automated Backups:** Daily snapshots preserved in `backend/data/backups/`.
- [x] **Supabase Dual-Persistence:** Local + cloud PostgreSQL synchronization with project `cvpupibxsrqrvfsnutmz`.
- [ ] **Action Required:** Change default root password (`campus123`) immediately after deployment.
- [ ] **Action Required:** Set up daily cron or Windows Task Scheduler to run `npm run backup`.

---

## 🧪 Automated Health & Smoke Testing

To test all endpoints and verify 100% operational status:
```bash
node scripts/test-api.js
# or
npm test
```
Outputs pass/fail status for all 20 key institutional endpoints and security checks.

To verify container health status:
```bash
node scripts/healthcheck.js
# or
npm run healthcheck
```
