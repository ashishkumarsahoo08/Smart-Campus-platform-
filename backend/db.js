const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR 
  ? path.resolve(process.env.DATA_DIR) 
  : (process.env.DB_FILE ? path.dirname(path.resolve(process.env.DB_FILE)) : path.join(__dirname, 'data'));
const BACKUP_DIR = process.env.BACKUP_DIR
  ? path.resolve(process.env.BACKUP_DIR)
  : path.join(DATA_DIR, 'backups');
const DB_FILE = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.join(DATA_DIR, 'campus_db.json');

// In-memory cache
let cachedDb = null;

// Initial schema defaults
function getDefaultSchema() {
  return {
    mode: 'DEMO', // 'DEMO' or 'CLEAN_SLATE'
    platformOwner: {
      id: 'superadmin',
      loginId: 'owner',
      name: 'Smart Campus SaaS Platform Authority',
      role: 'superadmin',
      password: 'campusowner123',
      email: 'licensing@smartcampus.cloud',
      phone: '+91 674 2901234',
      avatar: '👑'
    },
    subscriptionPlans: [
      {
        id: 'PLAN-TOKEN',
        name: 'Verification Token (₹1)',
        durationDays: 1,
        priceINR: 1,
        period: 'Instant Test',
        badge: 'Micro-Pay Verification (₹1 Token)',
        description: 'One Rupee verification token for instant platform activation & live payment testing.',
        features: [
          'Live UPI ID Verification Check',
          'Instant Scanner & Deep-Link Test',
          'E-Receipt & Payment Demo',
          'Instant Verification Token (₹1 Test Token)'
        ]
      },
      {
        id: 'PLAN-WEEKLY',
        name: 'Weekly Starter License',
        durationDays: 7,
        priceINR: 1,
        period: 'Weekly',
        badge: 'Evaluation / Trial (₹1 License)',
        description: 'Ideal for rapid campus evaluation and feature testing. Currently ₹1.',
        features: [
          'Full Campus Portals & All Role Access',
          'Unlimited Students, Faculty & Parents',
          'Universal QR Gate Passes & Security Scanner',
          'Customizable Institutional Payment Gateway',
          'Automated Payment Verification & E-Receipts'
        ]
      },
      {
        id: 'PLAN-MONTHLY',
        name: 'Monthly Flexible License',
        durationDays: 30,
        priceINR: 1,
        period: 'Monthly',
        badge: 'Pay-As-You-Go (₹1 License)',
        description: 'Flexible monthly billing. Full access for all institution departments. Currently ₹1.',
        features: [
          'Full Campus Portals & All Role Access',
          'Unlimited Students & Faculty Accounts',
          'Universal QR Gate Passes & Security Scanner',
          'Customizable Institutional Payment Gateway',
          'Customizable Official E-Receipt Formatter',
          'RapidAPI Multi-Language Engine'
        ]
      },
      {
        id: 'PLAN-YEARLY',
        name: 'Annual Institutional License',
        durationDays: 365,
        priceINR: 1,
        period: 'Yearly',
        badge: 'Most Popular (₹1 License)',
        description: 'Comprehensive annual coverage for universities and colleges. Currently ₹1.',
        features: [
          'All Features of Monthly Plan Included',
          'Priority RapidAPI Neural Translation Bridge',
          'Automated Daily Database Snapshots & Backups',
          'Custom Domain Binding & Dedicated SSL',
          '24/7 Priority SLA Institutional Support'
        ]
      },
      {
        id: 'PLAN-ENTERPRISE',
        name: 'Multi-Campus University License',
        durationDays: 1095,
        priceINR: 1,
        period: '3 Years',
        badge: 'Enterprise Best Value (₹1 License)',
        description: 'Permanent multi-campus clustering with custom ERP integrations. Currently ₹1.',
        features: [
          'Multi-Campus Clustering (Unlimited Blocks)',
          'Dedicated Institutional Database Instance',
          'Full Biometric & Smart Turnstile API Sync',
          'Dedicated Technical Account Manager'
        ]
      }
    ],
    institutions: {},
    users: {},
    fees: {},
    feePayments: [],
    feeReminders: [],
    attendanceSessions: [],
    timetableData: {},
    smsLogs: [],
    gatePasses: [],
    outpasses: [],
    leaveApplications: [],
    gateMovements: [],
    activityHistory: [],
    feedbackList: [],
    apiSettings: {
      rapidapi: {
        enabled: true,
        provider: 'RapidAPI Multilingual Engine',
        host: 'google-translate1.p.rapidapi.com',
        apiKey: '',
        status: 'Active (RapidAPI Neural Translation Bridge)',
        supportedLanguages: [
          { code: 'en', name: 'English', native: 'English' },
          { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
          { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
          { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
          { code: 'te', name: 'Telugu', native: 'తెలుగు' },
          { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
          { code: 'bn', name: 'Bengali', native: 'বাংলা' }
        ],
        documentationUrl: 'https://rapidapi.com/category/Translation',
        approvalInstructions: 'Sign up at rapidapi.com (free 30-sec signup), copy your X-RapidAPI-Key and connect.'
      },
      bhasini: {
        enabled: true,
        provider: 'RapidAPI Multilingual Engine',
        host: 'google-translate1.p.rapidapi.com',
        apiKey: '',
        status: 'Active (RapidAPI Neural Translation Bridge)'
      },
      voiceAssistant: {
        enabled: true,
        provider: 'Grok AI (xAI) + Web Speech Neural Engine',
        model: 'grok-beta',
        grokApiKey: '',
        geminiApiKey: '',
        status: 'Active (Multilingual Voice Recognition + Campus AI Engine)',
        wakeWord: 'Hey Campus',
        voicePitch: 1.0,
        voiceRate: 1.0,
        documentationUrl: 'https://console.x.ai/',
        approvalInstructions: 'Generate an API key at console.x.ai or Google AI Studio to route complex reasoning to Grok cloud LLMs.'
      }
    },
    voiceLogs: [],
    paymentOrders: {}
  };
}

function loadDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      cachedDb = JSON.parse(raw);
    } else {
      cachedDb = getDefaultSchema();
      saveDb(cachedDb);
    }

    // Ensure all tables exist in memory
    const defaultSchema = getDefaultSchema();
    for (const key of Object.keys(defaultSchema)) {
      if (cachedDb[key] === undefined) {
        cachedDb[key] = defaultSchema[key];
      }
    }

    // Seed Multi-Tenant Institutions, Gate Passes, and Roles
    seedMultiTenantData(cachedDb);
  } catch (err) {
    console.error('Error reading campus_db.json:', err);
    if (!cachedDb) cachedDb = getDefaultSchema();
  }
  return cachedDb;
}

function seedMultiTenantData(db) {
  if (!db.institutions) db.institutions = {};
  if (!db.users) db.users = {};

  // 1. SuperAdmin / Platform Owner
  if (!db.users.superadmin) {
    db.users.superadmin = {
      id: 'superadmin',
      loginId: 'owner',
      name: 'Smart Campus SaaS Platform Authority',
      role: 'superadmin',
      password: 'campusowner123',
      email: 'licensing@smartcampus.cloud',
      phone: '+91 674 2901234',
      avatar: '👑'
    };
  }

  // 2. Institution 1: Government Engineering College, Bhubaneswar (ACTIVE YEARLY SUBSCRIPTION)
  if (!db.institutions['INST-001']) {
    db.institutions['INST-001'] = {
      id: 'INST-001',
      code: 'GEC-BBSR',
      name: 'Government Engineering College, Bhubaneswar',
      shortName: 'GEC Bhubaneswar',
      address: 'Chandaka Industrial Estate, Bhubaneswar, Odisha - 751024',
      regdNo: 'UGC-OD-2004-9812',
      logo: '🏛️',
      contactEmail: 'admin@gec.edu.in',
      contactPhone: '+91 674 2309110',
      adminUserId: 'admin',
      subscription: {
        plan: 'PLAN-YEARLY',
        planName: 'Annual Institutional License',
        amount: 49999,
        startDate: '2026-01-01',
        endDate: '2027-01-01',
        status: 'ACTIVE',
        autoRenew: true,
        daysRemaining: 92,
        lastRenewedAt: '01 Jan 2026 at 10:00 AM'
      },
      paymentConfig: {
        bankName: 'State Bank of India',
        branchName: 'University Campus Branch, Bhubaneswar',
        accountName: 'GEC Central Academic & Tuition Fund',
        accountNumber: '309811442009',
        ifscCode: 'SBIN0010234',
        upiId: 'gecbhubaneswar@sbi',
        qrScannerUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=gecbhubaneswar@sbi&pn=GEC+Bhubaneswar&cu=INR',
        instructions: 'Scan official college UPI QR code or transfer via NEFT/IMPS. Official verified e-receipt will be generated immediately.'
      },
      receiptTemplate: {
        headerTitle: 'GOVERNMENT ENGINEERING COLLEGE, BHUBANESWAR',
        subTitle: '(An Autonomous Institution Affiliated to BPUT • Accredited A+ by NAAC)',
        regdNoDisplay: 'Institutional Regd. No: UGC-OD-2004-9812',
        addressDisplay: 'Chandaka Industrial Estate, Bhubaneswar, Odisha - 751024',
        signatoryTitle: 'Comptroller of Finance & Accounts',
        signatoryName: 'Prof. S.K. Mohanty',
        receiptPrefix: 'GEC-REC-2026/',
        sealText: 'OFFICIAL DIGITAL VERIFICATION SEAL • GEC FINANCE',
        footerNotice: 'This is an authentic, system-generated digital e-receipt verified under the Smart Campus SaaS Platform. No physical signature required.'
      }
    };
  }

  // 3. Institution 2: Kalinga Institute of Medical Sciences (EXPIRED SUBSCRIPTION FOR DEMONSTRATION)
  if (!db.institutions['INST-002']) {
    db.institutions['INST-002'] = {
      id: 'INST-002',
      code: 'KIMS-MED',
      name: 'Kalinga Institute of Medical Sciences',
      shortName: 'KIMS Campus',
      address: 'KIIT Road, Patia, Bhubaneswar, Odisha - 751024',
      regdNo: 'NMC-OD-2010-4411',
      logo: '🏥',
      contactEmail: 'registrar@kims.ac.in',
      contactPhone: '+91 674 2725444',
      adminUserId: 'admin_kims',
      subscription: {
        plan: 'PLAN-MONTHLY',
        planName: 'Monthly Standard Institutional License',
        amount: 5999,
        startDate: '2026-09-01',
        endDate: '2026-10-01', // Expired on 01 Oct 2026! Perfect for demonstrating subscription barrier & 1-click renewal!
        status: 'EXPIRED',
        autoRenew: false,
        daysRemaining: 0,
        lastRenewedAt: '01 Sep 2026 at 11:30 AM'
      },
      paymentConfig: {
        bankName: 'HDFC Bank',
        branchName: 'Patia Square Branch, Bhubaneswar',
        accountName: 'KIMS Student Welfare & Academic Trust',
        accountNumber: '50200088992211',
        ifscCode: 'HDFC0001889',
        upiId: 'kimsacademic@hdfcbank',
        qrScannerUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kimsacademic@hdfcbank&pn=KIMS+Institute&cu=INR',
        instructions: 'Official medical college fee deposit. Payment automatically credited.'
      },
      receiptTemplate: {
        headerTitle: 'KALINGA INSTITUTE OF MEDICAL SCIENCES',
        subTitle: 'Recognized by National Medical Commission (NMC) • Ministry of Health',
        regdNoDisplay: 'Institutional Regd. No: NMC-OD-2010-4411',
        addressDisplay: 'KIIT Road, Patia, Bhubaneswar, Odisha - 751024',
        signatoryTitle: 'Chief Accounts & Audit Officer',
        signatoryName: 'Dr. B.P. Mishra',
        receiptPrefix: 'KIMS-FEE-2026/',
        sealText: 'OFFICIAL KIMS FINANCE EMBOSS',
        footerNotice: 'Authentic e-Receipt. Valid for income tax rebate (80E) and institutional records.'
      }
    };
  }

  // 4. Ensure INST-002 Administrator exists
  if (!db.users.admin_kims) {
    db.users.admin_kims = {
      id: 'admin_kims',
      loginId: 'KIMS-ADM-01',
      role: 'admin',
      institutionId: 'INST-002',
      name: 'Dr. B.P. Mishra',
      staffId: 'KIMS-ADM-01',
      dept: 'Medical College Administration',
      designation: 'Registrar & Dean of Administration',
      avatar: '👨‍⚕️',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Board of Medical Governors (KIMS)',
      createdAt: '01 Sep 2026'
    };
  }

  // 5. Ensure INST-002 Student exists
  if (!db.users.student_kims1) {
    db.users.student_kims1 = {
      id: 'student_kims1',
      loginId: 'MBBS-2024-012',
      role: 'student',
      institutionId: 'INST-002',
      name: 'Dr. Rohan Sethi (Intern)',
      roll: 'MBBS-2024-012',
      dept: 'General Medicine & Surgery',
      sem: 'Final Year MBBS',
      attendance: 91,
      attendanceAttended: 142,
      attendanceSessionsTotal: 156,
      avatar: '👨‍⚕️',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Administrator (Dr. B.P. Mishra)',
      createdAt: '01 Sep 2026',
      hostel: 'Charaka Medical Hostel, Room 104',
      phone: '+91 98610 77112',
      parentPhone: '+91 98610 88223',
      subjects: [
        { code: 'MED501', name: 'Clinical Medicine & Therapeutics', faculty: 'Dr. A. Ray', attended: 40, total: 42, percentage: 95 },
        { code: 'MED502', name: 'General Surgery & Trauma Care', faculty: 'Dr. P. Hota', attended: 35, total: 40, percentage: 88 }
      ]
    };
  }

  // Ensure INST-002 student fee record
  if (!db.fees) db.fees = {};
  if (!db.fees.student_kims1) {
    db.fees.student_kims1 = {
      studentId: 'student_kims1',
      institutionId: 'INST-002',
      name: 'Dr. Rohan Sethi (Intern)',
      roll: 'MBBS-2024-012',
      semester: 'Final Year MBBS',
      academicYear: '2026-27',
      totalFees: 185000,
      paidAmount: 140000,
      dueAmount: 45000,
      status: 'PARTIAL',
      dueDate: '15 Oct 2026',
      categories: [
        { id: 'tuition', name: 'Clinical & Hospital Practicum', total: 110000, paid: 110000, due: 0, status: 'PAID' },
        { id: 'hostel', name: 'Intern Hostel AC Single Room', total: 45000, paid: 20000, due: 25000, status: 'PARTIAL' },
        { id: 'exam', name: 'Final MBBS Prof Part-II Exam', total: 20000, paid: 0, due: 20000, status: 'UNPAID' },
        { id: 'library', name: 'Clinical Digital Research Vault', total: 10000, paid: 10000, due: 0, status: 'PAID' }
      ]
    };
  }

  // 6. Enrolled Users for INST-001 (Admin, Students, Faculty, Parents, Security, Warden)
  if (!db.users.admin) {
    db.users.admin = {
      id: 'admin',
      loginId: 'ADM-001',
      role: 'admin',
      institutionId: 'INST-001',
      name: 'Dr. R.N. Sen',
      staffId: 'ADM-001',
      dept: 'Central Academic Administration',
      designation: 'Registrar & Chief Administrator',
      avatar: '👨‍💼',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Board of Governors (Institutional Setup)',
      createdAt: '15 Jul 2026'
    };
  }

  if (!db.users.student1) {
    db.users.student1 = {
      id: 'student1',
      loginId: 'CS-2024-082',
      role: 'student',
      institutionId: 'INST-001',
      name: 'Satyajit Mohapatra',
      roll: 'CS-2024-082',
      dept: 'Computer Science & Engineering',
      sem: '5th Semester',
      attendance: 88,
      attendanceAttended: 136,
      attendanceSessionsTotal: 154,
      avatar: '👨‍🎓',
      parentId: 'parent1',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Administrator (Dr. R.N. Sen)',
      createdAt: '28 Aug 2026',
      hostel: 'Aryabhatta Hostel, Room 304',
      phone: '+91 98610 99823',
      parentPhone: '+91 98610 11223',
      subjects: [
        { code: 'CS501', name: 'AI & Machine Learning', faculty: 'Prof. A.K. Sharma', attended: 35, total: 38, percentage: 92 },
        { code: 'CS502', name: 'Cloud Computing & DevOps', faculty: 'Dr. Priya Patel', attended: 30, total: 34, percentage: 88 },
        { code: 'CS503', name: 'Data Structures & Algorithms', faculty: 'Prof. A.K. Sharma', attended: 41, total: 48, percentage: 85 },
        { code: 'CS504', name: 'Database Management Systems', faculty: 'Prof. S. Mohanty', attended: 30, total: 34, percentage: 88 }
      ]
    };
  }

  if (!db.users.student2) {
    db.users.student2 = {
      id: 'student2',
      loginId: 'CS-2024-015',
      role: 'student',
      institutionId: 'INST-001',
      name: 'Rahul Verma',
      roll: 'CS-2024-015',
      dept: 'Computer Science & Engineering',
      sem: '5th Semester',
      attendance: 74,
      attendanceAttended: 114,
      attendanceSessionsTotal: 154,
      avatar: '👨‍🎓',
      parentId: 'parent2',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Administrator (Dr. R.N. Sen)',
      createdAt: '28 Aug 2026',
      hostel: 'Aryabhatta Hostel, Room 212',
      phone: '+91 98610 88712',
      parentPhone: '+91 97780 44551',
      subjects: [
        { code: 'CS501', name: 'AI & Machine Learning', faculty: 'Prof. A.K. Sharma', attended: 26, total: 38, percentage: 68 },
        { code: 'CS502', name: 'Cloud Computing & DevOps', faculty: 'Dr. Priya Patel', attended: 26, total: 34, percentage: 76 },
        { code: 'CS503', name: 'Data Structures & Algorithms', faculty: 'Prof. A.K. Sharma', attended: 36, total: 48, percentage: 75 },
        { code: 'CS504', name: 'Database Management Systems', faculty: 'Prof. S. Mohanty', attended: 26, total: 34, percentage: 76 }
      ]
    };
  }

  if (!db.users.faculty1) {
    db.users.faculty1 = {
      id: 'faculty1',
      loginId: 'FAC-042',
      role: 'faculty',
      institutionId: 'INST-001',
      name: 'Prof. A.K. Sharma',
      staffId: 'FAC-042',
      dept: 'Computer Science & Engineering',
      designation: 'Associate Professor & HOD',
      avatar: '👩‍🏫',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Administrator (Dr. R.N. Sen)',
      createdAt: '15 Jul 2026'
    };
  }

  if (!db.users.faculty2) {
    db.users.faculty2 = {
      id: 'faculty2',
      loginId: 'FAC-018',
      role: 'faculty',
      institutionId: 'INST-001',
      name: 'Dr. Priya Patel',
      staffId: 'FAC-018',
      dept: 'Electronics & Communication',
      designation: 'Associate Professor',
      avatar: '👩‍🏫',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Administrator (Dr. R.N. Sen)',
      createdAt: '15 Jul 2026'
    };
  }

  if (!db.users.parent1) {
    db.users.parent1 = {
      id: 'parent1',
      loginId: 'PAR-8821',
      alias: 'PAR-082',
      role: 'parent',
      institutionId: 'INST-001',
      name: 'Mr. N. Mohapatra',
      wardId: 'student1',
      wardName: 'Satyajit Mohapatra',
      avatar: '👪',
      password: 'campus123',
      passwordChanged: false,
      createdBy: 'Administrator (Dr. R.N. Sen)',
      createdAt: '28 Aug 2026'
    };
  }

  if (!db.fees.student1) {
    db.fees.student1 = {
      studentId: 'student1',
      institutionId: 'INST-001',
      name: 'Satyajit Mohapatra',
      roll: 'CS-2024-082',
      semester: '5th Semester (Autumn 2026)',
      academicYear: '2026-27',
      totalFees: 75000,
      paidAmount: 50000,
      dueAmount: 25000,
      status: 'PARTIAL',
      dueDate: '15 Oct 2026',
      categories: [
        { id: 'tuition', name: 'Semester Tuition & Laboratory', total: 45000, paid: 45000, due: 0, status: 'PAID' },
        { id: 'hostel', name: 'Aryabhatta Hostel & Boarding', total: 20000, paid: 5000, due: 15000, status: 'PARTIAL' },
        { id: 'exam', name: 'Mid-Sem Examination Fee', total: 5000, paid: 0, due: 5000, status: 'UNPAID' },
        { id: 'library', name: 'Digital Library & Research Vault', total: 5000, paid: 0, due: 5000, status: 'UNPAID' }
      ]
    };
  }

  // Security and Warden accounts for INST-001
  if (!db.users.security1) {
    db.users.security1 = {
      id: 'security1',
      loginId: 'security',
      name: 'Officer Rajesh Kumar',
      role: 'security',
      institutionId: 'INST-001',
      password: 'campuspassword123',
      gate: 'Main Campus Gate #1',
      shift: 'Day Shift (06:00 AM - 08:00 PM)',
      phone: '+91 98610 55443'
    };
  }

  if (!db.users.warden1) {
    db.users.warden1 = {
      id: 'warden1',
      loginId: 'warden',
      name: 'Dr. K.C. Swain (Chief Hostel Warden)',
      role: 'warden',
      institutionId: 'INST-001',
      password: 'campuspassword123',
      hostel: 'Aryabhatta & Bhaskara Hostel Blocks',
      phone: '+91 98610 77665'
    };
  }

  // Ensure all existing users belong to INST-001 if not tagged
  Object.keys(db.users).forEach(uid => {
    const u = db.users[uid];
    if (!u.institutionId && u.role !== 'superadmin') {
      u.institutionId = 'INST-001';
    }
  });

  // 7. Seed sample Outpasses for INST-001
  if (!db.outpasses || db.outpasses.length === 0) {
    db.outpasses = [
      {
        id: 'OP-5521',
        institutionId: 'INST-001',
        passType: 'OUTPASS',
        category: 'Medical / Clinic Visit',
        studentId: 'student1',
        studentName: 'Satyajit Mohapatra',
        roll: 'CS-2024-082',
        hostel: 'Aryabhatta Hostel, Room 304',
        phone: '+91 98610 99823',
        parentPhone: '+91 98610 11223',
        purpose: 'Visiting Apollo Clinic for routine medical checkup & medicines',
        destination: 'Apollo Clinic, Cuttack Road',
        appliedDate: '01 Oct 2026',
        appliedTime: '03:30 PM',
        outTime: '04:00 PM',
        expectedReturnTime: '07:30 PM',
        timeLimitHours: '3.5 Hours',
        status: 'APPROVED',
        wardenApprovedBy: 'Dr. K.C. Swain (Hostel Warden)',
        wardenApprovalTime: '01 Oct 2026 at 03:45 PM',
        wardenNotes: 'Approved. Strictly return by 07:30 PM before evening roll call.',
        qrCodeData: 'OUTPASS:OP-5521:student1:CS-2024-082:EXP-0730PM',
        movement: {
          exitScanned: false,
          exitTime: null,
          exitSecurityOfficer: null,
          entryScanned: false,
          entryTime: null,
          entrySecurityOfficer: null,
          isLate: false,
          lateMinutes: 0
        }
      },
      {
        id: 'OP-5518',
        institutionId: 'INST-001',
        passType: 'OUTPASS',
        category: 'Market / Personal Errand',
        studentId: 'student2',
        studentName: 'Rahul Verma',
        roll: 'CS-2024-015',
        hostel: 'Bhaskara Hostel, Room 212',
        phone: '+91 98610 88771',
        parentPhone: '+91 97610 22334',
        purpose: 'Purchasing hardware components for robotics lab project',
        destination: 'Saheed Nagar Electronics Market',
        appliedDate: '01 Oct 2026',
        appliedTime: '02:00 PM',
        outTime: '02:30 PM',
        expectedReturnTime: '06:00 PM',
        timeLimitHours: '3.5 Hours',
        status: 'ACTIVE_OUTSIDE',
        wardenApprovedBy: 'Dr. K.C. Swain (Hostel Warden)',
        wardenApprovalTime: '01 Oct 2026 at 02:15 PM',
        wardenNotes: 'Approved for electronic supplies.',
        qrCodeData: 'OUTPASS:OP-5518:student2:CS-2024-015:EXP-0600PM',
        movement: {
          exitScanned: true,
          exitTime: '01 Oct 2026 at 02:35 PM',
          exitSecurityOfficer: 'Officer Rajesh Kumar (Main Gate #1)',
          entryScanned: false,
          entryTime: null,
          entrySecurityOfficer: null,
          isLate: false,
          lateMinutes: 0
        }
      }
    ];
  }

  // 8. Seed sample Leave Applications for INST-001
  if (!db.leaveApplications || db.leaveApplications.length === 0) {
    db.leaveApplications = [
      {
        id: 'LP-8840',
        institutionId: 'INST-001',
        passType: 'LEAVE',
        leaveType: 'Home Visit / Family Event',
        studentId: 'student1',
        studentName: 'Satyajit Mohapatra',
        roll: 'CS-2024-082',
        department: 'Computer Science & Engineering',
        semester: 'Semester 5',
        hostel: 'Aryabhatta Hostel, Room 304',
        phone: '+91 98610 99823',
        parentName: 'Mr. N. Mohapatra',
        parentPhone: '+91 98610 11223',
        reason: 'Attending cousin sister wedding ceremony and family gathering at home in Cuttack',
        destinationAddress: 'Plot 42, Badambadi, Cuttack, Odisha - 753012',
        fromDate: '2026-10-02',
        fromTime: '08:00',
        toDate: '2026-10-05',
        toTime: '20:00',
        totalDays: 3,
        travelMode: 'Express Bus / Train',
        status: 'APPROVED',
        approvalWorkflow: {
          coordinator: {
            verified: true,
            officerName: 'Prof. A.K. Sharma (Academic Coordinator)',
            timestamp: '01 Oct 2026 at 11:30 AM',
            remarks: 'Verified. Student has 88% attendance and no test clash.'
          },
          superintendent: {
            verified: true,
            officerName: 'Dr. Manas Jena (Hostel Superintendent)',
            timestamp: '01 Oct 2026 at 01:15 PM',
            remarks: 'Verified hostel dues clear. Mess leave rebate applied for 3 days.'
          },
          warden: {
            approved: true,
            officerName: 'Dr. K.C. Swain (Chief Hostel Warden)',
            timestamp: '01 Oct 2026 at 02:45 PM',
            remarks: 'Spoke with parent Mr. N. Mohapatra. Leave pass confirmed and granted.'
          }
        },
        qrCodeData: 'LEAVE:LP-8840:student1:CS-2024-082:RETURN-05OCT',
        movement: {
          exitScanned: false,
          exitTime: null,
          exitSecurityOfficer: null,
          entryScanned: false,
          entryTime: null,
          entrySecurityOfficer: null,
          isLate: false
        }
      }
    ];
  }

  // Tag all existing array records with institutionId
  ['outpasses', 'leaveApplications', 'gateMovements', 'attendanceSessions', 'feePayments', 'feedbackList'].forEach(tbl => {
    if (Array.isArray(db[tbl])) {
      db[tbl].forEach(item => {
        if (!item.institutionId) item.institutionId = 'INST-001';
      });
    }
  });

  saveDb(db);
}

/**
 * Atomic persistent write:
 * Writes to a temporary file first, then atomically replaces DB_FILE
 * to prevent corruption during unexpected shutdowns or concurrency.
 */
function saveDb(data) {
  try {
    cachedDb = data;
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    const tmpFile = path.join(DATA_DIR, `campus_db.tmp.${process.pid}.${Date.now()}`);
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpFile, DB_FILE);

    maybeCreateBackup(data);

    // Asynchronously mirror updates to Supabase Cloud if configured
    try {
      const { isSupabaseConfigured, syncLocalToSupabase } = require('./supabase');
      if (isSupabaseConfigured()) {
        syncLocalToSupabase(data).catch(() => {});
      }
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('Error writing to campus_db.json:', err);
    return false;
  }
}

let lastBackupTime = 0;
function maybeCreateBackup(data) {
  const now = Date.now();
  if (now - lastBackupTime > 3600 * 1000) {
    lastBackupTime = now;
    try {
      if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(BACKUP_DIR, `campus_db_${stamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');

      const files = fs.readdirSync(BACKUP_DIR).sort();
      while (files.length > 5) {
        const oldest = files.shift();
        fs.unlinkSync(path.join(BACKUP_DIR, oldest));
      }
    } catch (e) {
      // Non-fatal backup failure
    }
  }
}

function getDb() {
  if (!cachedDb) return loadDb();
  return cachedDb;
}

// Table helper methods
function getTable(tableName) {
  const db = getDb();
  return db[tableName];
}

function insertRecord(tableName, record) {
  const db = getDb();
  if (Array.isArray(db[tableName])) {
    db[tableName].unshift(record);
    saveDb(db);
    return record;
  } else if (typeof db[tableName] === 'object' && db[tableName] !== null) {
    const key = record.id || record.studentId || `id_${Date.now()}`;
    db[tableName][key] = record;
    saveDb(db);
    return record;
  }
  return null;
}

function updateRecord(tableName, key, updates) {
  const db = getDb();
  if (db[tableName] && db[tableName][key]) {
    db[tableName][key] = { ...db[tableName][key], ...updates };
    saveDb(db);
    return db[tableName][key];
  }
  return null;
}

// ================= MULTI-TENANT SAAS INSTITUTION HELPERS =================

function getInstitutions() {
  const db = getDb();
  return Object.values(db.institutions || {});
}

function getInstitution(id) {
  const db = getDb();
  return (db.institutions && db.institutions[id]) ? db.institutions[id] : null;
}

function saveInstitution(id, data) {
  const db = getDb();
  if (!db.institutions) db.institutions = {};
  db.institutions[id] = { ...(db.institutions[id] || {}), ...data };
  saveDb(db);
  return db.institutions[id];
}

function createInstitution(data) {
  const db = getDb();
  if (!db.institutions) db.institutions = {};

  const instId = data.id || `INST-${String(Object.keys(db.institutions).length + 1).padStart(3, '0')}`;
  const now = new Date();
  const startDate = now.toISOString().split('T')[0];
  const duration = data.durationDays || 365;
  const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newInst = {
    id: instId,
    code: data.code || `CAMPUS-${Date.now().toString().slice(-4)}`,
    name: data.name || 'New Educational Institution',
    shortName: data.shortName || data.name || 'Institution',
    address: data.address || 'Campus Address',
    regdNo: data.regdNo || `UGC-OD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    logo: data.logo || '🏛️',
    contactEmail: data.contactEmail || 'admin@institution.edu',
    contactPhone: data.contactPhone || '+91 98610 12345',
    adminUserId: data.adminUserId || `admin_${instId.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    subscription: {
      plan: data.planId || 'PLAN-YEARLY',
      planName: data.planName || 'Annual Institutional License',
      amount: data.amount || 49999,
      startDate: startDate,
      endDate: endDate,
      status: 'ACTIVE',
      autoRenew: true,
      daysRemaining: duration,
      lastRenewedAt: `${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    },
    paymentConfig: {
      bankName: data.bankName || 'State Bank of India',
      branchName: data.branchName || 'Main Campus Branch',
      accountName: data.accountName || `${data.name || 'Institution'} Fee Account`,
      accountNumber: data.accountNumber || '123456789012',
      ifscCode: data.ifscCode || 'SBIN0001234',
      upiId: data.upiId || 'campusfee@sbi',
      qrScannerUrl: data.qrScannerUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(data.upiId || 'campusfee@sbi')}&pn=${encodeURIComponent(data.name || 'Campus')}&cu=INR`,
      instructions: 'Transfer fees via UPI QR or direct bank transfer. E-receipt generated automatically.'
    },
    receiptTemplate: {
      headerTitle: (data.name || 'INSTITUTION').toUpperCase(),
      subTitle: data.subTitle || '(An Autonomous Educational Institution)',
      regdNoDisplay: `Institutional Regd. No: ${data.regdNo || 'REGD-2026-001'}`,
      addressDisplay: data.address || 'Main Campus',
      signatoryTitle: data.signatoryTitle || 'Comptroller of Finance',
      signatoryName: data.signatoryName || 'Accounts Officer',
      receiptPrefix: `${(data.code || 'REC').toUpperCase()}-2026/`,
      sealText: 'OFFICIAL DIGITAL VERIFICATION SEAL',
      footerNotice: 'This is an authentic, system-generated digital e-receipt verified by the institution. No physical signature required.'
    }
  };

  db.institutions[instId] = newInst;

  // Create initial Master Administrator user account for this institution
  if (!db.users) db.users = {};
  const adminId = newInst.adminUserId;
  const adminPassword = data.adminPassword || 'campus123';
  db.users[adminId] = {
    id: adminId,
    loginId: data.adminLoginId || `ADM-${instId.slice(-3)}`,
    role: 'admin',
    institutionId: instId,
    name: data.adminName || 'Institutional Administrator',
    staffId: data.adminLoginId || `ADM-${instId.slice(-3)}`,
    dept: 'Central Academic Administration',
    designation: 'Registrar & Chief Administrator',
    avatar: '👨‍💼',
    password: adminPassword,
    passwordChanged: false,
    createdBy: 'SaaS Platform Owner (Master License Provisioning)',
    createdAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  saveDb(db);
  return { institution: newInst, adminUser: db.users[adminId], tempPassword: adminPassword };
}

function renewSubscription(institutionId, planId) {
  const db = getDb();
  const inst = db.institutions && db.institutions[institutionId];
  if (!inst) return null;

  if (planId === 'EXPIRED' || planId === 'EXPIRE') {
    inst.subscription = {
      ...(inst.subscription || {}),
      status: 'EXPIRED',
      endDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      daysRemaining: 0
    };
    saveDb(db);
    return inst;
  }

  const planMap = {
    'YEARLY_PRO': 'PLAN-YEARLY',
    'MONTHLY_FLEX': 'PLAN-MONTHLY',
    'ENTERPRISE_3YR': 'PLAN-ENTERPRISE'
  };
  const normalizedPlanId = planMap[planId] || planId;

  const plan = (db.subscriptionPlans || []).find(p => p.id === normalizedPlanId || p.id === planId) || {
    id: normalizedPlanId || 'PLAN-YEARLY',
    name: 'Annual Institutional License',
    durationDays: 365,
    priceINR: 0
  };

  const now = new Date();
  const startDate = now.toISOString().split('T')[0];
  const end = new Date(now.getTime() + (plan.durationDays || 365) * 24 * 60 * 60 * 1000);
  const endDate = end.toISOString().split('T')[0];

  inst.subscription = {
    plan: plan.id,
    planName: plan.name,
    amount: plan.priceINR,
    startDate: startDate,
    endDate: endDate,
    status: 'ACTIVE',
    lastRenewedAt: `${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    autoRenew: true,
    daysRemaining: plan.durationDays
  };

  // Add system activity log
  if (!db.activityHistory) db.activityHistory = [];
  db.activityHistory.unshift({
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'SUBSCRIPTION',
    badgeColor: 'attendance',
    actorRole: 'SaaS Platform Authority',
    actorName: 'Subscription Engine',
    institutionId: institutionId,
    description: `Institutional License for "${inst.name}" successfully renewed under ${plan.name} (Valid until ${endDate}). Full campus access unlocked.`,
    timeInfo: {
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      date: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  });

  saveDb(db);
  return inst;
}

function savePaymentConfig(institutionId, config) {
  const db = getDb();
  const inst = db.institutions && db.institutions[institutionId];
  if (!inst) return null;

  // If upiId changed and no custom qrScannerUrl provided, auto-generate standard QR
  let qrUrl = config.qrScannerUrl;
  if (!qrUrl && config.upiId) {
    qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(inst.name)}&cu=INR`;
  }

  const branch = config.branch || config.branchName || (inst.paymentConfig ? inst.paymentConfig.branch : '');
  const holder = config.accountHolder || config.accountName || (inst.paymentConfig ? inst.paymentConfig.accountHolder : '');
  const ifsc = config.ifsc || config.ifscCode || (inst.paymentConfig ? inst.paymentConfig.ifsc : '');

  inst.paymentConfig = {
    ...(inst.paymentConfig || {}),
    ...config,
    branch: branch,
    branchName: branch,
    accountHolder: holder,
    accountName: holder,
    ifsc: ifsc,
    ifscCode: ifsc,
    qrScannerUrl: qrUrl || (inst.paymentConfig ? inst.paymentConfig.qrScannerUrl : '')
  };

  saveDb(db);
  return inst.paymentConfig;
}

function saveReceiptTemplate(institutionId, template) {
  const db = getDb();
  const inst = db.institutions && db.institutions[institutionId];
  if (!inst) return null;

  const title = template.collegeName || template.headerTitle || (inst.receiptTemplate ? inst.receiptTemplate.collegeName : '');
  const sub = template.subtitle || template.subTitle || (inst.receiptTemplate ? inst.receiptTemplate.subtitle : '');
  const addr = template.address || template.addressDisplay || (inst.receiptTemplate ? inst.receiptTemplate.address : '');
  const sig = template.signatory || template.signatoryTitle || (inst.receiptTemplate ? inst.receiptTemplate.signatory : '');
  const terms = template.terms || template.footerNotice || (inst.receiptTemplate ? inst.receiptTemplate.terms : '');

  inst.receiptTemplate = {
    ...(inst.receiptTemplate || {}),
    ...template,
    collegeName: title,
    headerTitle: title,
    subtitle: sub,
    subTitle: sub,
    address: addr,
    addressDisplay: addr,
    signatory: sig,
    signatoryTitle: sig,
    signatoryName: sig,
    terms: terms,
    footerNotice: terms
  };

  saveDb(db);
  return inst.receiptTemplate;
}

function resetToCleanDb(adminName = 'Dr. R.N. Sen', adminLoginId = 'ADM-001', adminPassword = 'campus123') {
  const clean = getDefaultSchema();
  clean.mode = 'CLEAN_SLATE';

  // Seed default clean institution INST-001
  clean.institutions['INST-001'] = {
    id: 'INST-001',
    code: 'CAMPUS-01',
    name: 'Government Engineering College, Bhubaneswar',
    shortName: 'GEC Bhubaneswar',
    address: 'Chandaka Industrial Estate, Bhubaneswar, Odisha - 751024',
    regdNo: 'UGC-OD-2004-9812',
    logo: '🏛️',
    contactEmail: 'admin@gec.edu.in',
    contactPhone: '+91 674 2309110',
    adminUserId: 'admin',
    subscription: {
      plan: 'PLAN-YEARLY',
      planName: 'Annual Institutional License',
      amount: 49999,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ACTIVE',
      autoRenew: true,
      daysRemaining: 365,
      lastRenewedAt: 'Institutional Initial Setup'
    },
    paymentConfig: {
      bankName: 'State Bank of India',
      branchName: 'University Campus Branch',
      accountName: 'GEC Institutional Fee Collection Fund',
      accountNumber: '309811442009',
      ifscCode: 'SBIN0010234',
      upiId: 'gecbhubaneswar@sbi',
      qrScannerUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=gecbhubaneswar@sbi&pn=GEC+Bhubaneswar&cu=INR',
      instructions: 'Transfer fees via UPI or direct bank transfer. Official e-receipt generated automatically.'
    },
    receiptTemplate: {
      headerTitle: 'GOVERNMENT ENGINEERING COLLEGE, BHUBANESWAR',
      subTitle: '(An Autonomous Institution Affiliated to BPUT • Accredited A+ by NAAC)',
      regdNoDisplay: 'Institutional Regd. No: UGC-OD-2004-9812',
      addressDisplay: 'Chandaka Industrial Estate, Bhubaneswar, Odisha - 751024',
      signatoryTitle: 'Comptroller of Finance & Accounts',
      signatoryName: 'Prof. S.K. Mohanty',
      receiptPrefix: 'GEC-REC-2026/',
      sealText: 'OFFICIAL DIGITAL VERIFICATION SEAL • GEC FINANCE',
      footerNotice: 'This is an authentic, system-generated digital e-receipt verified under the Smart Campus Platform.'
    }
  };

  clean.users = {
    superadmin: {
      id: 'superadmin',
      loginId: 'owner',
      name: 'Smart Campus SaaS Platform Authority',
      role: 'superadmin',
      password: 'campusowner123',
      email: 'licensing@smartcampus.cloud',
      phone: '+91 674 2901234',
      avatar: '👑'
    },
    admin: {
      id: 'admin',
      loginId: adminLoginId,
      role: 'admin',
      institutionId: 'INST-001',
      name: adminName,
      staffId: adminLoginId,
      dept: 'Central Academic Administration',
      designation: 'Registrar & Chief Administrator',
      avatar: '👨‍💼',
      password: adminPassword,
      passwordChanged: false,
      createdBy: 'Board of Governors (Institutional Setup)',
      createdAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  };

  clean.outpasses = [];
  clean.leaveApplications = [];
  clean.gateMovements = [];
  clean.attendanceSessions = [];
  clean.feedbackList = [];
  clean.smsLogs = [];
  clean.feePayments = [];
  clean.feeReminders = [];
  clean.activityHistory = [
    {
      id: 'ACT-001',
      actionType: 'SYSTEM',
      badgeColor: 'login',
      actorRole: 'Administrator',
      actorName: adminName,
      institutionId: 'INST-001',
      description: 'Institutional Database Initialized in Clean Slate (Production Live Mode). Ready for live multi-tenant college operations.',
      timeInfo: {
        day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  ];

  cachedDb = clean;
  saveDb(cachedDb);
  return cachedDb;
}

function populateFullDemoData() {
  const schema = getDefaultSchema();
  schema.mode = 'DEMO';

  seedMultiTenantData(schema);
  cachedDb = schema;
  saveDb(cachedDb);
  return cachedDb;
}

function getSubscriptionPlans() {
  const db = getDb();
  return db.subscriptionPlans || [];
}

function saveSubscriptionPlans(newPlans) {
  const db = getDb();
  if (Array.isArray(newPlans)) {
    db.subscriptionPlans = newPlans;
    saveDb(db);
  }
  return db.subscriptionPlans;
}

module.exports = {
  getDb,
  saveDb,
  loadDb,
  getTable,
  insertRecord,
  updateRecord,
  resetToCleanDb,
  populateFullDemoData,
  getInstitutions,
  getInstitution,
  saveInstitution,
  createInstitution,
  renewSubscription,
  savePaymentConfig,
  saveReceiptTemplate,
  getSubscriptionPlans,
  saveSubscriptionPlans,
  DATA_DIR,
  BACKUP_DIR,
  DB_FILE
};
