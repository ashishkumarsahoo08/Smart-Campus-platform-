# 🎓 Smart Campus | Unified Institutional Platform

An enterprise-grade, full-stack, mobile-first institutional management platform that unifies students, faculty, hostel wardens, main gate security, parents, and campus administrators into a single high-performance digital ecosystem.

Built to run reliably across universities and colleges worldwide with **zero external proprietary hardware lock-in**.

---

## 🌟 Key Features & Institutional Capabilities

### 1. Universal QR Gate Pass & Security Scanner
- **Normal Outpass (Short Duration / Market / Medical):**
  - Applied directly by students from their dashboard.
  - Direct 1-click approval by the Hostel Warden with a return cutoff time.
  - Generates a universal high-definition QR ticket readable by any standard smartphone camera or 2D handheld barcode scanner.
- **Institutional Multi-Day Leave Pass (Home / Hackathons):**
  - Enforces the **3-Tier Institutional Clearance Chain**:
    1. *Academic Coordinator* (attendance & exam verification)
    2. *Hostel Superintendent* (dues clearance & mess rebate rebate calculation)
    3. *Chief Hostel Warden* (parental verification & final pass release)
- **Main Gate Security Officer Scanner Desk:**
  - Automated **Direction Detection**:
    - **1st Scan ➔ Campus EXIT:** Records departure timestamp and triggers automated departure SMS to the parent.
    - **2nd Scan ➔ Campus ENTRY:** Evaluates on-time vs overdue return, calculates late minutes, updates student status to `RETURNED_SAFELY` or `RETURNED_LATE`, and alerts the Warden.

### 2. Dual Database Deployment Engine
- **🧹 Clean Slate (Production Live Mode):**
  - Purges all sample demo students, fake passes, and test attendance records.
  * Preserves **1 Root Master Administrator Account** (`ADM-001` / `campus123`) so your college can immediately register real faculty, departments, security officers, and students.
- **⚡ Showcase Demo Mode:**
  - 1-click loading of complete sample profiles for accreditation inspections (NAAC / NIRF), board reviews, and demonstrations.

### 3. Unified Fee Desk & Due Payment System
- Real-time breakdown of Tuition, Hostel, Mess, Examination, and Laboratory dues.
- Instant simulated online UPI / Card payment gateway.
- Generates official verified digital e-receipts with security seals and verification QR codes.
- Comptroller & Admin recovery overview with 1-click automated SMS reminders to fee defaulters.

### 4. Multilingual & AI Voice Assistant Bridge
- **Govt. of India Bhashini ULCA API Integration:** Regional language switching across Odia (ଓଡ଼ିଆ), Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and Bengali (বাংলা).
- **Voice & AI Campus Assistant:** Real-time speech recognition and text-to-speech audio reasoning powered by xAI Grok Cloud API + Web Speech Neural Engine.

### 5. Mobile PWA & Low-Data Mode
- Installable on Android, iOS, Windows, and macOS as a native standalone Progressive Web App.
- Built-in Service Worker (`sw.js`) guarantees fast rendering even on 2G/3G campus Wi-Fi.

---

## 🚀 Quick Start (Development & Local Testing)

```bash
# 1. Install dependencies
npm install

# 2. Launch platform
npm start
```

Access the platform:
* **Web Portal:** [http://localhost:3042/](http://localhost:3042/)
* **Health Check:** [http://localhost:3042/api/health](http://localhost:3042/api/health)
* **Default Admin Login:** `ADM-001` / `campus123`

---

## 🐳 Production Deployment Options

Detailed production deployment instructions are documented in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

### 1. Docker Compose (1 Command)
```bash
docker compose up -d --build
```

### 2. Linux VPS (Ubuntu / Debian with PM2 & Nginx)
```bash
pm2 start ecosystem.config.js --env production
```

### 3. Windows Server (1-Click Launcher)
Double-click:
```cmd
scripts\deploy.bat
```

---

## 🧪 Automated Testing

Verify all 12 institutional endpoints and API services:
```bash
npm test
```

---

## 📂 Project Structure

```
smart-campus-platform/
├── backend/
│   ├── controllers/         # Business logic for all 9 campus domains
│   ├── routes/              # Express REST API endpoints
│   ├── data/
│   │   ├── campus_db.json   # Persistent JSON database (atomic writes)
│   │   └── backups/         # Automated hourly/daily snapshots
│   ├── db.js                # Database engine & Clean Slate logic
│   └── server.js            # Hardened Express server with security headers
├── scripts/
│   ├── deploy.bat           # Windows 1-click installer & launcher
│   ├── deploy.sh            # Linux/macOS 1-click launcher
│   ├── backup.ps1           # PowerShell automated backup script
│   ├── backup.sh            # Shell cron backup script
│   └── test-api.js          # Automated end-to-end integration test suite
├── index.html               # Unified Portal SPA with all role modals
├── styles.css               # Modern glassmorphism dark/light design system
├── app.js                   # Client frontend engine & offline syncing
├── favicon.svg              # Modern high-resolution SVG favicon
├── manifest.json            # PWA web manifest for mobile installation
├── sw.js                    # PWA Service Worker for offline resilience
├── Dockerfile               # Production multi-stage Alpine Dockerfile
├── docker-compose.yml       # Docker Compose production stack
├── nginx.conf               # Production Nginx reverse proxy configuration
├── ecosystem.config.js      # PM2 cluster configuration
├── .env.example             # Production environment template
├── .env                     # Active environment variables
├── DEPLOYMENT_GUIDE.md      # Complete production deployment handbook
└── package.json             # NPM package scripts & metadata
```

---

## 📄 License
Released under the MIT License for institutional deployment worldwide.
