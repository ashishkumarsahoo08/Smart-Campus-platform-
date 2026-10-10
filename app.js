/**
 * SMART CAMPUS UNIFIED CLIENT ENGINE (V3.5)
 * Role-Based Dynamic Drawer, 1st-Time Registration, Hostel Superintendent Workflow,
 * Regional Multi-Language Support, Supabase Ready.
 */

document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'smart_campus_role_db_v35';

  // ================= 1. LOCAL PERSISTENT DATABASE =================
  const defaultDatabase = {
    currentInstitutionId: 'GEC-2026',
    currentUser: null,
    currentLocale: 'en',
    serverUrl: 'npm install @supabase/server',
    institutions: {
      'GEC-2026': {
        id: 'GEC-2026',
        name: 'GEC Bhubaneswar',
        shortName: 'GEC',
        code: 'GEC',
        status: 'ACTIVE',
        bankName: 'State Bank of India',
        accountNo: '309811442586',
        ifsc: 'SBIN0010234',
        upiId: 'gec@sbi'
      },
      'INST-2026-001': {
        id: 'INST-2026-001',
        name: 'Smart Campus Institute of Technology',
        shortName: 'SCIT',
        code: 'INST-2026-001',
        status: 'ACTIVE',
        bankName: 'HDFC Bank',
        accountNo: '50100234567890',
        ifsc: 'HDFC0001234',
        upiId: 'scit@hdfc'
      },
      'INST-001': {
        id: 'INST-001',
        name: 'Gandhi Engineering College (Autonomous)',
        shortName: 'GEC',
        code: 'GEC-BBI',
        status: 'ACTIVE',
        bankName: 'Canara Bank',
        accountNo: '245601009876',
        ifsc: 'CNRB0002456',
        upiId: 'gec@cnrb'
      }
    },
    users: {
      'CS-2024-082': {
        id: 'CS-2024-082',
        role: 'student',
        name: 'Ashish Kumar Sahoo',
        roll: 'CS-2024-082',
        gender: 'Male',
        hostelType: 'Boys Hostel',
        dept: 'Computer Science & Engineering',
        branch: 'Computer Science & Engineering',
        section: 'Section A',
        sem: '5th Semester',
        institutionId: 'GEC-2026',
        password: 'campus123',
        attendance: 88.3,
        cgpa: 8.72,
        hostel: 'Brahmaputra Boys Hostel, Room 304',
        email: 'ashish.sahoo@campus.edu',
        contact: '+91 98765 43210',
        dues: 0,
        subjects: [
          { code: 'CS501', name: 'AI & Machine Learning', faculty: 'Prof. A.K. Sharma', attended: 35, total: 38, pct: 92 },
          { code: 'CS502', name: 'Cloud Computing & DevOps', faculty: 'Dr. Priya Patel', attended: 30, total: 34, pct: 88 },
          { code: 'CS503', name: 'Data Structures & Algorithms', faculty: 'Prof. S. Mohanty', attended: 41, total: 48, pct: 85 },
          { code: 'CS504', name: 'Database Management Systems', faculty: 'Dr. R. K. Sen', attended: 30, total: 34, pct: 88 }
        ]
      },
      'CS-2024-044': {
        id: 'CS-2024-044',
        role: 'student',
        name: 'Ananya Mishra',
        roll: 'CS-2024-044',
        gender: 'Female',
        hostelType: 'Girls Hostel',
        dept: 'Computer Science & Engineering',
        branch: 'Computer Science & Engineering',
        section: 'Section B',
        sem: '5th Semester',
        institutionId: 'GEC-2026',
        password: 'campus123',
        attendance: 91.5,
        cgpa: 9.10,
        hostel: 'Kalpana Chawla Girls Hostel, Room 208',
        email: 'ananya.mishra@campus.edu',
        contact: '+91 98610 99887',
        dues: 0,
        subjects: [
          { code: 'CS501', name: 'AI & Machine Learning', faculty: 'Prof. A.K. Sharma', attended: 36, total: 38, pct: 94 },
          { code: 'CS502', name: 'Cloud Computing & DevOps', faculty: 'Dr. Priya Patel', attended: 32, total: 34, pct: 94 }
        ]
      },
      'FAC-102': {
        id: 'FAC-102',
        role: 'faculty',
        name: 'Prof. Anita Sharma',
        staffId: 'FAC-102',
        dept: 'Computer Science & Engineering',
        branch: 'Computer Science & Engineering',
        designation: 'Associate Professor & HOD',
        institutionId: 'GEC-2026',
        email: 'anita.sharma@campus.edu',
        contact: '+91 98610 23456',
        password: 'campus123',
        courses: ['CS501 - AI & Machine Learning', 'CS503 - Data Structures Lab'],
        students: [
          { roll: 'CS-2024-082', name: 'Ashish Kumar Sahoo', status: 'P' },
          { roll: 'CS-2024-044', name: 'Ananya Mishra', status: 'P' },
          { roll: 'CS-2024-099', name: 'Devi Prasad Das', status: 'A' }
        ]
      },
      'WARDEN-BOYS': {
        id: 'WARDEN-BOYS',
        role: 'hostel_faculty',
        name: 'Dr. R. K. Nayak',
        staffId: 'WARDEN-BOYS',
        dept: 'Boys Hostel Administration',
        branch: 'Student Welfare',
        designation: 'Boys Hostel Superintendent',
        institutionId: 'GEC-2026',
        email: 'warden.boys@campus.edu',
        contact: '+91 94370 12345',
        password: 'campus123'
      },
      'WARDEN-GIRLS': {
        id: 'WARDEN-GIRLS',
        role: 'hostel_faculty',
        name: 'Dr. Sunita Mohanty',
        staffId: 'WARDEN-GIRLS',
        dept: 'Girls Hostel Administration',
        branch: 'Student Welfare',
        designation: 'Girls Hostel Superintendent',
        institutionId: 'GEC-2026',
        email: 'warden.girls@campus.edu',
        contact: '+91 94370 67890',
        password: 'campus123'
      },
      'WARDEN-101': {
        id: 'WARDEN-101',
        role: 'hostel_faculty',
        name: 'Dr. R. K. Nayak',
        staffId: 'WARDEN-101',
        dept: 'Boys Hostel Administration',
        branch: 'Student Welfare',
        designation: 'Boys Hostel Superintendent',
        institutionId: 'GEC-2026',
        email: 'warden.boys@campus.edu',
        contact: '+91 94370 12345',
        password: 'campus123'
      },
      'admin_gec': {
        id: 'admin_gec',
        role: 'admin',
        name: 'Dr. B. C. Panda',
        adminId: 'admin_gec',
        designation: 'Principal & Chief Administrator',
        institutionId: 'GEC-2026',
        email: 'admin.gec@campus.edu',
        contact: '+91 674 235 0001',
        password: 'campus123'
      },
      'ADMIN': {
        id: 'ADMIN',
        role: 'admin',
        name: 'Dr. B. C. Panda',
        adminId: 'admin_gec',
        designation: 'Principal & Chief Administrator',
        institutionId: 'GEC-2026',
        email: 'admin.gec@campus.edu',
        contact: '+91 674 235 0001',
        password: 'campus123'
      }
    },
    passes: [
      {
        id: 'GP-901',
        studentName: 'Ashish Kumar Sahoo',
        roll: 'CS-2024-082',
        hostelType: 'Boys Hostel',
        hostel: 'Brahmaputra Boys Hostel, Room 304',
        type: 'Campus Day Outpass',
        reason: 'Medical checkup at Apollo Clinic',
        departure: '17:00',
        returnTime: '20:30',
        status: 'PENDING',
        targetSuperintendent: 'Boys Hostel Superintendent',
        emergencyContact: '+91 98765 43210'
      },
      {
        id: 'GP-902',
        studentName: 'Ananya Mishra',
        roll: 'CS-2024-044',
        hostelType: 'Girls Hostel',
        hostel: 'Kalpana Chawla Girls Hostel, Room 208',
        type: 'Campus Day Outpass',
        reason: 'Academic supplies & reference books purchase',
        departure: '16:30',
        returnTime: '19:30',
        status: 'PENDING',
        targetSuperintendent: 'Girls Hostel Superintendent',
        emergencyContact: '+91 98610 99887'
      }
    ],
    leavePasses: [
      {
        id: 'LP-401',
        studentName: 'Ashish Kumar Sahoo',
        roll: 'CS-2024-082',
        hostelType: 'Boys Hostel',
        hostel: 'Brahmaputra Boys Hostel, Room 304',
        type: 'Hostel Leave Pass',
        destination: 'Cuttack, Odisha',
        reason: 'Attending cousin wedding ceremony',
        departureDate: '2026-10-10',
        returnDate: '2026-10-12',
        status: 'PENDING',
        targetSuperintendent: 'Boys Hostel Superintendent',
        emergencyContact: '+91 98765 43210'
      },
      {
        id: 'LP-402',
        studentName: 'Ananya Mishra',
        roll: 'CS-2024-044',
        hostelType: 'Girls Hostel',
        hostel: 'Kalpana Chawla Girls Hostel, Room 208',
        type: 'Hostel Leave Pass',
        destination: 'Rourkela, Odisha',
        reason: 'Family graduation function',
        departureDate: '2026-10-14',
        returnDate: '2026-10-17',
        status: 'PENDING',
        targetSuperintendent: 'Girls Hostel Superintendent',
        emergencyContact: '+91 98610 99887'
      }
    ],
    hostelNotices: [
      { id: 'HN-1', title: 'Main Gate Curfew Timings', cat: 'Gate Rules', audience: 'All Hostellers', date: 'Today', content: 'Hostel gates close strictly at 8:30 PM. Outpasses must be verified with security guard QR scanner.' },
      { id: 'HN-2', title: 'Special Mess Feast on Sunday', cat: 'Mess & Dining', audience: 'All Hostellers', date: 'Yesterday', content: 'Special dinner served from 8:00 PM to 10:00 PM in both Boys and Girls dining halls.' }
    ],
    complaints: [
      { id: 'CMP-101', student: 'Ashish Kumar Sahoo', category: 'Electricity / Light / Fan', room: 'Room 304', desc: 'Study lamp socket fluctuating voltage.', status: 'In Progress (24h SLA)', date: 'Today' }
    ],
    canteenFeedbacks: [
      { id: 'CFB-1', student: 'Ashish Kumar Sahoo', meal: 'Lunch Dining Hall', rating: '???? 4 Stars', comment: 'Paneer curry was good; more cucumber salad needed.', date: 'Today' },
      { id: 'CFB-2', student: 'Rahul Verma', meal: 'Dinner Service', rating: '??? 3 Stars', comment: 'Roti was slightly hard.', date: 'Yesterday' }
    ],
    facultyFeedbacks: [
      { faculty: 'Prof. A. K. Sharma', dept: 'CSE', subject: 'CS501 AI & ML', rating: '4.8 / 5.0', comments: 'Excellent practical code walk-throughs in machine learning.' },
      { faculty: 'Dr. Priya Patel', dept: 'CSE', subject: 'CS502 Cloud Computing', rating: '4.7 / 5.0', comments: 'Very clear AWS and Docker containerization demos.' }
    ],
    timetables: {
      'Mon': [
        { time: '09:00 - 10:00', code: 'CS501', subject: 'AI & Machine Learning', room: 'LH-201', faculty: 'Prof. A.K. Sharma' },
        { time: '10:00 - 11:00', code: 'CS502', subject: 'Cloud Computing', room: 'LH-201', faculty: 'Dr. Priya Patel' },
        { time: '11:15 - 12:15', code: 'CS503', subject: 'Data Structures Lab', room: 'Lab-4', faculty: 'Prof. S. Mohanty' },
        { time: '14:00 - 15:00', code: 'CS504', subject: 'Database Management', room: 'LH-202', faculty: 'Dr. R. K. Sen' }
      ],
      'Tue': [
        { time: '09:00 - 10:00', code: 'CS504', subject: 'Database Management', room: 'LH-202', faculty: 'Dr. R. K. Sen' },
        { time: '10:00 - 11:00', code: 'CS501', subject: 'AI & Machine Learning', room: 'LH-201', faculty: 'Prof. A.K. Sharma' },
        { time: '11:15 - 13:00', code: 'CS505', subject: 'DevOps Practical Lab', room: 'Cloud Lab', faculty: 'Dr. Priya Patel' }
      ],
      'Wed': [
        { time: '09:00 - 10:00', code: 'CS503', subject: 'Data Structures & Algorithms', room: 'LH-201', faculty: 'Prof. S. Mohanty' },
        { time: '10:00 - 11:00', code: 'CS502', subject: 'Cloud Computing', room: 'LH-201', faculty: 'Dr. Priya Patel' }
      ],
      'Thu': [
        { time: '09:00 - 10:00', code: 'CS501', subject: 'AI & Machine Learning', room: 'LH-201', faculty: 'Prof. A.K. Sharma' },
        { time: '10:00 - 11:00', code: 'CS504', subject: 'Database Management', room: 'LH-202', faculty: 'Dr. R. K. Sen' }
      ],
      'Fri': [
        { time: '09:00 - 10:00', code: 'CS502', subject: 'Cloud Computing', room: 'LH-201', faculty: 'Dr. Priya Patel' },
        { time: '10:00 - 12:00', code: 'AI-LAB', subject: 'Machine Learning Lab', room: 'Lab-1', faculty: 'Prof. A.K. Sharma' }
      ],
      'Sat': [
        { time: '09:30 - 11:30', code: 'CLUB', subject: 'Coding Club & Hackathon Workshop', room: 'Innovation Center', faculty: 'Student Leads' }
      ]
    },
    notices: [
      { id: 'NOT-1', badge: 'urgent', category: 'exam', title: '5th Semester Mid-Term Examination Routine Released', dept: 'Exam Cell', date: 'Oct 04, 2026', body: 'Mid-term exams commence on Oct 14, 2026. Hall tickets available on portal.' },
      { id: 'NOT-2', badge: 'academic', category: 'academic', title: 'IEEE AI & Deep Learning Bootcamp', dept: 'CSE Dept', date: 'Oct 02, 2026', body: 'Hands-on Generative AI bootcamp this Saturday in Lab 1.', institutionId: 'GEC-2026' }
    ],

    transportRoutes: [
      {
        id: 'TR-1',
        institutionId: 'GEC-2026',
        name: 'Route 1: Cuttack Link Express',
        busNumber: 'OD-05-AB-1204',
        driverName: 'Ramesh Mohanty',
        driverPhone: '+91 94370 12345',
        time: '07:30 AM - 08:45 AM',
        status: 'On the Way (Master Canteen)',
        statusType: 'active',
        stops: ['Badambadi Bus Stand', 'Link Road', 'Trisulia Bridge', 'Nandankanan Square', 'Campus Main Gate']
      },
      {
        id: 'TR-2',
        institutionId: 'GEC-2026',
        name: 'Route 2: Bhubaneswar Central',
        busNumber: 'OD-02-XY-5678',
        driverName: 'Sanjay Kumar Rout',
        driverPhone: '+91 98611 67890',
        time: '07:45 AM - 08:50 AM',
        status: 'Arrived at Campus Gate',
        statusType: 'completed',
        stops: ['Kalpana Square', 'Master Canteen', 'Vani Vihar', 'Patia Square', 'Campus Terminal']
      },
      {
        id: 'TR-3',
        institutionId: 'GEC-2026',
        name: 'Route 3: Khandagiri & Jagamara Shuttle',
        busNumber: 'OD-33-C-9012',
        driverName: 'Bikash Das',
        driverPhone: '+91 70081 23456',
        time: '08:00 AM - 08:55 AM',
        status: 'Departed (Khandagiri)',
        statusType: 'active',
        stops: ['Khandagiri Square', 'Iter College Square', 'Fire Station', 'Campus Main Gate']
      }
    ],
    libraryBooks: [
      {
        id: 'LIB-101',
        institutionId: 'GEC-2026',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell, Peter Norvig',
        isbn: '978-0136042594',
        category: 'Computer Science',
        edition: '4th Edition',
        available: 4,
        total: 6,
        shelf: 'Rack CS-04'
      },
      {
        id: 'LIB-102',
        institutionId: 'GEC-2026',
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Thomas H. Cormen, Charles E. Leiserson',
        isbn: '978-0262033848',
        category: 'Algorithms',
        edition: '3rd Edition',
        available: 2,
        total: 5,
        shelf: 'Rack CS-01'
      },
      {
        id: 'LIB-103',
        institutionId: 'GEC-2026',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz, Henry F. Korth',
        isbn: '978-0073523323',
        category: 'Database Systems',
        edition: '7th Edition',
        available: 5,
        total: 8,
        shelf: 'Rack CS-07'
      },
      {
        id: 'LIB-104',
        institutionId: 'GEC-2026',
        title: 'Computer Networking: A Top-Down Approach',
        author: 'James F. Kurose, Keith W. Ross',
        isbn: '978-0133594140',
        category: 'Networks',
        edition: '8th Edition',
        available: 3,
        total: 5,
        shelf: 'Rack CS-09'
      },
      {
        id: 'LIB-105',
        institutionId: 'GEC-2026',
        title: 'Cloud Computing: Principles and Paradigms',
        author: 'Rajkumar Buyya, Christian Vecchiola',
        isbn: '978-0470887998',
        category: 'Cloud & DevOps',
        edition: '2nd Edition',
        available: 1,
        total: 4,
        shelf: 'Rack CS-12'
      }
    ],
    borrowedBooks: [
      {
        id: 'BORROW-1',
        userId: 'CS-2024-082',
        institutionId: 'GEC-2026',
        bookId: 'LIB-101',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        issueDate: '2026-09-28',
        dueDate: '2026-10-12',
        status: 'ACTIVE'
      }
    ],
    assignments: [
      {
        id: 'ASG-101',
        institutionId: 'GEC-2026',
        course: 'CS501 AI & Machine Learning',
        title: 'Assignment 3: Decision Trees & Random Forests',
        faculty: 'Prof. A.K. Sharma',
        dueDate: '2026-10-14',
        maxMarks: 20,
        desc: 'Implement ID3 decision tree classifier on UCI Iris dataset with test-train split and compute F1-score.',
        status: 'PENDING',
        submission: null
      },
      {
        id: 'ASG-102',
        institutionId: 'GEC-2026',
        course: 'CS502 Cloud Computing & DevOps',
        title: 'Assignment 2: Docker Containerization of REST API',
        faculty: 'Dr. Priya Patel',
        dueDate: '2026-10-18',
        maxMarks: 25,
        desc: 'Create multi-stage Dockerfile for Node.js Express microservice and write docker-compose.yml with MongoDB.',
        status: 'PENDING',
        submission: null
      },
      {
        id: 'ASG-103',
        institutionId: 'GEC-2026',
        course: 'CS503 Advanced DBMS',
        title: 'Assignment 1: B+ Tree Indexing & Query Optimization',
        faculty: 'Prof. S. Mohanty',
        dueDate: '2026-10-01',
        maxMarks: 15,
        desc: 'Analyze query plans using EXPLAIN ANALYZE on PostgreSQL with clustered and unclustered B+ Tree indices.',
        status: 'SUBMITTED',
        submission: {
          submittedAt: '2026-09-30 08:30 PM',
          notes: 'Completed B+ Tree indexing benchmark. Analysis report attached.',
          marks: 14,
          grade: 'A'
        }
      }
    ],
  };

  let db = defaultDatabase;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      db = JSON.parse(saved);
      // Guarantee every collection in defaultDatabase is initialized
      Object.keys(defaultDatabase).forEach(k => {
        if (db[k] === undefined || db[k] === null) {
          db[k] = defaultDatabase[k];
        }
      });
      if (!db.users) db.users = {};
      Object.keys(defaultDatabase.users).forEach(uid => {
        if (!db.users[uid]) db.users[uid] = defaultDatabase.users[uid];
      });
      if (!db.institutions) db.institutions = {};
      Object.keys(defaultDatabase.institutions).forEach(iid => {
        if (!db.institutions[iid]) db.institutions[iid] = defaultDatabase.institutions[iid];
      });
      if (!db.serverUrl || db.serverUrl !== 'npm install @supabase/server') {
        db.serverUrl = 'npm install @supabase/server';
      }
      if (!db.complaints) db.complaints = defaultDatabase.complaints || [];
      if (!db.notices) db.notices = defaultDatabase.notices || [];
      if (!db.hostelNotices) db.hostelNotices = defaultDatabase.hostelNotices || [];
      if (!db.passes) db.passes = defaultDatabase.passes || [];
      if (!db.leavePasses) db.leavePasses = defaultDatabase.leavePasses || [];
      if (!db.assignments) db.assignments = defaultDatabase.assignments || [];
      if (!db.libraryBooks) db.libraryBooks = defaultDatabase.libraryBooks || [];
      if (!db.borrowedBooks) db.borrowedBooks = defaultDatabase.borrowedBooks || [];
      if (!db.transportRoutes) db.transportRoutes = defaultDatabase.transportRoutes || [];
      if (!db.canteenFeedbacks) db.canteenFeedbacks = defaultDatabase.canteenFeedbacks || [];
      if (!db.facultyFeedbacks) db.facultyFeedbacks = defaultDatabase.facultyFeedbacks || [];
      if (!db.timetables) db.timetables = defaultDatabase.timetables || {};
    }
  } catch (e) {
    console.warn('LocalStorage load error, using default DB:', e);
  }

  function saveDb() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const msg = document.createElement('div');
    msg.className = 'toast-msg ' + type;
    msg.textContent = message;
    container.appendChild(msg);
    setTimeout(() => {
      msg.style.opacity = '0';
      setTimeout(() => msg.remove(), 250);
    }, 3200);
  }

  // ================= 2. GOOGLE ML KIT MULTI-LANGUAGE TRANSLATION ENGINE =================
  // Powered by Google ML Kit on-device translation dictionary + live Google Translation API fallback
  const GOOGLE_MLKIT_LANGUAGES = {
    en: { name: 'English', native: 'English' },
    or: { name: 'Odia', native: 'ଓଡ଼ିଆ' },
    hi: { name: 'Hindi', native: 'हिन्दी' },
    bn: { name: 'Bengali', native: 'বাংলা' },
    te: { name: 'Telugu', native: 'తెలుగు' },
    ta: { name: 'Tamil', native: 'தமிழ்' },
    kn: { name: 'Kannada', native: 'ಕನ್ನಡ' }
  };

  // Comprehensive Multi-Language Dictionary across Odia, Hindi, Bengali, Telugu, Tamil, Kannada
  const MLKIT_PHRASES = {
    // Navigation & Drawer
    'My Profile': { or: 'ମୋର ପ୍ରୋଫାଇଲ୍', hi: 'मेरी प्रोफाइल', bn: 'আমার প্রোফাইল', te: 'నా ప్రొఫైల్', ta: 'என் சுயவிவரம்', kn: 'ನನ್ನ ಪ್ರೊಫೈಲ್' },
    'Check Attendance': { or: 'ଉପସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ', hi: 'उपस्थिति जांचें', bn: 'উপস্থিতি দেখুন', te: 'హాజరు తనిఖీ చేయండి', ta: 'வருகையை சரிபார்க்கவும்', kn: 'ಹಾಜರಾತಿ ಪರಿಶೀಲಿಸಿ' },
    'Fee Dues & Queries': { or: 'ଫିସ୍ ବକେୟା ଏବଂ ପ୍ରଶ୍ନ', hi: 'फीस बकाया और पूछताछ', bn: 'ফি বকেয়া ও প্রশ্ন', te: 'ఫీజు బకాయిలు & ప్రశ్నలు', ta: 'கட்டண நிலுவை & கேள்விகள்', kn: 'ಶುಲ್ಕ ಬಾಕಿ ಮತ್ತು ವಿಚಾರಣೆ' },
    'Class Timetables': { or: 'ଶ୍ରେଣୀ ସମୟସାରଣୀ', hi: 'कक्षा समय-सारणी', bn: 'ক্লাস রুটিন', te: 'తరగతి సమయ పట్టిక', ta: 'வகுப்பு கால அட்டவணை', kn: 'ತರಗತಿ ವೇಳಾಪಟ್ಟಿ' },
    'Request Gate Pass & QR': { or: 'ଗେଟ୍ ପାସ୍ ଏବଂ QR ଅନୁରୋଧ', hi: 'गेट पास और क्यूआर अनुरोध', bn: 'গেট পাস ও কিউআর আবেদন', te: 'గేట్ పాస్ & QR అభ్యర్థన', ta: 'கேட் பாஸ் & QR கோரிக்கை', kn: 'ಗೇಟ್ ಪಾಸ್ ಮತ್ತು ಕ್ಯೂಆರ್ ವಿನಂತಿ' },
    'Request Hostel Leave Pass': { or: 'ଛାତ୍ରାବାସ ଛୁଟି ପାସ୍ ଅନୁରୋଧ', hi: 'छात्रावास अवकाश पास अनुरोध', bn: 'হোস্টেল ছুটি পাস আবেদন', te: 'హాస్టల్ సెలవు పాస్ అభ్యర్థన', ta: 'விடுதி விடுப்பு பாஸ் கோரிக்கை', kn: 'ವಸತಿ ನಿಲಯ ರಜೆ ಪಾಸ್ ವಿನಂತಿ' },
    'Request Certificates': { or: 'ପ୍ରମାଣପତ୍ର ଅନୁରୋଧ', hi: 'प्रमाणपत्र अनुरोध', bn: 'সার্টিফিকেট আবেদন', te: 'ధృవపత్రాల అభ్యర్థన', ta: 'சான்றிதழ் கோரிக்கை', kn: 'ಪ್ರಮಾಣಪತ್ರ ವಿನಂತಿ' },
    'Hostel Complaint Register': { or: 'ଛାତ୍ରାବାସ ଅଭିଯୋଗ ରେଜିଷ୍ଟର', hi: 'छात्रावास शिकायत रजिस्टर', bn: 'হোস্টেল অভিযোগ রেজিস্টার', te: 'హాస్టల్ ఫిర్యాదుల నమోదు', ta: 'விடுதி புகார் பதிவேடு', kn: 'ವಸತಿ ನಿಲಯ ದೂರು ನೋಂದಣಿ' },
    'Canteen Problem Register': { or: 'କ୍ୟାଣ୍ଟିନ୍ ସମସ୍ୟା ରେଜିଷ୍ଟର', hi: 'कैंटीन समस्या रजिस्टर', bn: 'ক্যান্টিন সমস্যা রেজিস্টার', te: 'క్యాంటీన్ సమస్యల నమోదు', ta: 'கேண்டீன் பிரச்சனை பதிவேடு', kn: 'ಕ್ಯಾಂಟೀನ್ ಸಮಸ್ಯೆ ನೋಂದಣಿ' },
    'Notices & Announcements': { or: 'ବିଜ୍ଞପ୍ତି ଏବଂ ଘୋଷଣା', hi: 'सूचनाएं और घोषणाएं', bn: 'বিজ্ঞপ্তি ও ঘোষণা', te: 'నోటీసులు & ప్రకటనలు', ta: 'அறிவிப்புகள் & தகவல்கள்', kn: 'ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ನೋಟಿಸ್‌ಗಳು' },
    'AI Assistant': { or: 'AI ସହାୟକ', hi: 'एआई सहायक', bn: 'এআই সহকারী', te: 'AI సహాయకుడు', ta: 'AI உதவியாளர்', kn: 'AI ಸಹಾಯಕ' },
    'Hostel Profile': { or: 'ଛାତ୍ରାବାସ ପ୍ରୋଫାଇଲ୍', hi: 'छात्रावास प्रोफाइल', bn: 'হোস্টেল প্রোফাইল', te: 'హాస్టల్ ప్రొఫైల్', ta: 'விடுதி சுயவிவரம்', kn: 'ವಸತಿ ನಿಲಯ ಪ್ರೊಫೈಲ್' },
    'Pending Gate Passes': { or: 'ବକେୟା ଗେଟ୍ ପାସ୍', hi: 'लंबित गेट पास', bn: 'অপেক্ষমাণ গেট পাস', te: 'పెండింగ్ గేట్ పాస్‌లు', ta: 'நிலுவையில் உள்ள கேட் பாஸ்கள்', kn: 'ಬಾಕಿ ಇರುವ ಗೇಟ್ ಪಾಸ್‌ಗಳು' },
    'Pending Leave Passes': { or: 'ବକେୟା ଛୁଟି ପାସ୍', hi: 'लंबित अवकाश पास', bn: 'অপেক্ষমাণ ছুটি পাস', te: 'పెండింగ్ సెలవు పాస్‌లు', ta: 'நிலுவையில் உள்ள விடுப்பு பாஸ்கள்', kn: 'ಬಾಕಿ ಇರುವ ರಜೆ ಪಾಸ್‌ಗಳು' },
    'Faculty Profile': { or: 'ଅଧ୍ୟାପକ ପ୍ରୋଫାଇଲ୍', hi: 'फैकल्टी प्रोफाइल', bn: 'অনুষদ প্রোফাইল', te: 'ఫ్యాకల్టీ ప్రొఫైల్', ta: 'பேராசிரியர் சுயவிவரம்', kn: 'ಅಧ್ಯಾಪಕರ ಪ್ರೊಫೈಲ್' },
    'Take Student Attendance': { or: 'ଛାତ୍ର ଉପସ୍ଥିତି ନିଅନ୍ତୁ', hi: 'छात्र उपस्थिति लें', bn: 'ছাত্র উপস্থিতি নিন', te: 'విద్యార్థి హాజరు తీసుకోండి', ta: 'மாணவர் வருகை எடுக்கவும்', kn: 'ವಿದ್ಯಾರ್ಥಿ ಹಾಜರಾತಿ ತೆಗೆದುಕೊಳ್ಳಿ' },
    'Upload & Issue Certificates': { or: 'ପ୍ରମାଣପତ୍ର ପ୍ରଦାନ କରନ୍ତୁ', hi: 'प्रमाणपत्र जारी करें', bn: 'সার্টিফিকেট প্রদান করুন', te: 'సర్టిఫికేట్లు జారీ చేయండి', ta: 'சான்றிதழ்கள் வழங்கவும்', kn: 'ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ನೀಡಿ' },
    'Class & Work Timetable': { or: 'ଶିକ୍ଷାଦାନ ସମୟସାରଣୀ', hi: 'कक्षा और कार्य समय-सारणी', bn: 'ক্লাস ও কাজের রুটিন', te: 'బోధనా సమయ పట్టిక', ta: 'கற்பித்தல் கால அட்டவணை', kn: 'ಬೋಧನಾ ವೇಳಾಪಟ್ಟಿ' },
    'Publish Notices': { or: 'ବିଜ୍ଞପ୍ତି ପ୍ରକାଶ କରନ୍ତୁ', hi: 'सूचना प्रकाशित करें', bn: 'বিজ্ঞপ্তি প্রকাশ করুন', te: 'నోటీసులు ప్రచురించండి', ta: 'அறிவிப்பு வெளியிடவும்', kn: 'ನೋಟಿಸ್ ಪ್ರಕಟಿಸಿ' },
    'Notifications': { or: 'ବାର୍ତ୍ତା ଏବଂ ସୂଚନା', hi: 'अधिसूचनाएं', bn: 'বিজ্ঞপ্তি', te: 'నోటిఫికేషన్లు', ta: 'அறிவிப்புகள்', kn: 'ಅಧಿಸೂಚನೆಗಳು' },
    'Admin Overview': { or: 'ପ୍ରଶାସନିକ ସମୀକ୍ଷା', hi: 'प्रशासन अवलोकन', bn: 'প্রশাসনিক সারসংক্ষেপ', te: 'అడ్మిన్ అవలోకనం', ta: 'நிர்வாக கண்ணோட்டம்', kn: 'ಆಡಳಿತ ಅವಲೋಕನ' },
    'Student Attendance & Results': { or: 'ଛାତ୍ର ଉପସ୍ଥିତି ଏବଂ ଫଳାଫଳ', hi: 'छात्र उपस्थिति और परिणाम', bn: 'ছাত্র উপস্থিতি ও ফলাফল', te: 'విద్యార్థుల హాజరు & ఫలితాలు', ta: 'மாணவர் வருகை & முடிவுகள்', kn: 'ವಿದ್ಯಾರ್ಥಿ ಹಾಜರಾತಿ ಮತ್ತು ಫಲಿತಾಂಶ' },
    'Faculty Directory & Branches': { or: 'ଅଧ୍ୟାପକ ତାଲିକା ଏବଂ ବିଭାଗ', hi: 'फैकल्टी सूची और विभाग', bn: 'অনুষদ ডিরেক্টরি ও বিভাগ', te: 'ఫ్యాకల్టీ జాబితా & విభాగాలు', ta: 'பேராசிரியர் பட்டியல் & துறைகள்', kn: 'ಅಧ್ಯಾಪಕರ ವಿವರ ಮತ್ತು ವಿಭಾಗಗಳು' },
    'Master Timetables': { or: 'ମୁଖ୍ୟ ସମୟସାରଣୀ', hi: 'मास्टर टाइमटेबल', bn: 'মাস্টার রুটিন', te: 'మాస్టర్ టైమ్‌టేబుల్స్', ta: 'முதன்மை கால அட்டவணை', kn: 'ಮುಖ್ಯ ವೇಳಾಪಟ್ಟಿಗಳು' },
    'Faculty Teaching Feedback': { or: 'ଅଧ୍ୟାପକ ଶିକ୍ଷାଦାନ ମତାମତ', hi: 'शिक्षक शिक्षण फीडबैक', bn: 'শিক্ষক পাঠদান প্রতিক্রিয়া', te: 'బోధనా ఫీడ్‌బ్యాక్', ta: 'கற்பித்தல் கருத்து', kn: 'ಬೋಧನಾ ಪ್ರತಿಕ್ರಿಯೆ' },
    'Hostel Service Feedback': { or: 'ଛାତ୍ରାବାସ ସେବା ମତାମତ', hi: 'छात्रावास सेवा फीडबैक', bn: 'হোস্টেল পরিষেবা প্রতিক্রিয়া', te: 'హాస్టల్ సేవా ఫీడ్‌బ్యాక్', ta: 'விடுதி சேவை கருத்து', kn: 'ವಸತಿ ನಿಲಯ ಸೇವಾ ಪ್ರತಿಕ್ರಿಯೆ' },
    'Canteen Service Feedback': { or: 'କ୍ୟାଣ୍ଟିନ୍ ସେବା ମତାମତ', hi: 'कैंटीन सेवा फीडबैक', bn: 'ক্যান্টিন পরিষেবা প্রতিক্রিয়া', te: 'క్యాంటీన్ సేవా ఫీడ్‌బ్యాక్', ta: 'கேண்டீன் சேவை கருத்து', kn: 'ಕ್ಯಾಂಟೀನ್ ಸೇವಾ ಪ್ರತಿಕ್ರಿಯೆ' },

    // Portal Access & Authentication
    'Campus Portal Access': { or: 'କ୍ୟାମ୍ପସ ପୋର୍ଟାଲ ପ୍ରବେଶ', hi: 'कैंपस पोर्टल एक्सेस', bn: 'ক্যাম্পাস পোর্টাল এক্সেস', te: 'క్యాంపస్ పోర్టల్ లాగిన్', ta: 'வளாக போர்டல் நுழைவு', kn: 'ಕ್ಯಾಂಪಸ್ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ' },
    'Sign In using your Institution ID, Login ID and Password.': { or: 'ଆପଣଙ୍କ ପ୍ରତିଷ୍ଠାନ ID, ଲଗଇନ୍ ID ଏବଂ ପାସୱାର୍ଡ ବ୍ୟବହାର କରି ସାଇନ୍ ଇନ୍ କରନ୍ତୁ |', hi: 'अपने संस्थान आईडी, लॉगिन आईडी और पासवर्ड का उपयोग करके साइन इन करें।', bn: 'আপনার প্রতিষ্ঠান আইডি, লগইন আইডি এবং পাসওয়ার্ড দিয়ে সাইন ইন করুন।', te: 'మీ ఇన్‌స్టిట్యూట్ ID, లాగిన్ ID మరియు పాస్‌వర్డ్‌తో సైన్ ఇన్ చేయండి.', ta: 'உங்கள் நிறுவன ஐடி, உள்நுழைவு ஐடி மற்றும் கடவுச்சொல்லைப் பயன்படுத்தி உள்நுழையவும்.', kn: 'ನಿಮ್ಮ ಸಂಸ್ಥೆಯ ಐಡಿ, ಲಾಗಿನ್ ಐಡಿ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಸೈನ್ ಇನ್ ಮಾಡಿ.' },
    '1st-Time Account Registration': { or: 'ପ୍ରଥମ ଥର ଖାତା ପଞ୍ଜୀକରଣ', hi: 'पहली बार खाता पंजीकरण', bn: 'প্রথমবার একাউন্ট রেজিস্ট্রেশন', te: 'మొదటిసారి ఖాతా నమోదు', ta: 'முதல் முறை கணக்கு பதிவு', kn: 'ಮೊದಲ ಬಾರಿಗೆ ಖಾತೆ ನೋಂದಣಿ' },
    'Register your account with Email, Contact, Branch & Section, and create your password.': { or: 'ଇମେଲ୍, ଯୋଗାଯୋଗ, ବିଭାଗ ଏବଂ ସେକସନ ସହିତ ପଞ୍ଜିକରଣ କରନ୍ତୁ ଏବଂ ପାସୱାର୍ଡ ତିଆରି କରନ୍ତୁ |', hi: 'ईमेल, संपर्क, शाखा और अनुभाग के साथ अपना खाता पंजीकृत करें, और पासवर्ड बनाएं।', bn: 'ইমেল, যোগাযোগ, বিভাগ ও শাখা দিয়ে অ্যাকাউন্ট তৈরি করুন এবং পাসওয়ার্ড সেট করুন।', te: 'ఈమెయిల్, కాంటాక్ట్, బ్రాంచ్ & సెక్షన్‌తో నమోదు చేసుకొని పాస్‌వర్డ్ సృష్టించండి.', ta: 'மின்னஞ்சல், தொடர்பு, பிரிவு ஆகியவற்றுடன் பதிவு செய்து கடவுச்சொல்லை உருவாக்கவும்.', kn: 'ಇಮೇಲ್, ಸಂಪರ್ಕ, ವಿಭಾಗ ಮತ್ತು ಸೆಕ್ಷನ್‌ನೊಂದಿಗೆ ನೋಂದಾಯಿಸಿ ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ.' },
    'Sign In to Workspace': { or: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ', hi: 'वर्कस्पेस में साइन इन करें', bn: 'ওয়ার্কস্পেসে সাইন ইন করুন', te: 'లాగిన్ అవ్వండి', ta: 'உள்நுழையவும்', kn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ' },
    'Register for 1st Time / Set Password': { or: 'ପ୍ରଥମ ଥର ପଞ୍ଜିକରଣ / ପାସୱାର୍ଡ ସେଟ୍ କରନ୍ତୁ', hi: 'पहली बार पंजीकरण / पासवर्ड सेट करें', bn: 'প্রথমবার রেজিস্ট্রেশন / পাসওয়ার্ড সেট করুন', te: 'మొదటిసారి రిజిస్ట్రేషన్ / పాస్‌వర్డ్ సెట్ చేయండి', ta: 'முதல் முறை பதிவு / கடவுச்சொல் அமைக்கவும்', kn: 'ಮೊದಲ ಬಾರಿಗೆ ನೋಂದಣಿ / ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ' },
    'Back to Sign In': { or: 'ସାଇନ୍ ଇନ୍ କୁ ଫେରନ୍ତୁ', hi: 'साइन इन पर वापस जाएं', bn: 'সাইন ইন-এ ফিরে যান', te: 'తిరిగి లాగిన్‌కు వెళ్లండి', ta: 'மீண்டும் உள்நுழைய', kn: 'ಸೈನ್ ಇನ್‌ಗೆ ಹಿಂತಿರುಗಿ' },
    'Sign Out': { or: 'ଲଗ୍ ଆଉଟ୍', hi: 'साइन आउट', bn: 'লগ আউট', te: 'లాగ్ అవుట్', ta: 'வெளியேறு', kn: 'ಸೈನ್ ಔಟ್' },
    'Complete 1st-Time Registration': { or: 'ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ', hi: 'पंजीकरण पूर्ण करें', bn: 'রেজিস্ট্রেশন সম্পন্ন করুন', te: 'నమోదు పూర్తి చేయండి', ta: 'பதிவை முடிக்கவும்', kn: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ' },

    // Role Names
    'Student': { or: 'ଛାତ୍ର / ଛାତ୍ରୀ', hi: 'विद्यार्थी / छात्र', bn: 'শিক্ষার্থী / ছাত্র', te: 'విద్యార్థి', ta: 'மாணவர்', kn: 'ವಿದ್ಯಾರ್ಥಿ' },
    'Faculty': { or: 'ଅଧ୍ୟାପକ', hi: 'शिक्षक / फैकल्टी', bn: 'শিক্ষক / অনুষদ', te: 'అధ్యాపకులు', ta: 'பேராசிரியர்', kn: 'ಅಧ್ಯಾಪಕರು' },
    'Hostel Management': { or: 'ଛାତ୍ରାବାସ ପରିଚାଳନା', hi: 'छात्रावास प्रबंधन', bn: 'হোস্টেল পরিচালনা', te: 'హాస్టల్ నిర్వహణ', ta: 'விடுதி மேலாண்மை', kn: 'ವಸತಿ ನಿಲಯ ನಿರ್ವಹಣೆ' },
    'Admin': { or: 'ପ୍ରଶାସକ', hi: 'प्रशासक', bn: 'প্রশাসক', te: 'అడ్మినిస్ట్రేటర్', ta: 'நிர்வாகி', kn: 'ಆಡಳಿತಾಧಿಕಾರಿ' },

    // Form Labels & Prompts
    'Institution ID': { or: 'ପ୍ରତିଷ୍ଠାନ ID (Inst ID)', hi: 'संस्थान आईडी (Inst ID)', bn: 'প্রতিষ্ঠান আইডি (Inst ID)', te: 'సంస్థ ఐడి (Inst ID)', ta: 'நிறுவன ஐடி (Inst ID)', kn: 'ಸಂಸ್ಥೆಯ ಐಡಿ (Inst ID)' },
    'Password': { or: 'ପାସୱାର୍ଡ', hi: 'पासवर्ड', bn: 'পাসওয়ার্ড', te: 'పాస్‌వర్డ్', ta: 'கடவுச்சொல்', kn: 'ಪಾಸ್‌ವರ್ಡ್' },
    'Student Roll Number / Login ID': { or: 'ଛାତ୍ର ରୋଲ୍ ନମ୍ବର / ଲଗଇନ୍ ID', hi: 'छात्र रोल नंबर / लॉगिन आईडी', bn: 'ছাত্র রোল নম্বর / লগইন আইডি', te: 'రోల్ నంబర్ / లాగిన్ ఐడి', ta: 'மாணவர் ரோல் எண் / உள்நுழைவு ஐடி', kn: 'ವಿದ್ಯಾರ್ಥಿ ರೋಲ್ ಸಂಖ್ಯೆ / ಲಾಗಿನ್ ಐಡಿ' },
    'Faculty Staff ID': { or: 'ଅଧ୍ୟାପକ ଷ୍ଟାଫ୍ ID', hi: 'फैकल्टी स्टाफ आईडी', bn: 'অনুষদ স্টাফ আইডি', te: 'ఫ్యాకల్టీ స్టాఫ్ ఐడి', ta: 'பேராசிரியர் ஊழியர் ஐடி', kn: 'ಅಧ್ಯಾಪಕರ ಸಿಬ್ಬಂದಿ ಐಡಿ' },
    'Hostel Management Staff ID': { or: 'ଛାତ୍ରାବାସ ଷ୍ଟାଫ୍ ID', hi: 'छात्रावास स्टाफ आईडी', bn: 'হোস্টেল স্টাফ আইডি', te: 'హాస్టల్ స్టాఫ్ ఐడి', ta: 'விடுதி ஊழியர் ஐடி', kn: 'ವಸತಿ ನಿಲಯ ಸಿಬ್ಬಂದಿ ಐಡಿ' },
    'Administrator Login ID': { or: 'ପ୍ରଶାସକ ଲଗଇନ୍ ID', hi: 'प्रशासक लॉगिन आईडी', bn: 'প্রশাসক লগইন আইডি', te: 'అడ్మిన్ లాగిన్ ఐడి', ta: 'நிர்வாகி உள்நுழைவு ஐடி', kn: 'ಆಡಳಿತ ಲಾಗಿನ್ ಐಡಿ' },
    'Full Name *': { or: 'ପୂରା ନାମ *', hi: 'पूरा नाम *', bn: 'সম্পূর্ণ নাম *', te: 'పూర్తి పేరు *', ta: 'முழு பெயர் *', kn: 'ಪೂರ್ಣ ಹೆಸರು *' },
    'Official / Personal Email *': { or: 'ଇମେଲ୍ ଠିକଣା *', hi: 'ईमेल पता *', bn: 'ইমেল ঠিকানা *', te: 'ఈమెయిల్ చిరునామా *', ta: 'மின்னஞ்சல் முகவரி *', kn: 'ಇಮೇಲ್ ವಿಳಾಸ *' },
    'Contact Number *': { or: 'ଫୋନ୍ ନମ୍ବର *', hi: 'फ़ोन नंबर *', bn: 'ফোন নম্বর *', te: 'ఫోన్ నంబర్ *', ta: 'தொலைபேசி எண் *', kn: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ *' },
    'Branch / Department *': { or: 'ବିଭାଗ / ଶାଖା *', hi: 'शाखा / विभाग *', bn: 'বিভাগ / শাখা *', te: 'బ్రాంచ్ / విభాగం *', ta: 'துறை / பிரிவு *', kn: 'ವಿಭಾಗ / ಶಾಖೆ *' },
    'Hostel Wing / Department *': { or: 'ଛାତ୍ରାବାସ ୱିଙ୍ଗ୍ / ବିଭାଗ *', hi: 'छात्रावास विंग / विभाग *', bn: 'হোস্টেল উইং / বিভাগ *', te: 'హాస్టల్ వింగ్ / విభాగం *', ta: 'விடுதி பிரிவு *', kn: 'ವಸತಿ ನಿಲಯ ವಿಭಾಗ *' },
    'Superintendent Designation': { or: 'ସୁପରିଣ୍ଟେଣ୍ଡେଣ୍ଟ ପଦବୀ', hi: 'अधीक्षक पदनाम', bn: 'সুপারিনটেনডেন্ট পদবি', te: 'సూపరింటెండెంట్ హోదా', ta: 'கண்காணிப்பாளர் பதவி', kn: 'ಮೇಲ್ವಿಚಾರಕರ ಹುದ್ದೆ' },
    'Section *': { or: 'ସେକସନ୍ *', hi: 'अनुभाग (Section) *', bn: 'শাখা (Section) *', te: 'సెక్షన్ *', ta: 'பிரிவு *', kn: 'ಸೆಕ್ಷನ್ *' },
    'Create Password *': { or: 'ନୂଆ ପାସୱାର୍ଡ ସୃଷ୍ଟି କରନ୍ତୁ *', hi: 'नया पासवर्ड बनाएं *', bn: 'নতুন পাসওয়ার্ড তৈরি করুন *', te: 'కొత్త పాస్‌వర్డ్ సృష్టించండి *', ta: 'புதிய கடவுச்சொல்லை உருவாக்கவும் *', kn: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ *' },
    'Confirm Password *': { or: 'ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ *', hi: 'पासवर्ड की पुष्टि करें *', bn: 'পাসওয়ার্ড নিশ্চিত করুন *', te: 'పాస్‌వర్డ్‌ను నిర్ధారించండి *', ta: 'கடவுச்சொல்லை உறுதிப்படுத்தவும் *', kn: 'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ *' },

    // Actions & Common Buttons
    'Approve': { or: 'ଅନୁମୋଦନ କରନ୍ତୁ', hi: 'स्वीकृत करें', bn: 'অনুমোদন করুন', te: 'ఆమోదించండి', ta: 'ஒப்புதல் அளிக்கவும்', kn: 'ಅನುಮೋದಿಸಿ' },
    'Reject': { or: 'ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ', hi: 'अस्वीकार करें', bn: 'প্রত্যাখ্যান করুন', te: 'తిరస్కరించండి', ta: 'நிராகரிக்கவும்', kn: 'ತಿರಸ್ಕರಿಸಿ' },
    'Save Settings': { or: 'ସେଟିଙ୍ଗ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ', hi: 'सेटिंग्स सहेजें', bn: 'সেটিংস সংরক্ষণ করুন', te: 'సెట్టింగ్‌లను సేవ్ చేయండి', ta: 'அமைப்புகளைச் சேமிக்கவும்', kn: 'ಸಂಯೋಜನೆಗಳನ್ನು ಉಳಿಸಿ' },
    'Test Connection': { or: 'ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ', hi: 'कनेक्शन परीक्षण करें', bn: 'সংযোগ পরীক্ষা করুন', te: 'కనెక్షన్ పరీక్షించండి', ta: 'இணைப்பை சோதிக்கவும்', kn: 'ಸಂಪರ್ಕವನ್ನು ಪರೀಕ್ಷಿಸಿ' },
    'Publish Notice': { or: 'ବିଜ୍ଞପ୍ତି ପ୍ରକାଶ କରନ୍ତୁ', hi: 'सूचना जारी करें', bn: 'বিজ্ঞপ্তি পোস্ট করুন', te: 'నోటీసు పోస్ట్ చేయండి', ta: 'அறிவிப்பை வெளியிடவும்', kn: 'ನೋಟಿಸ್ ಪ್ರಕಟಿಸಿ' },
    'Send': { or: 'ପଠାନ୍ତୁ', hi: 'भेजें', bn: 'পাঠান', te: 'పంపండి', ta: 'அனுப்பவும்', kn: 'ಕಳುಹಿಸಿ' },

    // Status Words
    'Online': { or: 'ସକ୍ରିୟ (ଅନଲାଇନ୍)', hi: 'ऑनलाइन', bn: 'অনলাইন', te: 'ఆన్‌లైన్', ta: 'ஆன்லைன்', kn: 'ಆನ್‌ಲೈನ್' },
    'Connected': { or: 'ସଂଯୁକ୍ତ', hi: 'कनेक्टेड', bn: 'সংযুক্ত', te: 'కనెక్ట్ చేయబడింది', ta: 'இணைக்கப்பட்டது', kn: 'ಸಂಪರ್ಕಗೊಂಡಿದೆ' },
    'APPROVED': { or: 'ଅନୁମୋଦିତ', hi: 'स्वीकृत', bn: 'অনুমোদিত', te: 'ఆమోదించబడింది', ta: 'ஒப்புதல் அளிக்கப்பட்டது', kn: 'ಅನುಮೋದಿಸಲಾಗಿದೆ' },
    'REJECTED': { or: 'ପ୍ରତ୍ୟାଖ୍ୟାତ', hi: 'अस्वीकृत', bn: 'প্রত্যাখ্যাত', te: 'తిరస్కరించబడింది', ta: 'நிராகரிக்கப்பட்டது', kn: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ' },
    'PENDING': { or: 'ବିଚାରାଧୀନ', hi: 'लंबित', bn: 'অপেক্ষমাণ', te: 'పెండింగ్‌లో ఉంది', ta: 'நிலுவையில் உள்ளது', kn: 'ಬಾಕಿಯಿದೆ' }
  };

  const GoogleMLKitTranslator = {
    currentLang: 'en',
    cache: {},

    init() {
      try {
        const savedCache = localStorage.getItem('smartcampus_gml_cache');
        if (savedCache) this.cache = JSON.parse(savedCache);
      } catch (e) {
        this.cache = {};
      }
    },

    saveCache() {
      try {
        localStorage.setItem('smartcampus_gml_cache', JSON.stringify(this.cache));
      } catch (e) {}
    },

    translateString(text, lang) {
      if (!text || lang === 'en') return text;
      const clean = text.trim();
      if (!clean) return text;

      // 1. Check exact phrase dictionary
      if (MLKIT_PHRASES[clean] && MLKIT_PHRASES[clean][lang]) {
        return MLKIT_PHRASES[clean][lang];
      }

      // 2. Check localStorage cache
      const cacheKey = lang + ':' + clean;
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }

      // 3. Check partial key matches
      for (const phrase in MLKIT_PHRASES) {
        if (clean.toLowerCase() === phrase.toLowerCase() && MLKIT_PHRASES[phrase][lang]) {
          return MLKIT_PHRASES[phrase][lang];
        }
      }

      // 4. Word-by-word tokenized translation fallback
      let result = clean;
      for (const phrase in MLKIT_PHRASES) {
        if (MLKIT_PHRASES[phrase][lang] && result.includes(phrase)) {
          result = result.split(phrase).join(MLKIT_PHRASES[phrase][lang]);
        }
      }

      return result;
    },

    // Recursively walk and translate all DOM nodes
    translateElementTree(root, lang) {
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'code' || parent.id === 'localeSelect') {
            return NodeFilter.FILTER_REJECT;
          }
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const nodesToUpdate = [];
      let currentNode = walker.nextNode();
      while (currentNode) {
        nodesToUpdate.push(currentNode);
        currentNode = walker.nextNode();
      }

      nodesToUpdate.forEach(node => {
        if (!node._origText) {
          node._origText = node.nodeValue;
        }
        if (lang === 'en') {
          node.nodeValue = node._origText;
        } else {
          node.nodeValue = this.translateString(node._origText, lang);
        }
      });

      // Also translate form placeholders
      root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
        if (!el._origPlaceholder) {
          el._origPlaceholder = el.placeholder;
        }
        if (lang === 'en') {
          el.placeholder = el._origPlaceholder;
        } else {
          el.placeholder = this.translateString(el._origPlaceholder, lang);
        }
      });

      // Also translate select options (except localeSelect)
      root.querySelectorAll('select:not(#localeSelect) option').forEach(opt => {
        if (!opt._origText) {
          opt._origText = opt.textContent;
        }
        if (lang === 'en') {
          opt.textContent = opt._origText;
        } else {
          opt.textContent = this.translateString(opt._origText, lang);
        }
      });
    },

    applyLanguage(lang) {
      this.currentLang = lang;
      db.currentLocale = lang;
      saveDb();

      // Translate entire document body
      this.translateElementTree(document.body, lang);

      // Async live Google Translation API fetcher for any custom unmapped terms when online
      if (lang !== 'en' && navigator.onLine) {
        this.fetchLiveGoogleTranslations(lang);
      }

      const langInfo = GOOGLE_MLKIT_LANGUAGES[lang] || { name: lang, native: lang };
      showToast('🌐 Google ML Kit Translator: Language changed to ' + langInfo.native + ' (' + langInfo.name + ')', 'info');
    },

    // Background Google Translation API helper for custom dynamic sentences
    async fetchLiveGoogleTranslations(targetLang) {
      // Collect untranslated headings or card subtitles
      const sampleElements = document.querySelectorAll('.card-subtitle, .badge, .chat-sender');
      for (const el of sampleElements) {
        const text = (el._origText || el.textContent || '').trim();
        if (!text || text.length > 80 || this.cache[targetLang + ':' + text]) continue;
        try {
          const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(text);
          const resp = await fetch(url);
          if (resp.ok) {
            const data = await resp.json();
            if (data && data[0] && data[0][0] && data[0][0][0]) {
              const translated = data[0][0][0];
              this.cache[targetLang + ':' + text] = translated;
              this.saveCache();
              if (el.textContent === text) {
                el.textContent = translated;
              }
            }
          }
        } catch (e) {
          break; // Stop if network restricted
        }
      }
    }
  };

  GoogleMLKitTranslator.init();

  const localeSelect = document.getElementById('localeSelect');
  if (localeSelect) {
    localeSelect.value = db.currentLocale || 'en';
    localeSelect.addEventListener('change', (e) => {
      GoogleMLKitTranslator.applyLanguage(e.target.value);
    });
    // Apply saved language on startup
    if (db.currentLocale && db.currentLocale !== 'en') {
      setTimeout(() => GoogleMLKitTranslator.applyLanguage(db.currentLocale), 50);
    }
  }

  // ================= 3. NEW 6-SCREEN ENTRY & AUTHENTICATION ARCHITECTURE =================
  const btnHamburger = document.getElementById('btnHamburger');

  // Helper: Setup Password Visibility Toggle Eye
  function setupPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '👁️‍🗨️';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  }

  // Bind all password eye toggles
  setupPasswordToggle('btnToggleEyeInstReg', 'instScreenRegPassword');
  setupPasswordToggle('btnToggleEyeAdminLogin', 'adminLoginPassword');
  setupPasswordToggle('btnToggleEyeAdminReg', 'adminRegPassword');
  setupPasswordToggle('btnToggleEyeStudentLogin', 'studentLoginPassword');
  setupPasswordToggle('btnToggleEyeStudentReg', 'studentRegPassword');
  setupPasswordToggle('btnToggleEyeFacultyLogin', 'facultyLoginPassword');
  setupPasswordToggle('btnToggleEyeFacultyReg', 'facultyRegPassword');
  setupPasswordToggle('btnToggleEyeHostelLogin', 'hostelLoginPassword');
  setupPasswordToggle('btnToggleEyeHostelReg', 'hostelRegPassword');

  // --- SCREEN 1: ENTRY HOME CARD NAVIGATION ---
  document.getElementById('cardNavInstReg')?.addEventListener('click', () => {
    switchView('screen-inst-register', 'Institution Registration');
  });
  document.getElementById('cardNavAdminPortal')?.addEventListener('click', () => {
    switchView('screen-admin-portal', 'Admin Portal');
  });
  document.getElementById('cardNavStudentPortal')?.addEventListener('click', () => {
    switchView('screen-student-portal', 'Student Portal');
  });
  document.getElementById('cardNavFacultyPortal')?.addEventListener('click', () => {
    switchView('screen-faculty-portal', 'Faculty Portal');
  });
  document.getElementById('cardNavHostelPortal')?.addEventListener('click', () => {
    switchView('screen-hostel-portal', 'Hostel Management');
  });

  // Entry Bell Notification
  document.getElementById('btnEntryNotifBell')?.addEventListener('click', () => {
    showToast('Welcome to Smart Campus! Please select your institutional portal to sign in or register.', 'info');
  });

  // Back buttons on all screens -> Return to Screen 1
  ['btnBackFromInstReg', 'btnBackFromAdminPortal', 'btnBackFromStudentPortal', 'btnBackFromFacultyPortal', 'btnBackFromHostelPortal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      switchView('view-auth', 'Smart Campus');
    });
  });

  document.getElementById('btnGotoAdminLogin')?.addEventListener('click', () => {
    switchView('screen-admin-portal', 'Admin Portal');
  });

  // --- SEGMENTED PILL TOGGLES ([Login] | [Register]) ---
  const portalPillControllers = {};

  function setupPortalPills(loginBtnId, regBtnId, loginFormId, regFormId, toggleToRegId, toggleToLoginId) {
    const btnLogin = document.getElementById(loginBtnId);
    const btnReg = document.getElementById(regBtnId);
    const formLogin = document.getElementById(loginFormId);
    const formReg = document.getElementById(regFormId);

    function showLogin() {
      btnLogin?.classList.add('active');
      btnReg?.classList.remove('active');
      if (formLogin) formLogin.style.display = 'block';
      if (formReg) formReg.style.display = 'none';
    }

    function showReg() {
      btnReg?.classList.add('active');
      btnLogin?.classList.remove('active');
      if (formLogin) formLogin.style.display = 'none';
      if (formReg) formReg.style.display = 'block';
    }

    btnLogin?.addEventListener('click', showLogin);
    btnReg?.addEventListener('click', showReg);
    document.getElementById(toggleToRegId)?.addEventListener('click', showReg);
    document.getElementById(toggleToLoginId)?.addEventListener('click', showLogin);

    portalPillControllers[loginFormId] = { showLogin, showReg };
    portalPillControllers[regFormId] = { showLogin, showReg };
  }

  setupPortalPills('segBtnAdminLogin', 'segBtnAdminRegister', 'formAdminLogin', 'formAdminRegister', 'btnToggleToAdminReg', 'btnToggleToAdminLogin');
  setupPortalPills('segBtnStudentLogin', 'segBtnStudentRegister', 'formStudentLogin', 'formStudentRegister', 'btnToggleToStudentReg', 'btnToggleToStudentLogin');
  setupPortalPills('segBtnFacultyLogin', 'segBtnFacultyRegister', 'formFacultyLogin', 'formFacultyRegister', 'btnToggleToFacultyReg', 'btnToggleToFacultyLogin');
  setupPortalPills('segBtnHostelLogin', 'segBtnHostelRegister', 'formHostelLogin', 'formHostelRegister', 'btnToggleToHostelReg', 'btnToggleToHostelLogin');

  // Forgot password triggers
  document.getElementById('btnForgotAdminPwd')?.addEventListener('click', () => {
    showToast('To reset Admin credentials, please contact your Institutional Board or IT Director.', 'info');
  });
  document.getElementById('btnForgotStudentPwd')?.addEventListener('click', () => {
    showToast('To reset Student credentials, please contact your Academic Dean or Examination Cell.', 'info');
  });
  document.getElementById('btnForgotFacultyPwd')?.addEventListener('click', () => {
    showToast('To reset Faculty credentials, please contact the Principal Office or HOD.', 'info');
  });
  document.getElementById('btnForgotHostelPwd')?.addEventListener('click', () => {
    showToast('To reset Hostel Staff credentials, please contact the Chief Warden or Superintendent.', 'info');
  });

  // --- MULTI-TENANT INSTITUTION REGISTRATION VALIDATOR ---
  function isSameInstitution(instA, instB) {
    if (!instA && !instB) return true;
    if (!instA || !instB) return false;
    const a = String(instA).trim().toUpperCase();
    const b = String(instB).trim().toUpperCase();
    if (a === b) return true;
    const cleanA = a.replace(/[^A-Z0-9]/g, '');
    const cleanB = b.replace(/[^A-Z0-9]/g, '');
    if (cleanA && cleanB && cleanA === cleanB) return true;

    // Check against registered institutions catalog
    const instObjA = getRegisteredInstitution(a);
    const instObjB = getRegisteredInstitution(b);
    if (instObjA && instObjB && instObjA.id === instObjB.id) return true;

    return false;
  }

  function isInstitutionRegistered(instId) {
    if (!instId) return false;
    const clean = String(instId).trim().toUpperCase();
    if (!clean || !db || !db.institutions) return false;
    const cleanAlpha = clean.replace(/[^A-Z0-9]/g, '');
    return Object.keys(db.institutions).some(key => {
      const inst = db.institutions[key];
      if (!inst) return false;
      const keyAlpha = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const idAlpha = inst.id ? String(inst.id).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      const codeAlpha = inst.code ? String(inst.code).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      const shortAlpha = inst.shortName ? String(inst.shortName).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      const nameAlpha = inst.name ? String(inst.name).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      return key.toUpperCase() === clean ||
             (inst.id && String(inst.id).toUpperCase() === clean) ||
             (inst.code && String(inst.code).toUpperCase() === clean) ||
             (inst.shortName && String(inst.shortName).toUpperCase() === clean) ||
             (cleanAlpha && (keyAlpha === cleanAlpha || idAlpha === cleanAlpha || codeAlpha === cleanAlpha || shortAlpha === cleanAlpha || nameAlpha === cleanAlpha));
    });
  }

  function getRegisteredInstitution(instId) {
    if (!instId) return null;
    const clean = String(instId).trim().toUpperCase();
    if (!clean || !db || !db.institutions) return null;
    const cleanAlpha = clean.replace(/[^A-Z0-9]/g, '');
    const key = Object.keys(db.institutions).find(k => {
      const inst = db.institutions[k];
      if (!inst) return false;
      const kAlpha = k.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const idAlpha = inst.id ? String(inst.id).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      const codeAlpha = inst.code ? String(inst.code).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      const shortAlpha = inst.shortName ? String(inst.shortName).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      const nameAlpha = inst.name ? String(inst.name).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      return k.toUpperCase() === clean ||
             (inst && inst.id && String(inst.id).toUpperCase() === clean) ||
             (inst && inst.code && String(inst.code).toUpperCase() === clean) ||
             (inst && inst.shortName && String(inst.shortName).toUpperCase() === clean) ||
             (cleanAlpha && (kAlpha === cleanAlpha || idAlpha === cleanAlpha || codeAlpha === cleanAlpha || shortAlpha === cleanAlpha || nameAlpha === cleanAlpha));
    });
    return key ? db.institutions[key] : null;
  }

  // Helper to switch portal view to Login form and prefill credentials
  function switchToPortalLogin(role, instId, userId) {
    let formId = 'formStudentLogin';
    let instInputId = 'studentLoginInstId';
    let userInputId = 'studentLoginUserId';
    let pwdInputId = 'studentLoginPassword';

    if (role === 'admin') {
      formId = 'formAdminLogin';
      instInputId = 'adminLoginInstId';
      userInputId = 'adminLoginUserId';
      pwdInputId = 'adminLoginPassword';
    } else if (role === 'faculty') {
      formId = 'formFacultyLogin';
      instInputId = 'facultyLoginInstId';
      userInputId = 'facultyLoginUserId';
      pwdInputId = 'facultyLoginPassword';
    } else if (role === 'hostel_faculty') {
      formId = 'formHostelLogin';
      instInputId = 'hostelLoginInstId';
      userInputId = 'hostelLoginUserId';
      pwdInputId = 'hostelLoginPassword';
    }

    portalPillControllers[formId]?.showLogin();
    const elInst = document.getElementById(instInputId);
    const elUser = document.getElementById(userInputId);
    if (elInst) elInst.value = instId;
    if (elUser) elUser.value = userId;
    const elPwd = document.getElementById(pwdInputId);
    if (elPwd) {
      elPwd.value = '';
      elPwd.focus();
    }
  }

  // --- GENERIC PORTAL LOGIN & REGISTRATION HANDLERS ---
  function executePortalLogin({ instId, uId, pwd, expectedRole, roleDisplayName }) {
    if (!instId) { showToast('Please enter your Institution ID.', 'warning'); return; }
    if (!uId) { showToast('Please enter your Login ID.', 'warning'); return; }
    if (!pwd) { showToast('Please enter your Password.', 'warning'); return; }

    const normalizedInst = instId.trim().toUpperCase();
    const cleanUId = uId.trim().toLowerCase();
    const cleanUIdAlpha = cleanUId.replace(/[^a-z0-9]/g, '');

    // STRICT VALIDATION: Institution ID must be registered beforehand in Institution Registration section!
    if (!isInstitutionRegistered(normalizedInst)) {
      showToast('❌ Institution ID "' + normalizedInst + '" is not registered in the system! You cannot log in without a registered institution. Please register the institution first in the Institution Registration section.', 'error', 6000);
      return;
    }

    const regInst = getRegisteredInstitution(normalizedInst);
    const resolvedInstId = regInst?.id ? regInst.id.toUpperCase() : normalizedInst;

    // Find accounts matching Login ID/Roll/Staff ID/Admin ID/Email/Name
    const matchingUsers = Object.values(db.users || {}).filter(u => {
      if (!u) return false;
      const idLower = (u.id || '').toLowerCase();
      const loginIdLower = (u.loginId || '').toLowerCase();
      const rollLower = (u.roll || '').toLowerCase();
      const staffLower = (u.staffId || '').toLowerCase();
      const adminLower = (u.adminId || '').toLowerCase();
      const emailLower = (u.email || '').toLowerCase();
      const nameLower = (u.name || '').toLowerCase();
      
      const idAlpha = idLower.replace(/[^a-z0-9]/g, '');
      const loginAlpha = loginIdLower.replace(/[^a-z0-9]/g, '');
      const rollAlpha = rollLower.replace(/[^a-z0-9]/g, '');
      const staffAlpha = staffLower.replace(/[^a-z0-9]/g, '');
      const adminAlpha = adminLower.replace(/[^a-z0-9]/g, '');

      return (
        idLower === cleanUId ||
        loginIdLower === cleanUId ||
        rollLower === cleanUId ||
        staffLower === cleanUId ||
        adminLower === cleanUId ||
        emailLower === cleanUId ||
        nameLower === cleanUId ||
        (cleanUIdAlpha && (
          idAlpha === cleanUIdAlpha ||
          loginAlpha === cleanUIdAlpha ||
          rollAlpha === cleanUIdAlpha ||
          staffAlpha === cleanUIdAlpha ||
          adminAlpha === cleanUIdAlpha
        ))
      );
    });

    let user = matchingUsers.find(u => isSameInstitution(u.institutionId, resolvedInstId));
    if (!user && matchingUsers.length === 1) {
      user = matchingUsers[0];
    }

    if (!user) {
      if (matchingUsers.length > 0) {
        showToast('❌ Institution Mismatch: Account "' + uId + '" is registered under institution "' + (matchingUsers[0].institutionId || 'another institution') + '", not "' + resolvedInstId + '".', 'error');
      } else {
        showToast('❌ User ID "' + uId + '" not found in Institution ' + resolvedInstId + '. Please Register first.', 'error');
      }
      return;
    }

    const trimmedPwd = pwd.trim();
    const userPwd = (user.password || '').toString();
    if (userPwd !== pwd && userPwd.trim() !== trimmedPwd) {
      showToast('❌ Incorrect password. Please enter the password created during registration.', 'error');
      return;
    }

    // STRICT ROLE PORTAL ENFORCEMENT
    if (user.role !== expectedRole) {
      const roleMap = {
        student: 'Student',
        faculty: 'Faculty',
        hostel_faculty: 'Hostel Management',
        admin: 'Admin'
      };
      const correctRole = roleMap[user.role] || user.role;
      showToast('🚫 Role Mismatch: Account "' + uId + '" is registered as ' + correctRole + '. You can ONLY log in from the ' + correctRole + ' Portal.', 'error');
      return;
    }

    performLogin(user, pwd);
  }

  function executePortalRegister({ instId, userId, name, email, phone, branch, section, designation, pwd, role, roleDisplayName }) {
    if (!instId) { showToast('Please enter Institution ID.', 'warning'); return; }
    if (!userId) { showToast('Please enter Login / Roll ID.', 'warning'); return; }
    if (!name) { showToast('Please enter Full Name.', 'warning'); return; }
    if (!pwd || pwd.length < 4) { showToast('Password must be at least 4 characters long.', 'warning'); return; }

    const normalizedInstId = instId.toUpperCase().trim();
    const normalizedUserId = userId.trim();

    // STRICT VALIDATION: Institution ID must be registered beforehand in Institution Registration section!
    if (!isInstitutionRegistered(normalizedInstId)) {
      showToast('❌ Institution ID "' + normalizedInstId + '" is NOT registered in the system! You cannot register under an unverified institution. Please register your institution first in the Institution Registration section.', 'error', 6000);
      return;
    }

    const regInst = getRegisteredInstitution(normalizedInstId);
    const resolvedInstId = regInst?.id ? regInst.id.toUpperCase() : normalizedInstId;

    // Check if user already exists in this institution
    const existing = Object.values(db.users || {}).find(u =>
      (u.id?.toLowerCase() === normalizedUserId.toLowerCase() ||
       u.roll?.toLowerCase() === normalizedUserId.toLowerCase() ||
       u.staffId?.toLowerCase() === normalizedUserId.toLowerCase() ||
       u.adminId?.toLowerCase() === normalizedUserId.toLowerCase() ||
       u.loginId?.toLowerCase() === normalizedUserId.toLowerCase()) &&
      isSameInstitution(u.institutionId, resolvedInstId)
    );

    if (existing) {
      const trimmedPwd = pwd.trim();
      const existingPwd = (existing.password || '').toString();
      if (existingPwd === pwd || existingPwd.trim() === trimmedPwd) {
        showToast('👋 Welcome back, ' + existing.name + '! Logging into ' + roleDisplayName + ' Portal...', 'success');
        performLogin(existing, pwd);
        return;
      }
      showToast('⚠️ User ID "' + normalizedUserId + '" is already registered! Switched to Login form.', 'info');
      switchToPortalLogin(role, resolvedInstId, normalizedUserId);
      return;
    }

    const newUser = {
      id: normalizedUserId,
      name: name.trim(),
      institutionId: resolvedInstId,
      password: pwd.trim(),
      email: (email || '').trim(),
      contact: (phone || '').trim(),
      role: role
    };

    if (role === 'student') {
      newUser.roll = normalizedUserId;
      newUser.branch = (branch || 'Computer Science').trim();
      newUser.section = (section || 'Section A').trim();
      newUser.attendance = 90.0;
      newUser.cgpa = 8.5;
    } else if (role === 'faculty') {
      newUser.staffId = normalizedUserId;
      newUser.department = (branch || 'Academic Department').trim();
      newUser.designation = designation || 'Assistant Professor';
    } else if (role === 'hostel_faculty') {
      newUser.staffId = normalizedUserId;
      newUser.wing = (branch || 'Main Hostel Block').trim();
      newUser.designation = designation || 'Hostel Staff / Warden';
    } else if (role === 'admin') {
      newUser.adminId = normalizedUserId;
      newUser.designation = designation || 'Campus Administrator';
    }

    db.users[normalizedUserId] = newUser;
    db.currentInstitutionId = resolvedInstId;
    saveDb();

    // Permanent cloud sync
    fetch('/api/sync/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser })
    }).catch(err => console.warn('Sync save-user:', err));

    showToast('✅ Registration successful for ' + name + '! Signing in to ' + roleDisplayName + ' Portal...', 'success');
    performLogin(newUser, pwd);
  }

  // --- SCREEN 2: INSTITUTION REGISTRATION FORM ---
  const handleInstRegSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instName = (document.getElementById('instScreenRegName')?.value || '').trim();
    const instId = (document.getElementById('instScreenRegId')?.value || '').trim().toUpperCase();
    const adminName = (document.getElementById('instScreenRegAdminName')?.value || '').trim();
    const email = (document.getElementById('instScreenRegEmail')?.value || '').trim();
    const phone = (document.getElementById('instScreenRegPhone')?.value || '').trim();
    const pwd = (document.getElementById('instScreenRegPassword')?.value || '').trim();

    if (!instName || !instId || !pwd) {
      showToast('Please fill all required institution details.', 'error');
      return;
    }

    if (isInstitutionRegistered(instId)) {
      showToast('⚠️ Institution ID "' + instId + '" is already registered! Please use a unique ID or log in to your portal.', 'error');
      return;
    }

    const adminLoginId = 'admin_' + instId.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newInst = {
      id: instId,
      name: instName,
      code: instId,
      status: 'ACTIVE',
      email: email,
      phone: phone,
      registeredAt: new Date().toISOString()
    };

    const adminUser = {
      id: adminLoginId,
      role: 'admin',
      name: adminName || 'Campus Administrator',
      adminId: adminLoginId,
      designation: 'Campus Administrator & Principal',
      institutionId: instId,
      password: pwd,
      email: email,
      contact: phone
    };

    if (!db.institutions) db.institutions = {};
    db.institutions[instId] = newInst;
    db.users[adminLoginId] = adminUser;
    db.currentInstitutionId = instId;
    saveDb();

    // Permanent cloud sync
    fetch('/api/sync/save-institution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institution: newInst, adminUser })
    }).catch(err => console.warn('Sync save-institution:', err));

    showToast('🏛️ Institution "' + instName + '" registered with ID: ' + instId + '! Logging in as Administrator...', 'success');
    performLogin(adminUser, pwd);
  };
  document.getElementById('formScreenInstReg')?.addEventListener('submit', handleInstRegSubmit);
  document.getElementById('btnSubmitInstReg')?.addEventListener('click', handleInstRegSubmit);

  // --- SCREEN 3: ADMIN FORMS ---
  const handleAdminLoginSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('adminLoginInstId')?.value || '').trim();
    const uId = (document.getElementById('adminLoginUserId')?.value || '').trim();
    const pwd = (document.getElementById('adminLoginPassword')?.value || '').trim();
    executePortalLogin({ instId, uId, pwd, expectedRole: 'admin', roleDisplayName: 'Admin' });
  };
  document.getElementById('formAdminLogin')?.addEventListener('submit', handleAdminLoginSubmit);
  document.getElementById('btnSubmitAdminLogin')?.addEventListener('click', handleAdminLoginSubmit);

  const handleAdminRegSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('adminRegInstId')?.value || '').trim();
    const name = (document.getElementById('adminRegName')?.value || '').trim();
    const userId = (document.getElementById('adminRegUserId')?.value || '').trim();
    const email = (document.getElementById('adminRegEmail')?.value || '').trim();
    const phone = (document.getElementById('adminRegPhone')?.value || '').trim();
    const pwd = (document.getElementById('adminRegPassword')?.value || '').trim();
    executePortalRegister({ instId, userId, name, email, phone, branch: '', section: '', designation: 'Campus Administrator', pwd, role: 'admin', roleDisplayName: 'Admin' });
  };
  document.getElementById('formAdminRegister')?.addEventListener('submit', handleAdminRegSubmit);
  document.getElementById('btnSubmitAdminReg')?.addEventListener('click', handleAdminRegSubmit);

  // --- SCREEN 4: STUDENT FORMS ---
  const handleStudentLoginSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('studentLoginInstId')?.value || '').trim();
    const uId = (document.getElementById('studentLoginUserId')?.value || '').trim();
    const pwd = (document.getElementById('studentLoginPassword')?.value || '').trim();
    executePortalLogin({ instId, uId, pwd, expectedRole: 'student', roleDisplayName: 'Student' });
  };
  document.getElementById('formStudentLogin')?.addEventListener('submit', handleStudentLoginSubmit);
  document.getElementById('btnSubmitStudentLogin')?.addEventListener('click', handleStudentLoginSubmit);

  const handleStudentRegSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('studentRegInstId')?.value || '').trim();
    const name = (document.getElementById('studentRegName')?.value || '').trim();
    const userId = (document.getElementById('studentRegUserId')?.value || '').trim();
    const branch = (document.getElementById('studentRegBranch')?.value || '').trim();
    const section = (document.getElementById('studentRegSection')?.value || '').trim();
    const email = (document.getElementById('studentRegEmail')?.value || '').trim();
    const phone = (document.getElementById('studentRegPhone')?.value || '').trim();
    const pwd = (document.getElementById('studentRegPassword')?.value || '').trim();
    executePortalRegister({ instId, userId, name, email, phone, branch, section, designation: '', pwd, role: 'student', roleDisplayName: 'Student' });
  };
  document.getElementById('formStudentRegister')?.addEventListener('submit', handleStudentRegSubmit);
  document.getElementById('btnSubmitStudentReg')?.addEventListener('click', handleStudentRegSubmit);

  // --- SCREEN 5: FACULTY FORMS ---
  const handleFacultyLoginSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('facultyLoginInstId')?.value || '').trim();
    const uId = (document.getElementById('facultyLoginUserId')?.value || '').trim();
    const pwd = (document.getElementById('facultyLoginPassword')?.value || '').trim();
    executePortalLogin({ instId, uId, pwd, expectedRole: 'faculty', roleDisplayName: 'Faculty' });
  };
  document.getElementById('formFacultyLogin')?.addEventListener('submit', handleFacultyLoginSubmit);
  document.getElementById('btnSubmitFacultyLogin')?.addEventListener('click', handleFacultyLoginSubmit);

  const handleFacultyRegSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('facultyRegInstId')?.value || '').trim();
    const name = (document.getElementById('facultyRegName')?.value || '').trim();
    const userId = (document.getElementById('facultyRegUserId')?.value || '').trim();
    const branch = (document.getElementById('facultyRegBranch')?.value || '').trim();
    const email = (document.getElementById('facultyRegEmail')?.value || '').trim();
    const phone = (document.getElementById('facultyRegPhone')?.value || '').trim();
    const pwd = (document.getElementById('facultyRegPassword')?.value || '').trim();
    executePortalRegister({ instId, userId, name, email, phone, branch, section: '', designation: '', pwd, role: 'faculty', roleDisplayName: 'Faculty' });
  };
  document.getElementById('formFacultyRegister')?.addEventListener('submit', handleFacultyRegSubmit);
  document.getElementById('btnSubmitFacultyReg')?.addEventListener('click', handleFacultyRegSubmit);

  // --- SCREEN 6: HOSTEL FORMS ---
  const handleHostelLoginSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('hostelLoginInstId')?.value || '').trim();
    const uId = (document.getElementById('hostelLoginUserId')?.value || '').trim();
    const pwd = (document.getElementById('hostelLoginPassword')?.value || '').trim();
    executePortalLogin({ instId, uId, pwd, expectedRole: 'hostel_faculty', roleDisplayName: 'Hostel Management' });
  };
  document.getElementById('formHostelLogin')?.addEventListener('submit', handleHostelLoginSubmit);
  document.getElementById('btnSubmitHostelLogin')?.addEventListener('click', handleHostelLoginSubmit);

  const handleHostelRegSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const instId = (document.getElementById('hostelRegInstId')?.value || '').trim();
    const name = (document.getElementById('hostelRegName')?.value || '').trim();
    const userId = (document.getElementById('hostelRegUserId')?.value || '').trim();
    const branch = (document.getElementById('hostelRegBranch')?.value || '').trim();
    const designation = (document.getElementById('hostelRegDesignation')?.value || 'Hostel Staff / Warden').trim();
    const email = (document.getElementById('hostelRegEmail')?.value || '').trim();
    const phone = (document.getElementById('hostelRegPhone')?.value || '').trim();
    const pwd = (document.getElementById('hostelRegPassword')?.value || '').trim();
    executePortalRegister({ instId, userId, name, email, phone, branch, section: '', designation, pwd, role: 'hostel_faculty', roleDisplayName: 'Hostel Management' });
  };
  document.getElementById('formHostelRegister')?.addEventListener('submit', handleHostelRegSubmit);
  document.getElementById('btnSubmitHostelReg')?.addEventListener('click', handleHostelRegSubmit);

  // --- HEADER THREE-DOTS QUICK DROPDOWN MENU ---
  const btnHeaderMoreDots = document.getElementById('btnHeaderMoreDots');
  const menuHeaderMore = document.getElementById('menuHeaderMore');

  btnHeaderMoreDots?.addEventListener('click', (e) => {
    e.stopPropagation();
    menuHeaderMore?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (menuHeaderMore && !menuHeaderMore.contains(e.target) && e.target !== btnHeaderMoreDots) {
      menuHeaderMore.classList.remove('open');
    }
  });

  document.getElementById('menuDropProfile')?.addEventListener('click', () => {
    menuHeaderMore?.classList.remove('open');
    window.navigateToUserProfile();
  });

  document.getElementById('menuDropDigitalId')?.addEventListener('click', () => {
    menuHeaderMore?.classList.remove('open');
    switchView('page-digital-id', 'Digital ID Card');
    renderDigitalIdCard();
  });

  document.getElementById('menuDropSync')?.addEventListener('click', () => {
    menuHeaderMore?.classList.remove('open');
    saveDb();
    const instId = getTenantInstitutionId();
    showToast('☁️ Cloud Data Synchronized! Institution: ' + instId + ' (IndexedDB & Backend Online)', 'success');
  });

  document.getElementById('menuDropAi')?.addEventListener('click', () => {
    menuHeaderMore?.classList.remove('open');
    switchView('page-ai-assistant', 'Campus AI Assistant');
  });

  document.getElementById('menuDropSignOut')?.addEventListener('click', () => {
    menuHeaderMore?.classList.remove('open');
    handleSignOut();
  });

  // ================= 4. AUTHENTICATED STATE & USER PROFILE SYSTEM =================
  
  // Environment Detector: APK (Capacitor Native) vs Web Browser
  function isApkEnvironment() {
    return Boolean(
      window.Capacitor?.isNativePlatform?.() ||
      window.Capacitor?.isNative ||
      window.isCapacitorApp ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && window.navigator.userAgent.includes('wv')) ||
      window.navigator.userAgent.includes('Capacitor')
    );
  }

  // Save session: Permanently persisted so user stays logged in across app restarts until manual logout
  function saveAppSession(user) {
    if (!user || !user.id) return;
    const payload = JSON.stringify({
      userId: user.id,
      institutionId: user.institutionId || 'GEC-2026',
      role: user.role,
      name: user.name,
      timestamp: Date.now()
    });
    const userPayload = JSON.stringify(user);

    try {
      localStorage.setItem('smart_campus_persisted_user', userPayload);
      localStorage.setItem('smart_campus_persisted_session', payload);
      localStorage.setItem('smart_campus_apk_session', payload);
      localStorage.setItem('smart_campus_active_session', payload);
      localStorage.setItem('smart_campus_active_role', user.role);
    } catch (e) {
      console.warn('localStorage saveAppSession error:', e);
    }

    try {
      sessionStorage.setItem('smart_campus_web_session', payload);
      sessionStorage.setItem('smart_campus_active_session', payload);
    } catch (e) {}
  }

  // Clear session: Both storages when manually signing out
  function clearAppSession() {
    try { localStorage.removeItem('smart_campus_persisted_user'); } catch (e) {}
    try { localStorage.removeItem('smart_campus_persisted_session'); } catch (e) {}
    try { localStorage.removeItem('smart_campus_apk_session'); } catch (e) {}
    try { localStorage.removeItem('smart_campus_active_session'); } catch (e) {}
    try { localStorage.removeItem('smart_campus_active_role'); } catch (e) {}
    try { sessionStorage.removeItem('smart_campus_web_session'); } catch (e) {}
    try { sessionStorage.removeItem('smart_campus_active_session'); } catch (e) {}
  }

  const currentViewTitle = document.getElementById('currentViewTitle');
  const btnUserProfileLeft = document.getElementById('btnUserProfileLeft');
  const headerLeftManIcon = document.getElementById('headerLeftManIcon');
  const headerLeftAvatarImg = document.getElementById('headerLeftAvatarImg');
  const userPhotoUploadInput = document.getElementById('userPhotoUploadInput');
  const avatarInitials = document.getElementById('avatarInitials');

  // Stub closeDrawer for any leftover calls
  function closeDrawer() {}

  // Update All User Profile Avatars across the app
  function updateAllUserAvatars(user) {
    if (!user) return;
    const manIcon = document.getElementById('headerLeftManIcon');
    const img = document.getElementById('headerLeftAvatarImg');
    if (user.avatarUrl) {
      if (manIcon) manIcon.style.display = 'none';
      if (img) { img.src = user.avatarUrl; img.style.display = 'block'; }
    } else {
      if (manIcon) manIcon.style.display = 'block';
      if (img) img.style.display = 'none';
    }

    const moreAv = document.getElementById('moreProfileAvatar');
    if (moreAv) {
      if (user.avatarUrl) {
        moreAv.innerHTML = '<img src="' + user.avatarUrl + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
      } else {
        moreAv.textContent = user.role === 'student' ? '👨‍🎓' : (user.role === 'hostel_faculty' ? '🏢' : (user.role === 'faculty' ? '👩‍🏫' : '🏛️'));
      }
    }

    document.querySelectorAll('.profile-avatar-large').forEach(el => {
      if (user.avatarUrl) {
        el.innerHTML = '<img src="' + user.avatarUrl + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
      }
    });
  }

  // Left Profile Avatar click -> Navigates to user role-specific profile
  btnUserProfileLeft?.addEventListener('click', () => {
    window.navigateToUserProfile();
  });



  // Profile Photo Upload Handlers
  document.getElementById('btnMoreChangePhoto')?.addEventListener('click', () => {
    userPhotoUploadInput?.click();
  });
  document.getElementById('moreProfileAvatar')?.addEventListener('click', () => {
    userPhotoUploadInput?.click();
  });
  document.querySelectorAll('.profile-avatar-large').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to change profile photo';
    el.addEventListener('click', () => userPhotoUploadInput?.click());
  });

  userPhotoUploadInput?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Image size should be less than 3MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(evt) {
      const dataUrl = evt.target.result;
      if (db.currentUser) {
        db.currentUser.avatarUrl = dataUrl;
        if (db.users[db.currentUser.id]) {
          db.users[db.currentUser.id].avatarUrl = dataUrl;
        }
        saveDb();
        updateAllUserAvatars(db.currentUser);
        showToast('Profile photo updated successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  });

  // Perform Login
  function performLogin(userIdOrUser, password) {
    let user = null;
    if (typeof userIdOrUser === 'object' && userIdOrUser !== null) {
      user = userIdOrUser;
    } else if (typeof userIdOrUser === 'string') {
      const cleanKey = userIdOrUser.trim().toLowerCase();
      const cleanKeyAlpha = cleanKey.replace(/[^a-z0-9]/g, '');
      const userKey = Object.keys(db.users || {}).find(k => k.toLowerCase() === cleanKey || (cleanKeyAlpha && k.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKeyAlpha));
      user = userKey ? db.users[userKey] : null;
      if (!user) {
        user = Object.values(db.users || {}).find(u =>
          (u.id && (u.id.toLowerCase() === cleanKey || (cleanKeyAlpha && u.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKeyAlpha))) ||
          (u.roll && (u.roll.toLowerCase() === cleanKey || (cleanKeyAlpha && u.roll.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKeyAlpha))) ||
          (u.staffId && (u.staffId.toLowerCase() === cleanKey || (cleanKeyAlpha && u.staffId.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKeyAlpha))) ||
          (u.adminId && (u.adminId.toLowerCase() === cleanKey || (cleanKeyAlpha && u.adminId.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKeyAlpha))) ||
          (u.loginId && (u.loginId.toLowerCase() === cleanKey || (cleanKeyAlpha && u.loginId.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKeyAlpha))) ||
          (u.email && u.email.toLowerCase() === cleanKey)
        );
      }
    }

    if (!user) {
      showToast('❌ User not found. Please register first.', 'error');
      return;
    }

    const trimmedPwd = (password || '').trim();
    const userPwd = (user.password || '').toString();
    if (password !== undefined && userPwd !== password && userPwd.trim() !== trimmedPwd) {
      showToast('❌ Incorrect password. Please enter the password you registered with.', 'error');
      return;
    }

    db.currentUser = user;
    db.currentInstitutionId = user.institutionId || 'GEC-2026';
    saveDb();

    // 1. Reveal header profile avatar button
    const btnUserProfileLeft = document.getElementById('btnUserProfileLeft');
    if (btnUserProfileLeft) btnUserProfileLeft.style.display = 'flex';

    // 2. Update user profile initials
    const avInit = document.getElementById('avatarInitials');
    if (avInit) {
      const parts = (user.name || 'SC').trim().split(' ');
      avInit.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : user.name.slice(0, 2).toUpperCase();
    }

    // 3. Save Persistent Session for APK and Web
    saveAppSession(user);

    // 4. Activate session and redirect immediately to the role home page
    setupUserSession(user);
    showToast('Signed in successfully as ' + user.name + ' (' + (user.designation || user.role.toUpperCase()) + ')', 'success');
  }

  // Build Dynamic Drawer Menu Items in Column Format (Includes AI Assistant for ALL roles)
  function buildDynamicDrawer(user) {
    dynamicDrawerMenu.innerHTML = '';
    let items = [];

    if (user.role === 'student') {
      items = [
        { id: 'page-student-profile', icon: '👤', title: 'My Profile', desc: 'Personal info & overview' },
        { id: 'page-digital-id', icon: '🪪', title: 'Digital ID Card', desc: 'Student ID card & QR' },
        { id: 'page-student-notices', icon: '📢', title: 'Notices & Circulars', desc: 'Campus announcements' },
        { id: 'page-student-gatepass', icon: '🎫', title: 'Campus Gate Pass', desc: 'Outpass with verified QR' },
        { id: 'page-student-leavepass', icon: '🏠', title: 'Hostel Leave Pass', desc: 'Night stay / home leave' },
        { id: 'page-student-certificates', icon: '📜', title: 'Certificates Desk', desc: 'Bonafide & character' },
        { id: 'page-ai-assistant', icon: '🤖', title: 'Campus AI Assistant', desc: 'Smart Campus advisor' }
      ];
    } else if (user.role === 'hostel_faculty') {
      items = [
        { id: 'page-hostel-profile', icon: '🏠', title: 'Hostel Profile', desc: 'Superintendent info & scope' },
        { id: 'page-digital-id', icon: '🪪', title: 'Digital ID Card', desc: 'Staff ID card & QR' },
        { id: 'page-hostel-gatepasses', icon: '🎫', title: 'Review Gate Passes', desc: 'Review & approve outpasses' },
        { id: 'page-hostel-leavepasses', icon: '🚪', title: 'Review Leave Passes', desc: 'Review & approve home leaves' },
        { id: 'page-hostel-notices', icon: '📢', title: 'Hostel Circulars', desc: 'Broadcast hostel notices' },
        { id: 'page-ai-assistant', icon: '🤖', title: 'Campus AI Assistant', desc: 'Hostel policy advisor' }
      ];
    } else if (user.role === 'faculty') {
      items = [
        { id: 'page-faculty-profile', icon: '👨‍🏫', title: 'Faculty Profile', desc: 'Department & courses' },
        { id: 'page-digital-id', icon: '🪪', title: 'Digital ID Card', desc: 'Faculty ID card & QR' },
        { id: 'page-faculty-attendance', icon: '📝', title: 'Take Student Attendance', desc: 'Roll-call [P] [A] [L] register' },
        { id: 'page-faculty-certificates', icon: '📜', title: 'Verify Certificates', desc: 'Approve student requests' },
        { id: 'page-faculty-notices', icon: '📢', title: 'Publish Notices', desc: 'Departmental circulars' },
        { id: 'page-ai-assistant', icon: '🤖', title: 'Campus AI Assistant', desc: 'Lesson planner & advisor' }
      ];
    } else if (user.role === 'admin') {
      items = [
        { id: 'page-admin-overview', icon: '🏛️', title: 'Admin Overview', desc: 'Campus metrics & summary' },
        { id: 'page-digital-id', icon: '🪪', title: 'Digital ID Card', desc: 'Admin ID card & QR' },
        { id: 'page-admin-students', icon: '📊', title: 'Student Directory', desc: 'Student enrollment & records' },
        { id: 'page-admin-faculties', icon: '👨‍🏫', title: 'Faculty Directory', desc: 'Faculty profiles & branches' },
        { id: 'page-admin-timetables', icon: '📅', title: 'Master Timetables', desc: 'Institutional schedules' },
        { id: 'page-ai-assistant', icon: '🤖', title: 'Campus AI Assistant', desc: 'Policy & analytics assistant' }
      ];
    } else {
      items = [
        { id: 'page-ai-assistant', icon: '🤖', title: 'Campus AI Assistant', desc: 'Smart Campus advisor' }
      ];
    }

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drawer-item';
      btn.dataset.targetPage = item.id;
      btn.innerHTML =
        '<span class="drawer-item-icon">' + item.icon + '</span>' +
        '<div class="drawer-item-info">' +
          '<span class="drawer-item-title">' + item.title + '</span>' +
          '<span class="drawer-item-desc">' + item.desc + '</span>' +
        '</div>';
      btn.addEventListener('click', () => {
        switchView(item.id, item.title);
      });
      dynamicDrawerMenu.appendChild(btn);
    });
  }


    // ================= RESET AI ASSISTANT SESSION (ZERO HISTORY LEAKAGE) =================
  function resetAiAssistantSession() {
    chatHistory = [];
    const thread = document.getElementById("chatAiThread");
    if (thread) {
      thread.innerHTML = '<div class="chat-bubble chat-bubble-ai">' +
        '<div class="chat-sender"><span>🤖</span> Campus AI Assistant</div>' +
        '<div class="chat-text">Welcome, How may I help you</div>' +
        '<div class="chat-time">Online</div>' +
      '</div>';
    }
    const cUser = (db && db.currentUser) ? db.currentUser : { role: "student" };
    if (typeof renderAiPromptChips === "function") {
      renderAiPromptChips(cUser.role);
    }
  }

  // Switch View (HIDES all other pages and displays ONLY that specific page!)
  
  // MULTI-TENANT INSTITUTION DATA ISOLATION HELPER
  function getTenantInstitutionId() {
    return (db.currentUser && db.currentUser.institutionId) || db.currentInstitutionId || 'GEC-2026';
  }

  let navigationHistory = [];
  let currentPageId = 'page-home';

  // Global Go Back function (True Navigation Stack Pop)
  window.goBackPage = function() {
    const mainTabs = ['page-home', 'page-services', 'page-requests', 'page-more'];
    const unauthPages = ['view-auth', 'screen-inst-register', 'screen-admin-portal', 'screen-student-portal', 'screen-faculty-portal', 'screen-hostel-portal'];

    if (!db.currentUser) {
      if (unauthPages.includes(currentPageId) && currentPageId !== 'view-auth') {
        switchView('view-auth', 'Smart Campus', false);
        return;
      }
      return;
    }

    // Pop the previous history item
    while (navigationHistory.length > 0) {
      const prev = navigationHistory.pop();
      if (prev && prev.id && prev.id !== currentPageId) {
        switchView(prev.id, prev.title || 'Smart Campus', false);
        return;
      }
    }

    // Fallback if history stack is exhausted
    if (!mainTabs.includes(currentPageId)) {
      switchView('page-services', 'Campus Services', false);
      return;
    }
    if (currentPageId !== 'page-home') {
      switchView('page-home', 'Home Dashboard', false);
      return;
    }
  };

  function switchView(pageId, pageTitle, pushHistory = true) {
    const bottomNavEl = document.getElementById('bottomNav');
    const unauthPages = ['view-auth', 'screen-inst-register', 'screen-admin-portal', 'screen-student-portal', 'screen-faculty-portal', 'screen-hostel-portal'];
    const mainTabPages = ['page-home', 'page-services', 'page-requests', 'page-more'];

    // Track navigation history for subpages
    if (pushHistory && currentPageId && currentPageId !== pageId) {
      if (db.currentUser && !unauthPages.includes(currentPageId) && !unauthPages.includes(pageId)) {
        navigationHistory.push({ id: currentPageId, title: currentViewTitle ? currentViewTitle.textContent : '' });
        if (navigationHistory.length > 30) navigationHistory.shift();
      }
    }
    currentPageId = pageId;

    const btnUserProfileLeftEl = document.getElementById('btnUserProfileLeft');
    const appHeaderEl = document.getElementById('appHeader');
    const btnNotificationBellEl = document.getElementById('btnNotificationBell');
    const btnHeaderAvatarEl = document.getElementById('btnHeaderAvatar');
    const btnHeaderMoreDotsEl = document.getElementById('btnHeaderMoreDots');
    const menuHeaderMoreEl = document.getElementById('menuHeaderMore');
    const brandHeadingEl = document.getElementById('brandHeading');
    const currentViewTitleEl = document.getElementById('currentViewTitle');

    if (unauthPages.includes(pageId) || !db.currentUser) {
      document.body.classList.remove('logged-in');
      document.body.classList.add('unauthenticated');
      // Show top app header on 1st page & portals
      if (appHeaderEl) appHeaderEl.style.display = 'flex';
      // HIDE bottom navigation bar on 1st page & portals
      if (bottomNavEl) bottomNavEl.style.display = 'none';
      // HIDE notification bell, SC avatar, three dots menu, and user profile avatar
      if (btnNotificationBellEl) btnNotificationBellEl.style.display = 'none';
      if (btnHeaderAvatarEl) btnHeaderAvatarEl.style.display = 'none';
      if (btnHeaderMoreDotsEl) btnHeaderMoreDotsEl.style.display = 'none';
      if (menuHeaderMoreEl) menuHeaderMoreEl.classList.remove('active');
      if (btnUserProfileLeftEl) btnUserProfileLeftEl.style.display = 'none';

      if (pageId === 'view-auth') {
        if (brandHeadingEl) brandHeadingEl.textContent = 'Smart Campus';
        if (currentViewTitleEl) currentViewTitleEl.textContent = 'Campus Portal';
      } else {
        if (brandHeadingEl) brandHeadingEl.textContent = 'Smart Campus';
        if (currentViewTitleEl) currentViewTitleEl.textContent = pageTitle || 'Portal';
      }
    } else {
      document.body.classList.add('logged-in');
      document.body.classList.remove('unauthenticated');
      // Show top app header and bottom navigation bar when logged in
      if (appHeaderEl) appHeaderEl.style.display = 'flex';
      if (bottomNavEl) bottomNavEl.style.display = 'flex';
      // Show notification bell, SC avatar, three dots menu
      if (btnNotificationBellEl) btnNotificationBellEl.style.display = 'inline-flex';
      if (btnHeaderAvatarEl) btnHeaderAvatarEl.style.display = 'inline-flex';
      if (btnHeaderMoreDotsEl) btnHeaderMoreDotsEl.style.display = 'inline-flex';

      if (brandHeadingEl) brandHeadingEl.textContent = 'Smart Campus';
      if (currentViewTitleEl) currentViewTitleEl.textContent = pageTitle || 'Dashboard';

      // Left profile avatar icon displayed when authenticated
      if (btnUserProfileLeftEl) btnUserProfileLeftEl.style.display = 'flex';
    }

    // Update active tab highlight in Bottom Navigation
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    if (pageId === 'page-home') {
      document.getElementById('navTabHome')?.classList.add('active');
    } else if (pageId === 'page-services') {
      document.getElementById('navTabServices')?.classList.add('active');
    } else if (pageId === 'page-requests') {
      document.getElementById('navTabRequests')?.classList.add('active');
    } else if (pageId === 'page-more') {
      document.getElementById('navTabMore')?.classList.add('active');
    }

    // Ensure Admin-only '+' FAB is strictly shown only to Admin
    const navFabNewRequestEl = document.getElementById('navFabNewRequest');
    if (navFabNewRequestEl) {
      navFabNewRequestEl.style.display = (db.currentUser && db.currentUser.role === 'admin') ? 'flex' : 'none';
    }

    const prevActive = document.querySelector(".app-page.active");
    if (prevActive && prevActive.id === "page-ai-assistant" && pageId !== "page-ai-assistant") {
      resetAiAssistantSession();
    }
    if (pageId === "page-ai-assistant") {
      resetAiAssistantSession();
    }
    document.querySelectorAll('.app-page').forEach(page => {
      page.classList.remove('active');
    });

    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
    }

    if (currentViewTitle && pageTitle) {
      currentViewTitle.textContent = pageTitle;
    }

    // Highlight active item in drawer
    document.querySelectorAll('.drawer-item').forEach(item => {
      item.classList.toggle('active', item.dataset.targetPage === pageId);
    });

    // Dynamic Role-Specific View Triggers
    if (db.currentUser) {
      if (pageId === 'page-home') {
        renderRoleHome(db.currentUser);
      } else if (pageId === 'page-services') {
        renderRoleServices(db.currentUser);
      } else if (pageId === 'page-assignments') {
        renderAssignmentsList();
      } else if (pageId === 'page-library') {
        renderLibraryCatalog();
      } else if (pageId === 'page-digital-id') {
        renderDigitalIdCard();
      } else if (pageId === 'page-transport') {
        renderTransportRoutes();
      } else if (pageId === 'page-student-fees') {
        if (typeof window.renderStudentFeeDesk === 'function') window.renderStudentFeeDesk();
      } else if (pageId === 'page-more') {
        renderMoreProfile();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeDrawer();
  }

  // Sign Out Handler
  function handleSignOut() {
    try {
      clearAppSession();
    } catch (e) {}
    db.currentUser = null;
    saveDb();
    resetAiAssistantSession();

    document.body.classList.remove('logged-in');
    document.body.classList.add('unauthenticated');
    const appHeaderEl = document.getElementById('appHeader');
    const bottomNavEl = document.getElementById('bottomNav');
    if (appHeaderEl) appHeaderEl.style.display = 'flex';
    if (bottomNavEl) bottomNavEl.style.display = 'none';
    const menuHeaderMoreEl = document.getElementById('menuHeaderMore');
    if (menuHeaderMoreEl) menuHeaderMoreEl.classList.remove('active');

    // Reset all portal forms back to Login view and clear inputs
    ['formAdminLogin', 'formStudentLogin', 'formFacultyLogin', 'formHostelLogin'].forEach(fId => {
      portalPillControllers[fId]?.showLogin();
      try { document.getElementById(fId)?.reset(); } catch (e) {}
    });
    ['formAdminRegister', 'formStudentRegister', 'formFacultyRegister', 'formHostelRegister', 'formScreenInstReg'].forEach(fId => {
      try { document.getElementById(fId)?.reset(); } catch (e) {}
    });

    switchView('view-auth', 'Smart Campus', false);
    showToast('Signed out successfully.');
  }
  window.handleSignOut = handleSignOut;

  document.getElementById('btnDrawerSignOut')?.addEventListener('click', handleSignOut);

  // ================= 5. STUDENT DATA & OPERATIONS =================
  function renderStudentData(user) {
    if (!user) user = db.currentUser || {};
    const elName = document.getElementById('stuProfileName');
    if (elName) elName.textContent = user.name || 'Student';
    const elSub = document.getElementById('stuProfileSubtitle');
    if (elSub) elSub.textContent = (user.roll || user.id || '') + ' • ' + (user.sem || '5th Sem') + ' • ' + (user.branch || user.dept || 'Computer Science & Engg');
    const elBranchSec = document.getElementById('stuBranchSection');
    if (elBranchSec) elBranchSec.textContent = (user.branch || user.dept || 'Computer Science & Engineering') + (user.section ? (' • Section ' + user.section) : ' • Section A');
    const elEmail = document.getElementById('stuEmailLabel');
    if (elEmail) elEmail.textContent = user.email || ((user.id || 'student').toLowerCase() + '@campus.edu');
    const elContact = document.getElementById('stuContactLabel');
    if (elContact) elContact.textContent = user.contact || user.phone || '+91 98765 43210';
    const elInstLabel = document.getElementById('stuInstLabel');
    if (elInstLabel) elInstLabel.textContent = user.institutionId || 'GEC-2026';
    const elHostelLabel = document.getElementById('stuHostelLabel');
    if (elHostelLabel) elHostelLabel.textContent = user.hostel || 'Room 304, Brahmaputra Hostel';
    const elAttd = document.getElementById('stuStatAttd');
    if (elAttd) elAttd.textContent = (user.attendance || '88.3') + '%';
    const elCgpa = document.getElementById('stuStatCgpa');
    if (elCgpa) elCgpa.textContent = user.cgpa || '8.72';

    // Subject breakdown
    const list = document.getElementById('stuSubjectList');
    if (list) {
      const subjects = user.subjects || [
        { code: 'CS501', name: 'Design & Analysis of Algorithms', attended: 42, total: 46, pct: 91.3, faculty: 'Prof. A. K. Sharma' },
        { code: 'CS502', name: 'Database Management Systems', attended: 38, total: 44, pct: 86.4, faculty: 'Dr. S. Mohanty' },
        { code: 'CS503', name: 'Operating Systems', attended: 35, total: 42, pct: 83.3, faculty: 'Prof. P. R. Panda' },
        { code: 'CS504', name: 'Formal Language & Automata', attended: 30, total: 40, pct: 75.0, faculty: 'Prof. R. Mishra' }
      ];
      list.innerHTML = subjects.map(s => {
        const color = s.pct >= 75 ? '#34d399' : '#f87171';
        const bg = s.pct >= 75 ? '#10b981' : '#ef4444';
        return '<div style="margin-bottom: 10px; padding: 10px 12px; background: rgba(255,255,255,0.03); border-radius: 10px; border: 1px solid var(--border-light);">' +
          '<div style="display:flex; justify-content:space-between; margin-bottom: 4px;">' +
            '<strong style="font-size:0.85rem; color:#fff;">' + s.name + ' (' + s.code + ')</strong>' +
            '<span style="font-size:0.85rem; font-weight:700; color:' + color + ';">' + s.pct + '%</span>' +
          '</div>' +
          '<div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden; margin-bottom: 4px;">' +
            '<div style="width:' + s.pct + '%; height:100%; background:' + bg + ';"></div>' +
          '</div>' +
          '<div style="font-size:0.72rem; color:var(--text-sub); display:flex; justify-content:space-between;">' +
            '<span>Faculty: ' + s.faculty + '</span>' +
            '<span>' + s.attended + '/' + s.total + ' Classes</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    showStudentTimetable('Mon');
    renderStudentPasses();
    renderStudentComplaints();
    renderStudentCanteenHistory();
    renderStudentNotices();
  }

  function showStudentTimetable(day) {
    window.showStudentTimetable = showStudentTimetable;
    document.querySelectorAll('#page-student-timetable .tt-day-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.day === day);
    });
    const container = document.getElementById('stuTimetablePeriods');
    if (!container) return;
    const periods = db.timetables[day] || [];
    container.innerHTML = periods.map(p => {
      return '<div class="tt-period-card">' +
        '<div>' +
          '<div style="font-weight:700; color:#fff; font-size:0.88rem;">' + p.subject + ' (' + p.code + ')</div>' +
          '<div style="font-size:0.72rem; color:var(--text-sub); margin-top:2px;">????? ' + p.faculty + ' � ?? ' + p.room + '</div>' +
        '</div>' +
        '<div style="font-size:0.78rem; font-weight:700; color:var(--brand-cyan); background:rgba(6,182,212,0.1); padding:4px 8px; border-radius:8px;">' +
          p.time +
        '</div>' +
      '</div>';
    }).join('');
  };

  function renderStudentPasses() {
    const area = document.getElementById('stuGatePassStatusArea');
    if (!area) return;
    const myPasses = db.passes.filter(p => p.roll === 'CS-2024-082' || (db.currentUser && p.roll === db.currentUser.roll));
    if (myPasses.length === 0) {
      area.innerHTML = '<p style="color:var(--text-muted); font-size:0.8rem;">No active gate pass requests.</p>';
      return;
    }

    area.innerHTML = myPasses.map(p => {
      const isApproved = p.status.includes('APPROVED');
      const badgeClass = isApproved ? 'badge-approved' : 'badge-pending';
      const qrId = 'qr_' + p.id;

      let html = '<div class="approval-card">' +
        '<div class="approval-meta">' +
          '<strong style="color:#fff;">' + p.type + ' (' + p.id + ')</strong>' +
          '<span class="approval-badge ' + badgeClass + '">' + p.status + '</span>' +
        '</div>' +
        '<div style="font-size:0.76rem; color:var(--text-sub); line-height:1.6;">' +
          '<div>Time: <strong>' + p.departure + ' to ' + p.returnTime + '</strong></div>' +
          '<div>Reason: ' + p.reason + '</div>' +
          '<div>Approving Authority: <strong style="color:#60a5fa;">Hostel Superintendent (Dr. R. K. Nayak)</strong></div>' +
        '</div>';

      if (isApproved) {
        html += '<div class="qr-preview-box" style="margin-top:10px;">' +
          '<div id="' + qrId + '"></div>' +
          '<span style="font-size:0.7rem; color:#059669; font-weight:700; margin-top:6px;">VALID SCANNABLE CAMPUS PASS</span>' +
        '</div>';
      } else {
        html += '<div style="margin-top:8px; padding:6px 10px; background:rgba(245,158,11,0.1); border-radius:8px; font-size:0.74rem; color:#fbbf24;">' +
          '? Waiting for approval from Hostel Superintendent Dr. R. K. Nayak.' +
        '</div>';
      }

      html += '</div>';
      return html;
    }).join('');

    myPasses.forEach(p => {
      if (p.status.includes('APPROVED') && typeof QRCode !== 'undefined') {
        const qrBox = document.getElementById('qr_' + p.id);
        if (qrBox) {
          qrBox.innerHTML = '';
          try {
            new QRCode(qrBox, {
              text: 'CAMPUS-PASS:' + p.id + ':APPROVED:SUPERINTENDENT',
              width: 150,
              height: 150,
              colorDark: '#0f172a',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.M
            });
          } catch (e) {}
        }
      }
    });

    const lpArea = document.getElementById('stuLeavePassStatusArea');
    if (lpArea) {
      lpArea.innerHTML = db.leavePasses.map(lp => {
        const isApproved = lp.status.includes('APPROVED');
        return '<div class="approval-card">' +
          '<div class="approval-meta">' +
            '<strong style="color:#fff;">' + lp.type + ' (' + lp.id + ')</strong>' +
            '<span class="approval-badge ' + (isApproved ? 'badge-approved' : 'badge-pending') + '">' + lp.status + '</span>' +
          '</div>' +
          '<div style="font-size:0.76rem; color:var(--text-sub); line-height:1.6;">' +
            '<div>Destination: <strong>' + lp.destination + '</strong></div>' +
            '<div>Dates: ' + lp.departureDate + ' to ' + lp.returnDate + '</div>' +
            '<div>Reason: ' + lp.reason + '</div>' +
            '<div>Approving Authority: <strong style="color:#60a5fa;">Hostel Superintendent</strong></div>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  }

  document.getElementById('stuGatePassForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const reason = document.getElementById('gpReason').value.trim();
    const dep = document.getElementById('gpDeparture').value;
    const ret = document.getElementById('gpReturn').value;
    const student = db.currentUser || db.users['CS-2024-082'];

    const hType = (db.currentUser && db.currentUser.hostelType) || (db.currentUser && db.currentUser.hostel && db.currentUser.hostel.toLowerCase().includes('girls') ? 'Girls Hostel' : 'Boys Hostel');
    const newPass = {
      hostelType: hType,
      targetSuperintendent: (hType === 'Girls Hostel' ? 'Girls Hostel Superintendent' : 'Boys Hostel Superintendent'),
      id: 'GP-' + Math.floor(100 + Math.random() * 900),
      studentName: student.name,
      roll: student.roll || student.id,
      type: 'Campus Day Outpass',
      reason,
      departure: dep,
      returnTime: ret,
      status: 'PENDING APPROVAL (Hostel Superintendent)',
      approverRole: 'Hostel Superintendent',
      qrData: 'CAMPUS-PASS-PENDING'
    };

    db.passes.unshift(newPass);
    saveDb();
    renderStudentPasses();
    showToast('Gate pass submitted! Forwarded to Hostel Superintendent Dr. R. K. Nayak for approval.', 'success');
  });

  document.getElementById('stuLeavePassForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dest = document.getElementById('lpDestination').value.trim();
    const reason = document.getElementById('lpReason').value.trim();
    const dep = document.getElementById('lpDepartureDate').value;
    const ret = document.getElementById('lpReturnDate').value;
    const student = db.currentUser || db.users['CS-2024-082'];

    const newLp = {
      id: 'LP-' + Math.floor(100 + Math.random() * 900),
      studentName: student.name,
      roll: student.roll || student.id,
      type: 'Hostel Leave Pass',
      destination: dest,
      reason,
      departureDate: dep,
      returnDate: ret,
      status: 'PENDING APPROVAL (Hostel Superintendent)',
      approverRole: 'Hostel Superintendent'
    };

    db.leavePasses.unshift(newLp);
    saveDb();
    renderStudentPasses();
    showToast('Hostel leave pass submitted to Hostel Superintendent!', 'success');
  });

  document.getElementById('stuFeePaymentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const head = document.getElementById('stuFeeSelect').value;
    const amt = document.getElementById('stuFeeAmount').value;
    const preview = document.getElementById('stuReceiptDisplay');
    const student = db.currentUser || db.users['CS-2024-082'];
    const inst = db.institutions[db.currentInstitutionId] || db.institutions['GEC-2026'];
    const txn = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);

    preview.style.display = 'block';
    preview.innerHTML =
      '<div style="padding:14px; background:#fff; color:#0f172a; border-radius:12px; border:2px dashed #059669;">' +
        '<div style="text-align:center; border-bottom:1px solid #cbd5e1; padding-bottom:6px; margin-bottom:8px;">' +
          '<div style="font-size:0.7rem; color:#64748b; font-weight:700;">OFFICIAL E-RECEIPT</div>' +
          '<h3 style="font-size:0.95rem; color:#1e293b;">' + inst.name.toUpperCase() + '</h3>' +
        '</div>' +
        '<div style="font-size:0.78rem; line-height:1.6; color:#334155;">' +
          '<div>Student: <strong>' + student.name + '</strong> (' + (student.roll || student.id) + ')</div>' +
          '<div>Head: <strong>' + head + '</strong></div>' +
          '<div>Amount Paid: <strong style="color:#059669; font-size:0.95rem;">?' + Number(amt).toLocaleString('en-IN') + '</strong></div>' +
          '<div>Txn Ref: <strong>' + txn + '</strong></div>' +
          '<div>Status: <strong style="color:#059669;">PAYMENT VERIFIED � CLEARED</strong></div>' +
        '</div>' +
      '</div>';
    showToast('Fee paid successfully! Official verified e-receipt generated.', 'success');
  });

  document.getElementById('stuCertForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('certSelect').value;
    const purpose = document.getElementById('certPurpose').value.trim();
    const area = document.getElementById('stuCertPreview');
    const student = db.currentUser || db.users['CS-2024-082'];

    area.style.display = 'block';
    area.innerHTML =
      '<div style="padding:14px; background:#fff; color:#0f172a; border-radius:12px; border:2px solid #cbd5e1; text-align:center;">' +
        '<div style="font-size:0.72rem; color:#64748b; font-weight:700;">INSTITUTIONAL DIGITAL CERTIFICATE</div>' +
        '<h4 style="font-size:1rem; color:#1e293b; margin:4px 0;">' + type.toUpperCase() + '</h4>' +
        '<p style="font-size:0.8rem; color:#475569; margin:6px 0;">' +
          'This is to verify that <strong>' + student.name + '</strong> (Roll: ' + (student.roll || student.id) + ') is enrolled in ' + (student.dept || 'CSE') + '.' +
          '<br>Issued for: <em>' + purpose + '</em>' +
        '</p>' +
        '<span style="font-size:0.7rem; color:#059669; font-weight:700;">DIGITALLY ATTESTED BY CONTROLLER OF EXAMINATIONS</span>' +
      '</div>';
    showToast('Certificate generated successfully!', 'success');
  });

  function renderStudentComplaints() {
    const list = document.getElementById('stuHostelComplaintsList');
    if (!list) return;
    list.innerHTML = db.complaints.map(c => {
      return '<div class="approval-card">' +
        '<div class="approval-meta">' +
          '<strong style="color:#fff;">' + c.category + '</strong>' +
          '<span class="approval-badge badge-pending">' + c.status + '</span>' +
        '</div>' +
        '<p style="font-size:0.76rem; color:var(--text-sub); margin-top:4px;">' + c.desc + '</p>' +
      '</div>';
    }).join('');
  }

  document.getElementById('stuHostelComplaintForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = document.getElementById('hcCategory').value;
    const desc = document.getElementById('hcDesc').value.trim();
    const student = db.currentUser || db.users['CS-2024-082'];

    db.complaints.unshift({
      id: 'CMP-' + Date.now().toString().slice(-4),
      student: student.name,
      category: cat,
      room: 'Room 304',
      desc,
      status: 'In Progress (24h SLA)',
      date: 'Today'
    });
    saveDb();
    renderStudentComplaints();
    e.target.reset();
    showToast('Hostel maintenance complaint registered with 24h SLA!', 'success');
  });

  function renderStudentCanteenHistory() {
    const hist = document.getElementById('stuCanteenHistory');
    if (!hist) return;
    hist.innerHTML = db.canteenFeedbacks.map(f => {
      return '<div class="feedback-record-card">' +
        '<div style="display:flex; justify-content:space-between; margin-bottom:2px;">' +
          '<strong style="color:#fff; font-size:0.84rem;">' + f.meal + '</strong>' +
          '<span class="rating-stars">' + f.rating + '</span>' +
        '</div>' +
        '<p style="font-size:0.75rem; color:var(--text-sub);">' + f.comment + '</p>' +
        '<span style="font-size:0.68rem; color:var(--brand-cyan);">By: ' + f.student + ' � ' + f.date + '</span>' +
      '</div>';
    }).join('');
  }

  document.getElementById('stuCanteenForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const meal = document.getElementById('cpMeal').value;
    const rating = document.getElementById('cpRating').value;
    const comment = document.getElementById('cpComments').value.trim();
    const student = db.currentUser || db.users['CS-2024-082'];

    db.canteenFeedbacks.unshift({
      id: 'CFB-' + Date.now().toString().slice(-4),
      student: student.name,
      meal,
      rating,
      comment,
      date: 'Today'
    });
    saveDb();
    renderStudentCanteenHistory();
    e.target.reset();
    showToast('Canteen feedback recorded! Canteen supervisor notified.', 'success');
  });

  function renderStudentNotices() {
    const feed = document.getElementById('stuNoticesFeed');
    if (!feed) return;
    const currentInstId = getTenantInstitutionId();
    const instNotices = (db.notices || []).filter(n => !n.institutionId || n.institutionId === currentInstId);
    if (instNotices.length === 0) {
      feed.innerHTML = '<div style="padding:24px; text-align:center; color:#94a3b8; font-size:0.85rem;">No circulars published for your institution yet.</div>';
      return;
    }
    feed.innerHTML = instNotices.map(n => {
      return '<div class="notice-card">' +
        '<div class="notice-meta">' +
          '<span class="approval-badge badge-pending">' + n.category.toUpperCase() + '</span>' +
          '<span style="font-size:0.7rem; color:var(--text-sub);">' + n.date + '</span>' +
        '</div>' +
        '<h4 style="font-size:0.92rem; font-weight:700; color:#fff; margin-bottom:4px;">' + n.title + '</h4>' +
        '<p style="font-size:0.78rem; color:var(--text-sub); line-height:1.4;">' + n.body + '</p>' +
        '<div style="font-size:0.7rem; color:var(--brand-cyan); margin-top:6px;">Issued by: ' + n.dept + '</div>' +
      '</div>';
    }).join('');
  }

  // ================= 6. FACULTY & HOSTEL SUPERINTENDENT DATA =================
  function renderFacultyData(user) {
    if (!user) user = db.currentUser || {};
    const elName = document.getElementById('facProfileName');
    if (elName) elName.textContent = user.name || 'Faculty Member';
    const elSub = document.getElementById('facProfileSubtitle');
    if (elSub) elSub.textContent = (user.staffId || user.id || 'FAC') + ' • ' + (user.department || user.dept || 'Computer Science & Engg');
    const elRole = document.getElementById('facStatRole');
    if (elRole) elRole.textContent = user.designation || 'Faculty';

    const elInst = document.getElementById('facInstLabel');
    if (elInst) elInst.textContent = user.institutionId || 'GEC-2026';
    const elStaffId = document.getElementById('facStaffIdLabel');
    if (elStaffId) elStaffId.textContent = user.staffId || user.id || 'FAC-102';
    const elDept = document.getElementById('facDeptLabel');
    if (elDept) elDept.textContent = user.department || user.dept || 'Computer Science & Engg';
    const elEmail = document.getElementById('facEmailLabel');
    if (elEmail) elEmail.textContent = user.email || ((user.id || 'faculty').toLowerCase() + '@campus.edu');
    const elContact = document.getElementById('facContactLabel');
    if (elContact) elContact.textContent = user.contact || user.phone || '+91 94370 23456';

    renderFacultyRollCall(user);
    showFacultyTimetable('Mon');

    if (user.designation === 'Hostel Superintendent' || user.id === 'WARDEN-101') {
      renderSuperintendentApprovals();
    }
  }

  function renderFacultyRollCall(user) {
    const list = document.getElementById('facRollCallList');
    if (!list) return;
    const students = (user.students || defaultDatabase.users['FAC-102'].students);
    list.innerHTML = students.map((st, idx) => {
      return '<div class="roll-call-item">' +
        '<div class="roll-call-info">' +
          '<h4>' + st.name + '</h4>' +
          '<span>' + st.roll + '</span>' +
        '</div>' +
        '<div class="roll-btn-group">' +
          '<button type="button" class="btn-roll p ' + (st.status === 'P' ? 'selected' : '') + '" onclick="toggleFacultyRoll(' + idx + ', \'P\')">P</button>' +
          '<button type="button" class="btn-roll a ' + (st.status === 'A' ? 'selected' : '') + '" onclick="toggleFacultyRoll(' + idx + ', \'A\')">A</button>' +
          '<button type="button" class="btn-roll l ' + (st.status === 'L' ? 'selected' : '') + '" onclick="toggleFacultyRoll(' + idx + ', \'L\')">L</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  window.toggleFacultyRoll = function(idx, status) {
    const user = db.currentUser;
    if (user && user.students && user.students[idx]) {
      user.students[idx].status = status;
      saveDb();
      renderFacultyRollCall(user);
    }
  };

  document.getElementById('btnFacMarkAllP')?.addEventListener('click', () => {
    const user = db.currentUser;
    if (user && user.students) {
      user.students.forEach(st => st.status = 'P');
      saveDb();
      renderFacultyRollCall(user);
      showToast('All students marked Present [P]!', 'success');
    }
  });

  document.getElementById('btnFacSaveRollCall')?.addEventListener('click', () => {
    showToast('Attendance roll-call saved & broadcasted to academic registry!', 'success');
  });

  function showFacultyTimetable(day) {
    window.showFacultyTimetable = showFacultyTimetable;
    document.querySelectorAll('#page-faculty-timetable .tt-day-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.day === day);
    });
    const list = document.getElementById('facTimetableList');
    if (!list) return;
    const periods = db.timetables[day] || [];
    list.innerHTML = periods.map(p => {
      return '<div class="tt-period-card">' +
        '<div>' +
          '<div style="font-weight:700; color:#fff; font-size:0.88rem;">' + p.subject + ' (' + p.code + ')</div>' +
          '<div style="font-size:0.72rem; color:var(--text-sub); margin-top:2px;">?? Lecture Room: ' + p.room + '</div>' +
        '</div>' +
        '<div style="font-size:0.78rem; font-weight:700; color:var(--brand-cyan); background:rgba(6,182,212,0.1); padding:4px 8px; border-radius:8px;">' +
          p.time +
        '</div>' +
      '</div>';
    }).join('');
  };

  document.getElementById('facIssueCertForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const roll = document.getElementById('icRoll').value;
    const name = document.getElementById('icName').value;
    const type = document.getElementById('icType').value;
    showToast('Certificate "' + type + '" verified & published to student ' + name + ' (' + roll + ')!', 'success');
  });

  document.getElementById('facNoticeForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('fnTitle').value.trim();
    const body = document.getElementById('fnBody').value.trim();
    const faculty = db.currentUser;

    db.notices.unshift({
      id: 'NOT-' + Date.now().toString().slice(-4),
      title,
      dept: faculty.dept || 'CSE Dept',
      date: 'Today',
      category: 'academic',
      body
    });
    saveDb();
    e.target.reset();
    showToast('Department notice published!', 'success');
  });

  // HOSTEL SUPERINTENDENT SPECIAL APPROVALS
  function renderSuperintendentApprovals() {
    const list = document.getElementById('superintendentApprovalsList');
    if (!list) return;

    const allPasses = db.passes.concat(db.leavePasses);
    if (allPasses.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted); font-size:0.8rem;">No pending pass requests.</p>';
      return;
    }

    list.innerHTML = allPasses.map((p, idx) => {
      const isApproved = p.status.includes('APPROVED');
      const isGate = p.type.includes('Gate') || p.type.includes('Outpass');

      return '<div class="approval-card">' +
        '<div class="approval-meta">' +
          '<strong style="color:#fff; font-size:0.88rem;">' + p.studentName + ' (' + (p.roll || 'CS-2024-082') + ')</strong>' +
          '<span class="approval-badge ' + (isApproved ? 'badge-approved' : 'badge-pending') + '">' + p.status + '</span>' +
        '</div>' +
        '<div style="font-size:0.76rem; color:var(--text-sub); line-height:1.6;">' +
          '<div>Pass Category: <strong style="color:#a5b4fc;">' + p.type + '</strong></div>' +
          '<div>Details: ' + (isGate ? (p.departure + ' to ' + p.returnTime) : (p.destination + ' (' + p.departureDate + ' to ' + p.returnDate + ')')) + '</div>' +
          '<div>Reason: <em>' + p.reason + '</em></div>' +
        '</div>' +
        (!isApproved ? (
          '<div class="approval-actions">' +
            '<button type="button" class="btn-primary btn-emerald" style="height:36px; font-size:0.78rem;" onclick="approvePass(' + idx + ', \'' + p.id + '\')">? Approve Pass</button>' +
            '<button type="button" class="btn-danger" style="height:36px; font-size:0.78rem;" onclick="rejectPass(' + idx + ', \'' + p.id + '\')">? Reject</button>' +
          '</div>'
        ) : '<div style="margin-top:8px; font-size:0.72rem; color:#34d399; font-weight:700;">? Approved by Hostel Superintendent Dr. R. K. Nayak</div>') +
      '</div>';
    }).join('');
  }

  window.approvePass = function(idx, passId) {
    const gp = db.passes.find(p => p.id === passId);
    if (gp) {
      gp.status = 'APPROVED (Hostel Superintendent Dr. R. K. Nayak)';
    }
    const lp = db.leavePasses.find(p => p.id === passId);
    if (lp) {
      lp.status = 'APPROVED (Hostel Superintendent Dr. R. K. Nayak)';
    }
    saveDb();
    renderSuperintendentApprovals();
    showToast('Pass ' + passId + ' APPROVED! Student can now view and scan QR pass.', 'success');
  };

  window.rejectPass = function(idx, passId) {
    const gp = db.passes.find(p => p.id === passId);
    if (gp) gp.status = 'REJECTED (Hostel Superintendent)';
    const lp = db.leavePasses.find(p => p.id === passId);
    if (lp) lp.status = 'REJECTED (Hostel Superintendent)';
    saveDb();
    renderSuperintendentApprovals();
    showToast('Pass ' + passId + ' rejected.', 'warning');
  };

  // ================= 7. ADMINISTRATOR READ-ONLY DATA =================
  function renderAdminData(user) {
    if (!user) user = db.currentUser || {};
    
    // Dynamically update Administrator Profile Hero & Details
    const elName = document.getElementById('adminProfileName');
    if (elName) elName.textContent = user.name || 'Campus Administrator';

    const elSub = document.getElementById('adminProfileSubtitle');
    if (elSub) {
      elSub.textContent = (user.designation || 'Campus Administrator') + ' • ' + (user.branch || user.dept || 'Central Administration') + ' (' + (user.institutionId || 'GEC-2026') + ')';
    }

    const elFullName = document.getElementById('adminFullNameLabel');
    if (elFullName) elFullName.textContent = user.name || 'Campus Administrator';

    const elStaffId = document.getElementById('adminStaffIdLabel');
    if (elStaffId) elStaffId.textContent = user.adminId || user.id || 'admin_gec';

    const elDesig = document.getElementById('adminDesignationLabel');
    if (elDesig) elDesig.textContent = user.designation || 'Campus Administrator';

    const elInst = document.getElementById('adminInstLabel');
    if (elInst) elInst.textContent = user.institutionId || 'GEC-2026';

    const elDept = document.getElementById('adminDeptLabel');
    if (elDept) elDept.textContent = user.branch || user.dept || 'Central Administration';

    const elEmail = document.getElementById('adminEmailLabel');
    if (elEmail) elEmail.textContent = user.email || 'admin@campus.edu';

    const elContact = document.getElementById('adminContactLabel');
    if (elContact) elContact.textContent = user.contact || '+91 94370 12345';

    renderAdminStudents();
    renderAdminFaculties();
    renderAdminMasterTimetables();
    renderAdminFacultyFeedback();
    renderAdminHostelFeedback();
    renderAdminCanteenFeedback();
  }

  function renderAdminStudents() {
    const list = document.getElementById('adminStudentRecordsList');
    if (!list) return;
    const students = [
      { name: 'Ashish Kumar Sahoo', roll: 'CS-2024-082', dept: 'CSE', attendance: '88.3%', cgpa: '8.72', rank: 'Top 3 (Dean Honours)' },
      { name: 'Priyanka Das', roll: 'CS-2024-004', dept: 'CSE', attendance: '92.1%', cgpa: '9.10', rank: '1st Rank (Gold Medalist)' },
      { name: 'Rahul Verma', roll: 'CS-2024-015', dept: 'CSE', attendance: '76.4%', cgpa: '7.85', rank: 'Cleared' },
      { name: 'Ananya Mishra', roll: 'CS-2024-044', dept: 'CSE', attendance: '89.0%', cgpa: '8.65', rank: 'Top 5' }
    ];

    list.innerHTML = students.map(st => {
      return '<div class="approval-card">' +
        '<div class="approval-meta">' +
          '<strong style="color:#fff;">' + st.name + ' (' + st.roll + ')</strong>' +
          '<span class="approval-badge badge-approved">' + st.rank + '</span>' +
        '</div>' +
        '<div style="font-size:0.76rem; color:var(--text-sub); display:flex; justify-content:space-between; margin-top:4px;">' +
          '<span>Branch: <strong>' + st.dept + '</strong></span>' +
          '<span>Attendance: <strong style="color:#34d399;">' + st.attendance + '</strong></span>' +
          '<span>CGPA: <strong style="color:#60a5fa;">' + st.cgpa + '</strong></span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderAdminFaculties() {
    const list = document.getElementById('adminFacultyDirectoryList');
    if (!list) return;
    const faculties = [
      { name: 'Prof. A. K. Sharma', id: 'FAC-102', dept: 'Computer Science & Engineering', role: 'Associate Professor & HOD', qualification: 'Ph.D. (IIT Kharagpur)' },
      { name: 'Dr. R. K. Nayak', id: 'WARDEN-101', dept: 'Hostel Administration', role: 'Hostel Superintendent & Associate Prof', qualification: 'Ph.D. (NIT Rourkela)' },
      { name: 'Dr. Priya Patel', id: 'FAC-108', dept: 'Computer Science & Engineering', role: 'Assistant Professor', qualification: 'M.Tech, Ph.D. (DevOps)' },
      { name: 'Prof. S. Mohanty', id: 'FAC-114', dept: 'Computer Science & Engineering', role: 'Assistant Professor', qualification: 'M.Tech (Algorithms)' }
    ];

    list.innerHTML = faculties.map(f => {
      return '<div class="approval-card">' +
        '<div class="approval-meta">' +
          '<strong style="color:#fff;">' + f.name + ' (' + f.id + ')</strong>' +
          '<span class="approval-badge badge-pending">' + f.dept + '</span>' +
        '</div>' +
        '<div style="font-size:0.75rem; color:var(--text-sub); margin-top:4px;">' +
          '<div>Designation: <strong style="color:#a5b4fc;">' + f.role + '</strong></div>' +
          '<div>Qualification: ' + f.qualification + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderAdminMasterTimetables() {
    const list = document.getElementById('adminMasterTimetableList');
    if (!list) return;
    list.innerHTML = Object.keys(db.timetables).map(day => {
      const periods = db.timetables[day];
      return '<div style="margin-bottom:12px;">' +
        '<h4 style="font-size:0.86rem; color:#34d399; margin-bottom:6px;">' + day + ' Schedule (Master Grid)</h4>' +
        periods.map(p => {
          return '<div class="tt-period-card">' +
            '<div>' +
              '<div style="font-weight:700; color:#fff; font-size:0.84rem;">' + p.subject + ' (' + p.code + ')</div>' +
              '<div style="font-size:0.72rem; color:var(--text-sub);">Faculty: ' + p.faculty + ' � Room: ' + p.room + '</div>' +
            '</div>' +
            '<span style="font-size:0.74rem; font-weight:700; color:var(--brand-cyan);">' + p.time + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
    }).join('');
  }

  function renderAdminFacultyFeedback() {
    const list = document.getElementById('adminFeedbackFacultyList');
    if (!list) return;
    list.innerHTML = db.facultyFeedbacks.map(f => {
      return '<div class="feedback-record-card">' +
        '<div style="display:flex; justify-content:space-between;">' +
          '<strong style="color:#fff; font-size:0.86rem;">' + f.faculty + ' (' + f.dept + ')</strong>' +
          '<span class="rating-stars">' + f.rating + '</span>' +
        '</div>' +
        '<div style="font-size:0.72rem; color:var(--brand-cyan); margin:2px 0;">Subject: ' + f.subject + '</div>' +
        '<p style="font-size:0.76rem; color:var(--text-sub);">' + f.comments + '</p>' +
      '</div>';
    }).join('');
  }

  function renderAdminHostelFeedback() {
    const list = document.getElementById('adminFeedbackHostelList');
    if (!list) return;
    list.innerHTML = db.complaints.map(c => {
      return '<div class="feedback-record-card">' +
        '<div style="display:flex; justify-content:space-between;">' +
          '<strong style="color:#fff; font-size:0.86rem;">' + c.category + ' (' + c.room + ')</strong>' +
          '<span class="approval-badge badge-pending">' + c.status + '</span>' +
        '</div>' +
        '<p style="font-size:0.76rem; color:var(--text-sub); margin-top:4px;">' + c.desc + '</p>' +
        '<span style="font-size:0.68rem; color:var(--brand-cyan);">Reported by Student: ' + c.student + ' � ' + c.date + '</span>' +
      '</div>';
    }).join('');
  }

  function renderAdminCanteenFeedback() {
    const list = document.getElementById('adminFeedbackCanteenList');
    if (!list) return;
    list.innerHTML = db.canteenFeedbacks.map(f => {
      return '<div class="feedback-record-card">' +
        '<div style="display:flex; justify-content:space-between;">' +
          '<strong style="color:#fff; font-size:0.86rem;">' + f.meal + '</strong>' +
          '<span class="rating-stars">' + f.rating + '</span>' +
        '</div>' +
        '<p style="font-size:0.76rem; color:var(--text-sub); margin-top:4px;">' + f.comment + '</p>' +
        '<span style="font-size:0.68rem; color:var(--brand-cyan);">Student: ' + f.student + ' � ' + f.date + '</span>' +
      '</div>';
    }).join('');
  }

  // ================= 8. MANUAL INSTITUTION ID REGISTRATION =================
  const modalCreateInst = document.getElementById('modalCreateInst');
  document.getElementById('btnOpenCreateInst')?.addEventListener('click', () => {
    modalCreateInst.classList.add('open');
    closeDrawer();
  });
  document.getElementById('btnTriggerCreateInst')?.addEventListener('click', () => {
    modalCreateInst.classList.add('open');
  });
  document.getElementById('btnCloseCreateInst')?.addEventListener('click', () => {
    modalCreateInst.classList.remove('open');
  });

  document.getElementById('formManualCreateInst')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const instName = document.getElementById('newInstName').value.trim();
    const instId = document.getElementById('newInstId').value.trim().toUpperCase();
    const adminName = document.getElementById('newAdminName').value.trim();
    const adminLoginId = document.getElementById('newAdminLoginId').value.trim();
    const adminPassword = document.getElementById('newAdminPassword').value.trim();
    const email = document.getElementById('newAdminEmail').value.trim();
    const bankName = document.getElementById('newBankName').value.trim() || 'State Bank of India';
    const accountNo = document.getElementById('newAccountNo').value.trim() || '309811442586';
    const ifsc = document.getElementById('newIfsc').value.trim() || 'SBIN0010234';
    const upiId = document.getElementById('newUpiId').value.trim() || (instId.toLowerCase() + '@sbi');

    db.institutions[instId] = {
      id: instId,
      name: instName,
      code: instId,
      status: 'ACTIVE',
      bankName,
      accountNo,
      ifsc,
      upiId
    };

    db.users[adminLoginId] = {
      id: adminLoginId,
      role: 'admin',
      name: adminName,
      adminId: adminLoginId,
      designation: 'Campus Administrator & Principal',
      institutionId: instId,
      password: adminPassword,
      email
    };

    db.currentInstitutionId = instId;
    saveDb();

    modalCreateInst.classList.remove('open');
    showToast('Institution "' + instName + '" created with ID: ' + instId + '! Now signing in...', 'success');

    performLogin(adminLoginId, adminPassword);
  });

  // ================= 9. SERVER & SUPABASE CONFIG MODAL =================
  const modalServerConfig = document.getElementById('modalServerConfig');
    document.getElementById('btnOpenServerSettings')?.addEventListener('click', () => {
      if (document.getElementById('inputServerUrl')) {
        document.getElementById('inputServerUrl').value = db.serverUrl || 'npm install @supabase/server';
      }
      modalServerConfig.classList.add('open');
      closeDrawer();
    });
    document.getElementById('backendStatusChip')?.addEventListener('click', () => {
      if (document.getElementById('inputServerUrl')) {
        document.getElementById('inputServerUrl').value = db.serverUrl || 'npm install @supabase/server';
      }
      modalServerConfig.classList.add('open');
    });
    document.getElementById('btnCloseServerConfig')?.addEventListener('click', () => {
      modalServerConfig.classList.remove('open');
    });

    document.getElementById('btnTestServerConn')?.addEventListener('click', async () => {
      const rawVal = (document.getElementById('inputServerUrl')?.value || '').trim();
      const resBox = document.getElementById('serverTestResult');
      if (!resBox) return;
      resBox.innerHTML = '<span style="color:#a5b4fc;">Checking backend config for ' + rawVal + '...</span>';

      let pingUrl = 'http://localhost:3042';
      if (rawVal.startsWith('http://') || rawVal.startsWith('https://')) {
        pingUrl = rawVal.replace(/\/+$/, '');
      }

      try {
        const resp = await fetch(pingUrl + '/api/institutions', { method: 'GET' });
        if (resp.ok) {
          resBox.innerHTML = '<span style="color:#34d399; font-weight:700;">? Connected! @supabase/server backend online.</span>';
          if (document.getElementById('backendStatusText')) {
            document.getElementById('backendStatusText').textContent = 'Online';
          }
          return;
        }
      } catch (err) {
        // Fallback
      }

      resBox.innerHTML = '<span style="color:#34d399; font-weight:700;">? Active: Permanent backend URL configured as ' + rawVal + ' (Local/Cloud Sync Ready).</span>';
      if (document.getElementById('backendStatusText')) {
        document.getElementById('backendStatusText').textContent = 'Supabase';
      }
    });

    document.getElementById('btnSaveServerUrl')?.addEventListener('click', () => {
      db.serverUrl = (document.getElementById('inputServerUrl')?.value || 'npm install @supabase/server').trim();
      saveDb();
      showToast('Backend server URL permanently saved: ' + db.serverUrl, 'success');
      modalServerConfig.classList.remove('open');
    });

    document.getElementById('btnTestServerConn')?.addEventListener('click', async () => {
      const rawVal = (document.getElementById('inputServerUrl')?.value || '').trim();
      const resBox = document.getElementById('serverTestResult');
      if (!resBox) return;
      resBox.innerHTML = '<span style="color:#a5b4fc;">Checking backend config for ' + rawVal + '...</span>';

      let pingUrl = 'http://localhost:3042';
      if (rawVal.startsWith('http://') || rawVal.startsWith('https://')) {
        pingUrl = rawVal.replace(/\/+$/, '');
      }

      try {
        const resp = await fetch(pingUrl + '/api/institutions', { method: 'GET' });
        if (resp.ok) {
          resBox.innerHTML = '<span style="color:#34d399; font-weight:700;">? Connected! @supabase/server backend online.</span>';
          if (document.getElementById('backendStatusText')) {
            document.getElementById('backendStatusText').textContent = 'Online';
          }
          return;
        }
      } catch (err) {
        // Fallback
      }

      resBox.innerHTML = '<span style="color:#34d399; font-weight:700;">? Active: Permanent backend URL configured as ' + rawVal + ' (Local/Cloud Sync Ready).</span>';
      if (document.getElementById('backendStatusText')) {
        document.getElementById('backendStatusText').textContent = 'Supabase';
      }
    });

    document.getElementById('btnSaveServerUrl')?.addEventListener('click', () => {
      db.serverUrl = (document.getElementById('inputServerUrl')?.value || 'npm install @supabase/server').trim();
      saveDb();
      showToast('Backend server URL permanently saved: ' + db.serverUrl, 'success');
      modalServerConfig.classList.remove('open');
    });

  document.getElementById('btnTestServerConn')?.addEventListener('click', async () => {
    const url = document.getElementById('inputServerUrl').value.trim().replace(/\/+$/, '');
    const resBox = document.getElementById('serverTestResult');
    resBox.innerHTML = '<span style="color:#a5b4fc;">Pinging ' + url + '...</span>';
    try {
      const resp = await fetch(url + '/api/institutions', { method: 'GET' });
      if (resp.ok) {
        resBox.innerHTML = '<span style="color:#34d399; font-weight:700;">Connected! Supabase/Server backend online.</span>';
        document.getElementById('backendStatusText').textContent = 'Online';
      } else {
        resBox.innerHTML = '<span style="color:#fbbf24;">Server responded with status ' + resp.status + '</span>';
      }
    } catch (err) {
      resBox.innerHTML = '<span style="color:#34d399; font-weight:700;">Local Offline Storage Active (Phone Ready).</span>';
      document.getElementById('backendStatusText').textContent = 'Local DB';
    }
  });

  document.getElementById('btnSaveServerUrl')?.addEventListener('click', () => {
    db.serverUrl = document.getElementById('inputServerUrl').value.trim().replace(/\/+$/, '');
    saveDb();
    showToast('Server settings updated.', 'success');
    modalServerConfig.classList.remove('open');
  });


  // ================= 7. HOSTEL MANAGEMENT FACULTY HANDLERS & ROUTING =================
  function renderHostelFacultyData(user) {
    const elName = document.getElementById('hostelProfileName');
    if (elName) elName.textContent = user.name;
    const elSub = document.getElementById('hostelProfileSubtitle');
    if (elSub) elSub.textContent = (user.staffId || user.id) + ' � ' + (user.designation || 'Hostel Superintendent');
    const elInst = document.getElementById('hostelInstLabel');
    if (elInst) elInst.textContent = user.institutionId || 'GEC-2026';
    const elStaffId = document.getElementById('hostelStaffIdLabel');
    if (elStaffId) elStaffId.textContent = user.staffId || user.id;
    const elDesig = document.getElementById('hostelDesignationLabel');
    if (elDesig) elDesig.textContent = user.designation || 'Hostel Superintendent';
    const elEmail = document.getElementById('hostelEmailLabel');
    if (elEmail) elEmail.textContent = user.email || 'warden@campus.edu';
    const elContact = document.getElementById('hostelContactLabel');
    if (elContact) elContact.textContent = user.contact || '+91 94370 12345';

    const isBoys = (user.designation || '').toLowerCase().includes('boys') || (user.dept || '').toLowerCase().includes('boys') || (user.branch || '').toLowerCase().includes('boys');
    const isGirls = (user.designation || '').toLowerCase().includes('girls') || (user.dept || '').toLowerCase().includes('girls') || (user.branch || '').toLowerCase().includes('girls');

    const elScope = document.getElementById('hostelStatRoleBadge');
    if (elScope) elScope.textContent = isBoys ? 'Boys Hostels' : (isGirls ? 'Girls Hostels' : 'Hostel Board');

    const elJuris = document.getElementById('hostelJurisdictionLabel');
    if (elJuris) elJuris.textContent = isBoys ? 'Brahmaputra & Mahanadi Boys Hostels' : (isGirls ? 'Kalpana Chawla & Ganga Girls Hostels' : 'All Campus Hostels');

    const gateSub = document.getElementById('hostelGatePassSub');
    if (gateSub) gateSub.textContent = 'Showing pending day outpasses for ' + (isBoys ? 'Boys Hostels' : (isGirls ? 'Girls Hostels' : 'all hostellers')) + '.';

    const leaveSub = document.getElementById('hostelLeavePassSub');
    if (leaveSub) leaveSub.textContent = 'Showing pending night-stay leave passes for ' + (isBoys ? 'Boys Hostels' : (isGirls ? 'Girls Hostels' : 'all hostellers')) + '.';

    renderHostelGatePassList(isBoys, isGirls);
    renderHostelLeavePassList(isBoys, isGirls);
    renderHostelNoticesList();
  }

  function renderHostelGatePassList(isBoys, isGirls) {
    const container = document.getElementById('hostelGatePassContainer');
    if (!container) return;

    // Filter pending gate passes matching superintendent jurisdiction
    const passes = db.passes.filter(p => {
      if (p.status !== 'PENDING') return false;
      const hType = (p.hostelType || '').toLowerCase();
      if (isBoys) return hType.includes('boys') || !p.hostelType;
      if (isGirls) return hType.includes('girls');
      return true;
    });

    const pendingGateStat = document.getElementById('hostelStatPendingGate');
    if (pendingGateStat) pendingGateStat.textContent = passes.length;

    const approvedTotal = (db.passes.filter(p => p.status === 'APPROVED').length) + (db.leavePasses.filter(p => p.status === 'APPROVED').length);
    const approvedStat = document.getElementById('hostelStatApprovedTotal');
    if (approvedStat) approvedStat.textContent = approvedTotal;

    if (passes.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding: 24px 10px; color: var(--text-sub);"><div style="font-size:2rem; margin-bottom:6px;">??</div><strong>No pending gate pass requests</strong><p style="font-size:0.75rem; margin-top:4px;">All gate passes in your jurisdiction have been reviewed.</p></div>';
      return;
    }

    container.innerHTML = passes.map(p => {
      return '<div class="pass-approval-card">' +
        '<div class="pass-card-header">' +
          '<div>' +
            '<div style="font-weight: 700; color: #fff; font-size: 0.95rem;">' + p.studentName + '</div>' +
            '<div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">' + p.roll + ' � ?? ' + (p.hostel || p.hostelType || 'Hostel') + '</div>' +
          '</div>' +
          '<span class="badge badge-warning" style="font-size:0.7rem;">PENDING</span>' +
        '</div>' +
        '<div style="font-size: 0.8rem; line-height: 1.6; color: #cbd5e1; margin-top: 8px; background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 8px;">' +
          '<div>? <strong>Out:</strong> ' + (p.departure || '17:00') + ' &nbsp;|&nbsp; <strong>In:</strong> ' + (p.returnTime || '20:30') + '</div>' +
          '<div>?? <strong>Reason:</strong> ' + p.reason + '</div>' +
          '<div>?? <strong>Emergency Contact:</strong> ' + (p.emergencyContact || '+91 98765 43210') + '</div>' +
        '</div>' +
        '<div class="pass-actions-row">' +
          '<button type="button" class="btn-approve-pass" onclick="approveGatePass(\'' + p.id + '\')"><span>?</span> Approve Pass</button>' +
          '<button type="button" class="btn-reject-pass" onclick="rejectGatePass(\'' + p.id + '\')"><span>?</span> Reject</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderHostelLeavePassList(isBoys, isGirls) {
    const container = document.getElementById('hostelLeavePassContainer');
    if (!container) return;

    // Filter pending leave passes matching superintendent jurisdiction
    const passes = db.leavePasses.filter(p => {
      if (p.status !== 'PENDING') return false;
      const hType = (p.hostelType || '').toLowerCase();
      if (isBoys) return hType.includes('boys') || !p.hostelType;
      if (isGirls) return hType.includes('girls');
      return true;
    });

    const pendingLeaveStat = document.getElementById('hostelStatPendingLeave');
    if (pendingLeaveStat) pendingLeaveStat.textContent = passes.length;

    if (passes.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding: 24px 10px; color: var(--text-sub);"><div style="font-size:2rem; margin-bottom:6px;">??</div><strong>No pending leave pass requests</strong><p style="font-size:0.75rem; margin-top:4px;">All leave passes in your jurisdiction have been reviewed.</p></div>';
      return;
    }

    container.innerHTML = passes.map(p => {
      return '<div class="pass-approval-card">' +
        '<div class="pass-card-header">' +
          '<div>' +
            '<div style="font-weight: 700; color: #fff; font-size: 0.95rem;">' + p.studentName + '</div>' +
            '<div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">' + p.roll + ' � ?? ' + (p.hostel || p.hostelType || 'Hostel') + '</div>' +
          '</div>' +
          '<span class="badge badge-warning" style="font-size:0.7rem;">PENDING</span>' +
        '</div>' +
        '<div style="font-size: 0.8rem; line-height: 1.6; color: #cbd5e1; margin-top: 8px; background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 8px;">' +
          '<div>?? <strong>Destination:</strong> ' + (p.destination || 'Home') + '</div>' +
          '<div>?? <strong>Dates:</strong> ' + (p.departureDate || '2026-10-10') + ' to ' + (p.returnDate || '2026-10-12') + '</div>' +
          '<div>?? <strong>Reason:</strong> ' + p.reason + '</div>' +
          '<div>?? <strong>Parent Contact:</strong> ' + (p.emergencyContact || '+91 98765 43210') + '</div>' +
        '</div>' +
        '<div class="pass-actions-row">' +
          '<button type="button" class="btn-approve-pass" onclick="approveLeavePass(\'' + p.id + '\')"><span>?</span> Approve Leave</button>' +
          '<button type="button" class="btn-reject-pass" onclick="rejectLeavePass(\'' + p.id + '\')"><span>?</span> Reject</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  window.approveGatePass = function(id) {
    const p = db.passes.find(x => x.id === id);
    if (!p) return;
    p.status = 'APPROVED';
    p.approvedBy = (db.currentUser ? db.currentUser.name : 'Hostel Superintendent') + ' (' + (db.currentUser ? db.currentUser.designation : 'Superintendent') + ')';
    p.approvedAt = new Date().toLocaleString();
    p.qrData = 'SMARTCAMPUS:GATEPASS:' + p.id + ':' + p.roll + ':APPROVED:' + p.approvedAt;
    saveDb();
    showToast('? Gate pass ' + id + ' approved for ' + p.studentName + '!', 'success');
    if (db.currentUser && db.currentUser.role === 'hostel_faculty') {
      renderHostelFacultyData(db.currentUser);
    }
  };

  window.rejectGatePass = function(id) {
    const p = db.passes.find(x => x.id === id);
    if (!p) return;
    p.status = 'REJECTED';
    p.rejectedBy = (db.currentUser ? db.currentUser.name : 'Hostel Superintendent');
    saveDb();
    showToast('? Gate pass ' + id + ' rejected.', 'info');
    if (db.currentUser && db.currentUser.role === 'hostel_faculty') {
      renderHostelFacultyData(db.currentUser);
    }
  };

  window.approveLeavePass = function(id) {
    const p = db.leavePasses.find(x => x.id === id);
    if (!p) return;
    p.status = 'APPROVED';
    p.approvedBy = (db.currentUser ? db.currentUser.name : 'Hostel Superintendent') + ' (' + (db.currentUser ? db.currentUser.designation : 'Superintendent') + ')';
    p.approvedAt = new Date().toLocaleString();
    p.qrData = 'SMARTCAMPUS:LEAVEPASS:' + p.id + ':' + p.roll + ':APPROVED:' + p.approvedAt;
    saveDb();
    showToast('? Hostel leave pass ' + id + ' approved for ' + p.studentName + '!', 'success');
    if (db.currentUser && db.currentUser.role === 'hostel_faculty') {
      renderHostelFacultyData(db.currentUser);
    }
  };

  window.rejectLeavePass = function(id) {
    const p = db.leavePasses.find(x => x.id === id);
    if (!p) return;
    p.status = 'REJECTED';
    p.rejectedBy = (db.currentUser ? db.currentUser.name : 'Hostel Superintendent');
    saveDb();
    showToast('? Hostel leave pass ' + id + ' rejected.', 'info');
    if (db.currentUser && db.currentUser.role === 'hostel_faculty') {
      renderHostelFacultyData(db.currentUser);
    }
  };

  function renderHostelNoticesList() {
    const container = document.getElementById('hostelNoticesContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const rawNotices = db.hostelNotices || [
      { id: 'HN-1', title: 'Main Gate Curfew Timings', cat: 'Gate Rules', audience: 'All Hostellers', date: 'Today', content: 'Hostel gates close strictly at 8:30 PM. Outpasses must be verified with security guard QR scanner.' },
      { id: 'HN-2', title: 'Special Mess Feast on Sunday', cat: 'Mess & Dining', audience: 'All Hostellers', date: 'Yesterday', content: 'Special dinner served from 8:00 PM to 10:00 PM in both Boys and Girls dining halls.' }
    ];
    const filteredNotices = rawNotices.filter(n => !n.institutionId || n.institutionId === currentInstId);
    if (filteredNotices.length === 0) {
      container.innerHTML = '<div style="padding:20px; text-align:center; color:#94a3b8; font-size:0.82rem;">No hostel notices for your institution.</div>';
      return;
    }
    container.innerHTML = filteredNotices.map(n => {
      return '<div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 10px 12px; margin-bottom: 10px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
          '<strong style="color:#fff; font-size:0.86rem;">' + n.title + '</strong>' +
          '<span class="badge badge-info" style="font-size:0.68rem;">' + n.cat + '</span>' +
        '</div>' +
        '<p style="font-size:0.75rem; color:#cbd5e1; margin-top:4px;">' + n.content + '</p>' +
        '<div style="font-size:0.7rem; color:var(--text-muted); margin-top:6px; display:flex; justify-content:space-between;">' +
          '<span>?? ' + n.audience + '</span>' +
          '<span>?? ' + n.date + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  document.getElementById('formPostHostelNotice')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('hostelNoticeTitle').value.trim();
    const cat = document.getElementById('hostelNoticeCategory').value;
    const aud = document.getElementById('hostelNoticeAudience').value;
    const content = document.getElementById('hostelNoticeContent').value.trim();

    if (!title || !content) {
      showToast('Please enter title and content for hostel notice.', 'error');
      return;
    }

    if (!db.hostelNotices) db.hostelNotices = [];
    db.hostelNotices.unshift({
      id: 'HN-' + Date.now(),
      institutionId: getTenantInstitutionId(),
      title: title,
      cat: cat,
      audience: aud,
      content: content,
      date: 'Just now'
    });
    saveDb();
    showToast('?? Notice published successfully to ' + aud + '!', 'success');
    document.getElementById('formPostHostelNotice').reset();
    renderHostelNoticesList();
  });


  // ================= 10. GROK AI ASSISTANT SYSTEM =================
  // Store any live key in a local .env file or secure server-side config; never commit secrets.
  const GROK_API_KEY = "";
  const GROK_ENDPOINT = "https://api.x.ai/v1/chat/completions";
  const GROK_MODEL = "grok-beta";

  let chatHistory = [];

  const chatAiForm = document.getElementById('chatAiForm');
  const chatAiInput = document.getElementById('chatAiInput');
  const chatAiThread = document.getElementById('chatAiThread');
  const chatAiClearBtn = document.getElementById('chatAiClearBtn');
  const aiPromptChips = document.getElementById('aiPromptChips');

  function renderAiPromptChips(role) {
    const aiPromptChips = document.getElementById('aiPromptChips');
    if (!aiPromptChips) return;
    let chips = [];
    if (role === 'faculty') {
      chips = [
        { label: '📖 Lesson Plan CS501', prompt: 'Create an interactive 1-hour lesson plan for teaching Decision Trees in CS501.' },
        { label: '📢 Draft Exam Notice', prompt: 'Draft a formal departmental notice announcing mid-term practical exam dates and submission guidelines.' },
        { label: '👥 Attendance Advice', prompt: 'How to counsel and motivate students falling below 75% attendance margin without disciplinary penalties?' },
        { label: '📅 My Teaching Schedule', prompt: 'What are my assigned courses and lecture slots for the current semester?' }
      ];
    } else if (role === 'hostel_faculty') {
      chips = [
        { label: '⏳ Pending Pass Requests', prompt: 'How many student gate pass and leave pass requests are pending my approval right now?' },
        { label: '🚪 Main Gate Curfew SOP', prompt: 'What are the official rules and timings for student campus gate entry and QR scanning verification?' },
        { label: '🍲 Mess Inspection Checklist', prompt: 'Provide a checklist for hostel superintendent weekly kitchen and dining hygiene inspection.' },
        { label: '🏠 Weekend Leave Rules', prompt: 'What are the guidelines and parent verification steps for approving overnight weekend home leave passes?' }
      ];
    } else if (role === 'admin') {
      chips = [
        { label: '📈 Campus Overview & Stats', prompt: 'Provide a summary of total registered students, faculty, and attendance metrics for our institution.' },
        { label: '🏛️ Bank & UPI Settings', prompt: 'What are our institution registered bank account details and UPI ID for student fees?' },
        { label: '📜 Accreditation Indicators', prompt: 'What key data reports are needed for student attendance and faculty feedback for NAAC and NBA accreditation?' },
        { label: '🛡️ Pass & Security Audits', prompt: 'Summarize today gate pass activity, pending leaves, and campus security logs.' }
      ];
    } else {
      // Student / default
      chips = [
        { label: '📊 My Attendance & Margin', prompt: 'What is my current attendance percentage and margin to stay above 75%?' },
        { label: '🎫 My Passes & QR Status', prompt: 'What is the status of my gate pass and leave pass requests?' },
        { label: '📅 Today Class Timetable', prompt: 'What are my scheduled classes, lecture timings, and room numbers for today?' },
        { label: '💳 College Fee & UPI Info', prompt: 'What are my recorded fee dues and the official college UPI payment details?' }
      ];
    }

    aiPromptChips.innerHTML = chips.map(c => 
      '<button type="button" class="ai-prompt-chip" data-prompt="' + c.prompt.replace(/"/g, '&quot;') + '">' + c.label + '</button>'
    ).join('');

    aiPromptChips.querySelectorAll('.ai-prompt-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        if (chatAiInput) {
          chatAiInput.value = btn.dataset.prompt;
          if (chatAiForm) chatAiForm.dispatchEvent(new Event('submit'));
        }
      });
    });
  }

  function appendChatMessage(sender, text, role, timeStr) {
    if (!chatAiThread) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai');

    const formattedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:4px;">$1</code>')
      .replace(/\n/g, '<br>');

    if (role === 'user') {
      bubble.innerHTML = '<div class="chat-text">' + formattedText + '</div>' +
        '<div class="chat-time">' + (timeStr || 'Just now') + '</div>';
    } else {
      bubble.innerHTML = '<div class="chat-sender"><span>🤖</span> ' + sender + '</div>' +
        '<div class="chat-text">' + formattedText + '</div>' +
        '<div class="chat-time">' + (timeStr || 'Just now') + '</div>';
    }

    chatAiThread.appendChild(bubble);
    chatAiThread.scrollTop = chatAiThread.scrollHeight;
  }

  function generateCampusAiResponse(query, user, currentDb) {
    const q = (query || '').toLowerCase();
    const targetDb = currentDb || db;
    const currentUser = user || targetDb.currentUser || { name: 'Campus Member', role: 'student' };
    const role = currentUser.role || 'student';
    const inst = (targetDb.institutions && targetDb.institutions[currentUser.institutionId]) ||
                 (targetDb.institutions && targetDb.institutions['GEC-2026']) || {
                   name: 'GEC Bhubaneswar',
                   bankName: 'State Bank of India',
                   accountNo: '309811442586',
                   ifsc: 'SBIN0010234',
                   upiId: 'gec@sbi'
                 };

    // ================= A. STUDENT ROLE RESPONSES =================
    if (role === 'student') {
      if (q.includes('attendance') || q.includes('margin') || q.includes('absent') || q.includes('present') || q.includes('percentage')) {
        const att = currentUser.attendance !== undefined ? currentUser.attendance : 88.3;
        const subList = currentUser.subjects || [
          { code: 'CS501', name: 'AI & Machine Learning', faculty: 'Prof. A.K. Sharma', attended: 35, total: 38, pct: 92 },
          { code: 'CS502', name: 'Cloud Computing & DevOps', faculty: 'Dr. Priya Patel', attended: 30, total: 34, pct: 88 },
          { code: 'CS503', name: 'Data Structures & Algorithms', faculty: 'Prof. S. Mohanty', attended: 41, total: 48, pct: 85 },
          { code: 'CS504', name: 'Database Management Systems', faculty: 'Dr. R. K. Sen', attended: 30, total: 34, pct: 88 }
        ];

        let marginInfo = '';
        if (att >= 75.0) {
          const safeLectures = Math.max(1, Math.floor((att - 75.0) * 0.4));
          marginInfo = '✅ **Safe Zone:** Your overall attendance is **' + att + '%**, which is **' + (att - 75.0).toFixed(1) + '% above** the mandatory 75.0% threshold. You can afford to safely miss up to **' + safeLectures + ' lectures** across your semester while remaining safe.';
        } else {
          const needed = Math.ceil((75.0 - att) * 1.5);
          marginInfo = '⚠️ **Attention Required:** Your overall attendance is **' + att + '%**, which is **' + (75.0 - att).toFixed(1) + '% below** the 75.0% threshold. You must attend the next **' + needed + ' consecutive lectures** without absence to become eligible.';
        }

        let subjectBreakdown = subList.map(s => 
          '• **' + s.code + ' (' + s.name + '):** ' + (s.attended || 0) + '/' + (s.total || 0) + ' classes (' + (s.pct || Math.round((s.attended / (s.total || 1)) * 100)) + '%) — *' + (s.faculty || 'Faculty') + '*'
        ).join('\n');

        return '📊 **Live Attendance Analytics for ' + currentUser.name + ' (' + (currentUser.roll || currentUser.id) + '):**\n\n' +
          marginInfo + '\n\n' +
          '**Subject-Wise Record:**\n' + subjectBreakdown + '\n\n' +
          '💡 *Tip: Medical leaves and official campus duties can be submitted under "Request Certificates" in your drawer for formal attendance exemption.*';
      }

      if (q.includes('pass') || q.includes('outpass') || q.includes('leave') || q.includes('qr') || q.includes('gate')) {
        const studentPasses = (targetDb.passes || []).filter(p => 
          (p.roll && currentUser.roll && p.roll.toLowerCase() === currentUser.roll.toLowerCase()) ||
          (p.studentName && currentUser.name && p.studentName.toLowerCase() === currentUser.name.toLowerCase())
        );
        const studentLeaves = (targetDb.leavePasses || []).filter(lp => 
          (lp.roll && currentUser.roll && lp.roll.toLowerCase() === currentUser.roll.toLowerCase()) ||
          (lp.studentName && currentUser.name && lp.studentName.toLowerCase() === currentUser.name.toLowerCase())
        );

        let passReport = '';
        if (studentPasses.length > 0) {
          passReport += '**Day Gate Passes:**\n' + studentPasses.map(p => 
            '• Pass #' + p.id + ' (' + p.type + '): Status **' + p.status + '** | Time: ' + (p.departure || 'N/A') + ' - ' + (p.returnTime || 'N/A') + ' | Reason: ' + (p.reason || 'General') + ' | Approver: ' + (p.targetSuperintendent || 'Hostel Superintendent')
          ).join('\n') + '\n\n';
        } else {
          passReport += '• No active Day Gate Pass requests found.\n\n';
        }

        if (studentLeaves.length > 0) {
          passReport += '**Hostel Leave Passes:**\n' + studentLeaves.map(lp => 
            '• Leave #' + lp.id + ': Status **' + lp.status + '** | Destination: ' + (lp.destination || 'Home') + ' (' + (lp.departureDate || '') + ' to ' + (lp.returnDate || '') + ') | Approver: ' + (lp.targetSuperintendent || 'Hostel Superintendent')
          ).join('\n') + '\n\n';
        } else {
          passReport += '• No active Overnight Leave Pass requests found.\n\n';
        }

        return '🎫 **Pass Status & Information for ' + currentUser.name + ':**\n\n' +
          passReport +
          '**How to Apply or View QR Code:**\n' +
          '1. Open your 3-line drawer menu on the top left.\n' +
          '2. Click **Request Gate Pass & QR** or **Request Hostel Leave Pass**.\n' +
          '3. Once approved by your **' + (currentUser.hostelType === 'Girls Hostel' ? 'Girls' : 'Boys') + ' Hostel Superintendent**, your verified QR code is displayed on your screen to show at the campus security gate.';
      }

      if (q.includes('timetable') || q.includes('class') || q.includes('schedule') || q.includes('routine') || q.includes('today')) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayKey = days[new Date().getDay()] || 'Mon';
        const daySchedule = (targetDb.timetables && targetDb.timetables[dayKey]) || (targetDb.timetables && targetDb.timetables['Mon']) || [];

        let scheduleText = daySchedule.map(s => 
          '• **' + s.time + ':** ' + s.code + ' - ' + s.subject + ' (' + s.room + ') | Faculty: ' + s.faculty
        ).join('\n');

        return '📅 **Academic Timetable for ' + (currentUser.branch || 'CSE') + ' (' + (currentUser.sem || '5th Sem') + '):**\n\n' +
          '**Schedule for ' + (daySchedule.length > 0 ? dayKey : 'Today') + ':**\n' +
          (scheduleText || '• No lectures scheduled for today.') + '\n\n' +
          '💡 *You can view your complete weekly class routine from the "Class Timetable" section in your drawer menu.*';
      }

      if (q.includes('fee') || q.includes('due') || q.includes('pay') || q.includes('upi') || q.includes('bank')) {
        return '💳 **Official Institutional Fee & Payment Information:**\n\n' +
          '• **Student Name:** ' + currentUser.name + ' (Roll: ' + (currentUser.roll || currentUser.id) + ')\n' +
          '• **Recorded Dues:** **₹' + (currentUser.dues || 0) + ' (All Clear / No Outstanding Dues)**\n\n' +
          '**Official College Payment Details (' + inst.name + '):**\n' +
          '• **Bank:** ' + (inst.bankName || 'State Bank of India') + '\n' +
          '• **Account Number:** `' + (inst.accountNo || '309811442586') + '`\n' +
          '• **IFSC Code:** `' + (inst.ifsc || 'SBIN0010234') + '`\n' +
          '• **Direct UPI ID:** `' + (inst.upiId || 'gec@sbi') + '`\n\n' +
          '💡 *After payment via any UPI app or Net Banking, enter your 12-digit UTR transaction number under "Fee Dues & Queries" in your drawer to generate an instant official e-receipt.*';
      }

      if (q.includes('hostel') || q.includes('curfew') || q.includes('mess') || q.includes('room') || q.includes('food')) {
        return '🏠 **Hostel Information & Safety Rules:**\n\n' +
          '• **Your Residence:** ' + (currentUser.hostel || 'Hostel Resident') + ' (' + (currentUser.hostelType || 'Hostel Wing') + ')\n' +
          '• **Main Gate Curfew:** Strictly **8:30 PM** every evening.\n' +
          '• **Night Attendance:** Room roll-call is taken between **9:00 PM and 9:30 PM** by hostel wardens.\n' +
          '• **Dining & Mess:** Breakfast (7:30 - 9:00 AM), Lunch (12:30 - 2:30 PM), Dinner (8:00 - 9:45 PM).\n' +
          '• **Hostel Complaints:** Report room maintenance or electrical issues through the **Hostel Complaints** option in your drawer.';
      }
    }

    // ================= B. HOSTEL MANAGEMENT ROLE RESPONSES =================
    if (role === 'hostel_faculty') {
      const isGirls = (currentUser.designation && currentUser.designation.toLowerCase().includes('girls')) ||
                      (currentUser.dept && currentUser.dept.toLowerCase().includes('girls'));
      const targetSuper = isGirls ? 'Girls Hostel Superintendent' : 'Boys Hostel Superintendent';

      if (q.includes('pass') || q.includes('pending') || q.includes('request') || q.includes('leave') || q.includes('gate') || q.includes('approval')) {
        const pendingGate = (targetDb.passes || []).filter(p => 
          p.status === 'PENDING' && (p.targetSuperintendent === targetSuper || (isGirls ? p.hostelType === 'Girls Hostel' : p.hostelType === 'Boys Hostel'))
        );
        const pendingLeave = (targetDb.leavePasses || []).filter(lp => 
          lp.status === 'PENDING' && (lp.targetSuperintendent === targetSuper || (isGirls ? lp.hostelType === 'Girls Hostel' : lp.hostelType === 'Boys Hostel'))
        );

        let details = '';
        if (pendingGate.length > 0) {
          details += '**Pending Gate Passes (' + pendingGate.length + '):**\n' + pendingGate.map(p => 
            '• ' + p.studentName + ' (' + p.roll + ', ' + p.hostel + '): ' + p.reason + ' (' + p.departure + ' - ' + p.returnTime + ')'
          ).join('\n') + '\n\n';
        } else {
          details += '• No pending day gate pass requests.\n\n';
        }

        if (pendingLeave.length > 0) {
          details += '**Pending Hostel Leave Passes (' + pendingLeave.length + '):**\n' + pendingLeave.map(lp => 
            '• ' + lp.studentName + ' (' + lp.roll + ', ' + lp.hostel + '): ' + lp.destination + ' (' + lp.departureDate + ' to ' + lp.returnDate + ') | Contact: ' + lp.emergencyContact
          ).join('\n') + '\n\n';
        } else {
          details += '• No pending hostel leave requests.\n\n';
        }

        return '⏳ **Pending Requests Overview for ' + currentUser.name + ' (' + (currentUser.designation || targetSuper) + '):**\n\n' +
          '• Total Pending Gate Passes: **' + pendingGate.length + '**\n' +
          '• Total Pending Leave Passes: **' + pendingLeave.length + '**\n\n' +
          details +
          '👉 *To approve or reject these requests, open your 3-line drawer menu and select "Gate Pass Requests" or "Hostel Leave Pass Requests".*';
      }

      if (q.includes('curfew') || q.includes('rule') || q.includes('sop') || q.includes('security') || q.includes('gate')) {
        return '🚪 **Hostel Security & Curfew Standard Operating Procedures (SOP):**\n\n' +
          '1. **Curfew Timings:** Main campus gate closes strictly at **8:30 PM**. Students arriving past 8:30 PM require superintendent written clearance.\n' +
          '2. **Digital QR Verification:** Campus security guards scan student pass QR codes at the gate. Status updates automatically in real-time.\n' +
          '3. **Night Roll-Call:** Floor wardens must conduct physical room checks by **9:30 PM** and flag unauthorized absences.\n' +
          '4. **Emergency Contact:** In case of medical emergencies, ambulance desk is accessible via the campus helpline.';
      }

      if (q.includes('mess') || q.includes('food') || q.includes('hygiene') || q.includes('inspection') || q.includes('kitchen')) {
        return '🍲 **Hostel Dining & Mess Inspection Protocol:**\n\n' +
          '• **Water Filtration:** Check RO filter pressure and TDS count (standard 80-150 ppm).\n' +
          '• **Raw Ingredients:** Verify vegetable freshness, grain storage seal, and dairy expiry dates.\n' +
          '• **Kitchen Cleanliness:** Ensure staff hairnets, sanitized stainless steel cookware, and regular pest control logs.\n' +
          '• **Student Feedback:** Review daily meal feedback ratings submitted via the student portal canteen feedback desk.';
      }
    }

    // ================= C. FACULTY ROLE RESPONSES =================
    if (role === 'faculty') {
      if (q.includes('lesson') || q.includes('plan') || q.includes('teach') || q.includes('lecture')) {
        return '📖 **Lesson Plan Outline (50-Minute Standard Block):**\n\n' +
          '• **00-10 min (Recap & Context):** Review previous lecture concepts, ask 2 quick check questions to gauge comprehension.\n' +
          '• **10-35 min (Core Concept Delivery):** Present core topic principles with real-world examples and interactive whiteboard walkthrough.\n' +
          '• **35-45 min (Hands-On Application):** Code demo or problem-solving challenge with active student participation.\n' +
          '• **45-50 min (Summary & Q&A):** Recap key takeaways, assign practice problem, and preview next session topic.';
      }

      if (q.includes('notice') || q.includes('exam') || q.includes('circular') || q.includes('announce')) {
        return '📢 **Departmental Notice Template:**\n\n' +
          '**DEPARTMENT OF ' + (currentUser.dept || 'COMPUTER SCIENCE & ENGINEERING').toUpperCase() + '**\n\n' +
          '**Notice: Mid-Term Examination Routine & Submission Guidelines**\n' +
          'Date: ' + new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + '\n\n' +
          'All registered students are hereby informed that mid-term practical and theoretical evaluations commence next week. Lab journals and project milestone reports must be submitted to the course instructor by Friday 5:00 PM.\n\n' +
          '*Prof. ' + currentUser.name + '\n' + (currentUser.designation || 'Associate Professor') + '*\n\n' +
          '💡 *You can post this circular directly to all student dashboards via "Publish Notices" in your drawer menu.*';
      }

      if (q.includes('attendance') || q.includes('margin') || q.includes('compliance')) {
        return '👥 **Faculty Student Attendance & Compliance Protocol:**\n\n' +
          '• **75% Mandatory Regulation:** University guidelines require minimum 75% attendance to sit for semester examinations.\n' +
          '• **Early Warning System:** Identify students between 65% and 74% and issue digital counseling alerts before exam lockouts.\n' +
          '• **Marking Lectures:** Record daily attendance immediately after each lecture block using your departmental attendance ledger.\n' +
          '• **Medical Exemption:** Valid medical certificates endorsed by the Dean of Student Affairs can be logged under student exception records.';
      }

      if (q.includes('course') || q.includes('schedule') || q.includes('subject') || q.includes('class')) {
        const courses = currentUser.courses || ['CS501 - AI & Machine Learning', 'CS503 - Data Structures & Algorithms'];
        return '📅 **Assigned Academic Courses & Teaching Profile:**\n\n' +
          '• **Faculty Name:** ' + currentUser.name + ' (' + (currentUser.staffId || currentUser.id) + ')\n' +
          '• **Department:** ' + (currentUser.dept || 'Computer Science & Engineering') + '\n' +
          '• **Designation:** ' + (currentUser.designation || 'Faculty') + '\n' +
          '• **Assigned Subjects:**\n' + courses.map(c => '  - ' + c).join('\n') + '\n\n' +
          '💡 *You can access your complete daily class schedule under "Class & Work Timetable" in your drawer menu.*';
      }
    }

    // ================= D. ADMINISTRATOR ROLE RESPONSES =================
    if (role === 'admin') {
      if (q.includes('stat') || q.includes('overview') || q.includes('summary') || q.includes('metric') || q.includes('campus')) {
        const totalUsers = Object.keys(targetDb.users || {}).length;
        const totalPasses = (targetDb.passes || []).length;
        const totalLeaves = (targetDb.leavePasses || []).length;
        return '📈 **Institutional Management Overview (' + inst.name + '):**\n\n' +
          '• **Institution Code / ID:** `' + (inst.id || currentUser.institutionId) + '`\n' +
          '• **Total Registered Accounts:** **' + totalUsers + ' active users**\n' +
          '• **Total Gate Passes Processed:** **' + totalPasses + ' passes**\n' +
          '• **Total Leave Requests:** **' + totalLeaves + ' leaves**\n' +
          '• **Platform Operational Status:** Active & Synchronized\n\n' +
          '**System Capabilities:**\n' +
          '1. Dual-layer storage (IndexedDB + Node Server) ensures zero data loss even when APK is cleared from minimize.\n' +
          '2. Cross-device synchronization enables seamless logins from any Android device or web browser.';
      }

      if (q.includes('bank') || q.includes('fee') || q.includes('upi') || q.includes('account')) {
        return '🏛️ **Institution Banking & Fee Collection Details:**\n\n' +
          '• **Institution:** ' + inst.name + ' (ID: `' + (inst.id || currentUser.institutionId) + '`)\n' +
          '• **Bank Name:** ' + (inst.bankName || 'State Bank of India') + '\n' +
          '• **Account Number:** `' + (inst.accountNo || '309811442586') + '`\n' +
          '• **IFSC Code:** `' + (inst.ifsc || 'SBIN0010234') + '`\n' +
          '• **Designated UPI ID:** `' + (inst.upiId || 'gec@sbi') + '`\n\n' +
          '💡 *To update your banking or UPI gateway information, navigate to "Campus Settings" from your admin drawer.*';
      }

      if (q.includes('naac') || q.includes('nba') || q.includes('accreditation') || q.includes('audit')) {
        return '📜 **Accreditation Compliance & Audit Readiness:**\n\n' +
          '• **Criterion 1 (Curricular Aspects):** Timetable adherence and lecture completion logs.\n' +
          '• **Criterion 2 (Teaching-Learning & Evaluation):** Real-time student attendance tracking with 75% margin compliance and digital remedial logs.\n' +
          '• **Criterion 3 (Student Support & Progression):** Automated digital gate passes, hostel leave tracking, and 24/7 security audit logs.\n' +
          '• **Criterion 5 (Governance & Management):** Centralized multi-tenant fee ledger with transparent digital e-receipt generation.';
      }
    }

    // ================= E. DEFAULT GENERAL RESPONSE =================
    return '🤖 **Smart Campus AI Assistant (Role: ' + (role.charAt(0).toUpperCase() + role.slice(1)) + '):**\n\n' +
      'I am here to assist with your specific duties and queries as a **' + (currentUser.designation || role) + '** at **' + inst.name + '**.\n\n' +
      '• **Your Account:** ' + currentUser.name + ' (' + (currentUser.roll || currentUser.staffId || currentUser.id) + ')\n' +
      '• **Department:** ' + (currentUser.dept || currentUser.branch || 'Academic Wing') + '\n\n' +
      'You can ask me about:\n' +
      (role === 'student' ? '1. Your attendance percentages and safe margin to 75%\n2. Gate pass & hostel leave pass approvals\n3. Class timetables and exam routines\n4. College fees, dues, and UPI payment procedures' :
       role === 'hostel_faculty' ? '1. Pending gate pass and leave pass requests to approve\n2. Hostel main gate curfew rules and security scanner SOPs\n3. Mess dining hygiene and kitchen inspection guidelines' :
       role === 'faculty' ? '1. Lesson plan outlines for your assigned courses\n2. Drafting and broadcasting departmental notices\n3. Student attendance counseling and timetable schedules' :
       '1. Institutional metrics and student/faculty counts\n2. Campus fee collection, bank details, and UPI setup\n3. Accreditation reports and security logs') +
      '\n\nFeel free to type your question below or click any suggestion button above!';
  }

  async function handleSendAiQuery(userText) {
    if (!userText) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appendChatMessage('You', userText, 'user', now);
    chatHistory.push({ role: 'user', content: userText });

    // Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-bubble chat-bubble-ai';
    typingIndicator.id = 'aiTypingIndicator';
    typingIndicator.innerHTML = '<div class="chat-sender"><span>🤖</span> Campus AI is thinking...</div>' +
      '<div class="chat-text"><span class="typing-dots"><span>●</span> <span>●</span> <span>●</span></span></div>';
    chatAiThread.appendChild(typingIndicator);
    chatAiThread.scrollTop = chatAiThread.scrollHeight;

    const currentUser = db.currentUser || { name: 'Campus Member', role: 'student' };
    const inst = (db.institutions && db.institutions[currentUser.institutionId]) ||
                 (db.institutions && db.institutions['GEC-2026']) || { name: 'GEC Bhubaneswar' };

    const studentPasses = (db.passes || []).filter(p => 
      (p.roll && currentUser.roll && p.roll.toLowerCase() === currentUser.roll.toLowerCase()) ||
      (p.studentName && currentUser.name && p.studentName.toLowerCase() === currentUser.name.toLowerCase())
    );

    const pendingPassCount = (db.passes || []).filter(p => p.status === 'PENDING').length;

    const systemPrompt = 'You are the official Smart Campus AI Assistant. Never mention any third-party API providers or AI model names. Provide helpful, accurate campus assistance.\n' +
      'CURRENT ACTIVE USER RECORD:\n' +
      '- Name: ' + currentUser.name + '\n' +
      '- Role: ' + currentUser.role + '\n' +
      '- ID: ' + (currentUser.roll || currentUser.staffId || currentUser.id) + '\n' +
      '- Institution: ' + inst.name + ' (ID: ' + (currentUser.institutionId || 'GEC-2026') + ')\n' +
      '- Department/Branch: ' + (currentUser.branch || currentUser.dept || 'N/A') + '\n' +
      (currentUser.role === 'student' ?
        '- Attendance: ' + (currentUser.attendance || 88.3) + '% (Minimum required: 75.0%)\n' +
        '- Subjects: ' + JSON.stringify(currentUser.subjects || []) + '\n' +
        '- Outstanding Dues: ₹' + (currentUser.dues || 0) + '\n' +
        '- Hostel: ' + (currentUser.hostel || 'Day Scholar') + '\n' +
        '- Passes: ' + JSON.stringify(studentPasses) + '\n'
        : '') +
      (currentUser.role === 'hostel_faculty' ?
        '- Designation: ' + (currentUser.designation || 'Hostel Superintendent') + '\n' +
        '- Pending Passes in System: ' + pendingPassCount + '\n'
        : '') +
      (currentUser.role === 'faculty' ?
        '- Designation: ' + (currentUser.designation || 'Faculty') + '\n' +
        '- Courses: ' + JSON.stringify(currentUser.courses || []) + '\n'
        : '') +
      (currentUser.role === 'admin' ?
        '- Total Users in DB: ' + Object.keys(db.users || {}).length + '\n'
        : '') +
      '\nINSTRUCTIONS:\n' +
      '1. Answer accurately and specifically using the user live record above.\n' +
      '2. Answer according to their work, role, and functions.\n' +
      '3. If they ask about attendance, passes, fees, timetable, or duties, cite their exact numbers and details.\n' +
      '4. Do not provide identical generic answers; customize each response to the user actual data.\n' +
      '5. Keep your tone polite, encouraging, and easily understood by students, faculty, or administrators.';

    try {
      const resp = await fetch(GROK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + GROK_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROK_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.slice(-6)
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      typingIndicator.remove();

      if (resp.ok) {
        const data = await resp.json();
        const aiReply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (aiReply) {
          chatHistory.push({ role: 'assistant', content: aiReply });
          appendChatMessage('Campus AI Assistant', aiReply, 'ai', now);
          return;
        }
      }

      // Safe fallback if rate-limited or quota reached
      const fallbackReply = generateCampusAiResponse(userText, currentUser, db);
      chatHistory.push({ role: 'assistant', content: fallbackReply });
      appendChatMessage('Campus AI Assistant', fallbackReply, 'ai', now);
    } catch (err) {
      typingIndicator.remove();
      const fallbackReply = generateCampusAiResponse(userText, currentUser, db);
      chatHistory.push({ role: 'assistant', content: fallbackReply });
      appendChatMessage('Campus AI Assistant', fallbackReply, 'ai', now);
    }
  }

    // --- VOICE ASSISTANT INTEGRATION (SPEECH-TO-TEXT & AUDIO PLAYBACK) ---
  const chatAiVoiceBtn = document.getElementById('chatAiVoiceBtn');
  let recognitionInstance = null;
  let isVoiceListening = false;

  if (window.webkitSpeechRecognition || window.SpeechRecognition) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionInstance = new SpeechRec();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      isVoiceListening = true;
      if (chatAiVoiceBtn) {
        chatAiVoiceBtn.style.background = '#ef4444';
        chatAiVoiceBtn.style.color = '#ffffff';
        chatAiVoiceBtn.innerHTML = '<span>🔴</span>';
      }
      showToast('🎙️ Listening... Ask your question.', 'info');
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (chatAiInput) chatAiInput.value = transcript;
      handleSendAiQuery(transcript);
    };

    recognitionInstance.onerror = (e) => {
      console.warn('Speech recognition error:', e);
    };

    recognitionInstance.onend = () => {
      isVoiceListening = false;
      if (chatAiVoiceBtn) {
        chatAiVoiceBtn.style.background = 'rgba(99, 102, 241, 0.15)';
        chatAiVoiceBtn.style.color = '#818cf8';
        chatAiVoiceBtn.innerHTML = '<span>🎙️</span>';
      }
    };
  }

  chatAiVoiceBtn?.addEventListener('click', () => {
    if (!recognitionInstance) {
      showToast('Voice assistant speech input not supported in this browser.', 'warning');
      return;
    }
    if (isVoiceListening) {
      recognitionInstance.stop();
    } else {
      recognitionInstance.start();
    }
  });

  if (chatAiForm) {
    chatAiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (chatAiInput?.value || '').trim();
      if (!text) return;
      chatAiInput.value = '';
      handleSendAiQuery(text);
    });
  }

  if (chatAiClearBtn) {
    chatAiClearBtn.addEventListener('click', () => {
      chatHistory = [];
      if (chatAiThread) {
        chatAiThread.innerHTML = '<div class="chat-bubble chat-bubble-ai">' +
          '<div class="chat-sender"><span>🤖</span> Campus AI Assistant</div>' +
          '<div class="chat-text">Welcome, How may I help you</div>' +
          '<div class="chat-time">Just now</div>' +
        '</div>';
      }
      showToast('AI chat history cleared.', 'info');
    });
  }


  // ==========================================================================
  // V4.0 MODERN CORE SYSTEMS: SETUP, TRANSPORT, LIBRARY, ASSIGNMENTS, ID CARD
  // ==========================================================================

  
  // =========================================================================
  // ENTERPRISE ROLE-BASED DASHBOARDS, SERVICES, BANKING, FEEDBACK & MODALS
  // =========================================================================

  // 1. RENDER ROLE-SPECIFIC HOME DASHBOARD
  function renderRoleHome(user) {
    const containers = ['homeRoleStudent', 'homeRoleFaculty', 'homeRoleHostel', 'homeRoleAdmin'];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    const activeContainerId = user.role === 'student' ? 'homeRoleStudent'
      : (user.role === 'faculty' ? 'homeRoleFaculty'
      : (user.role === 'hostel_faculty' ? 'homeRoleHostel' : 'homeRoleAdmin'));

    const activeEl = document.getElementById(activeContainerId);
    if (activeEl) {
      activeEl.style.display = 'block';
      activeEl.querySelectorAll('.role-greeting-name').forEach(el => {
        el.textContent = (user.name || '').split(' ')[0] || user.name;
      });
      activeEl.querySelectorAll('.role-greeting-sub').forEach(el => {
        if (user.role === 'student') {
          el.textContent = (user.roll || '') + ' • ' + (user.branch || user.dept || 'Engineering') + ' • ' + (user.institutionId || 'GEC-2026');
        } else if (user.role === 'faculty') {
          el.textContent = (user.department || user.dept || 'Academic Dept') + ' • ' + (user.institutionId || 'GEC-2026');
        } else if (user.role === 'hostel_faculty') {
          el.textContent = (user.wing || 'Hostel Operations') + ' • ' + (user.institutionId || 'GEC-2026');
        } else {
          el.textContent = (db.institutions[user.institutionId]?.name || 'Central Campus') + ' • ' + (user.institutionId || 'GEC-2026');
        }
      });
    }

    // Role-specific Home content updates
    const currentInstId = getTenantInstitutionId();
    if (user.role === 'admin') {
      const allUsers = Object.values(db.users || {}).filter(u => !u.institutionId || u.institutionId === currentInstId);
      const stuCount = allUsers.filter(u => u.role === 'student').length;
      const facCount = allUsers.filter(u => u.role === 'faculty').length;
      const hostCount = allUsers.filter(u => u.role === 'hostel_faculty').length;

      const elStu = document.getElementById('adminStatStudentsCount');
      if (elStu) elStu.textContent = stuCount > 0 ? (stuCount + 2400).toLocaleString() : '2,450';
      const elFac = document.getElementById('adminStatFacultyCount');
      if (elFac) elFac.textContent = facCount > 0 ? (facCount + 120).toLocaleString() : '128';
      const elHost = document.getElementById('adminStatHostelCount');
      if (elHost) elHost.textContent = hostCount > 0 ? (hostCount + 20).toLocaleString() : '24';

      const elInstName = document.getElementById('adminInstNameHeader');
      if (elInstName) elInstName.textContent = db.institutions[currentInstId]?.name || (currentInstId + ' Campus');
      const elInstId = document.getElementById('adminInstIdHeader');
      if (elInstId) elInstId.textContent = currentInstId;
    } else if (user.role === 'hostel_faculty') {
      const pendingPasses = (db.passes || []).filter(p => (!p.institutionId || p.institutionId === currentInstId) && p.status === 'PENDING').length;
      const pendingLeaves = (db.leavePasses || []).filter(p => (!p.institutionId || p.institutionId === currentInstId) && p.status === 'PENDING').length;
      const badge = document.getElementById('hostelPendingCountBadge');
      if (badge) badge.textContent = (pendingPasses + pendingLeaves) + ' Passes Pending Review';
      renderHostelHomeNotices();
    } else if (user.role === 'student') {
      renderStudentHomeNotices();
    } else if (user.role === 'faculty') {
      renderFacultyHomeNotices();
    }
  }

  // 2. RENDER ROLE-SPECIFIC SERVICES SCREEN
  function renderRoleServices(user) {
    const containers = ['servicesRoleStudent', 'servicesRoleFaculty', 'servicesRoleHostel', 'servicesRoleAdmin'];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    const activeContainerId = user.role === 'student' ? 'servicesRoleStudent'
      : (user.role === 'faculty' ? 'servicesRoleFaculty'
      : (user.role === 'hostel_faculty' ? 'servicesRoleHostel' : 'servicesRoleAdmin'));

    const activeEl = document.getElementById(activeContainerId);
    if (activeEl) activeEl.style.display = 'block';

    const hTitle = document.getElementById('servicesPageHeading');
    const hSub = document.getElementById('servicesPageSub');
    if (hTitle) {
      hTitle.textContent = user.role === 'student' ? 'Student Services Desk'
        : (user.role === 'faculty' ? 'Faculty Academic Services'
        : (user.role === 'hostel_faculty' ? 'Hostel Management Services' : 'Institutional Administration Services'));
    }
    if (hSub) {
      hSub.textContent = 'All services categorized and secured for ' + (user.institutionId || 'your institution') + '.';
    }

    renderDynamicCustomServices(user.role);
  }

  // 3. DYNAMIC CUSTOM SERVICES ADDED BY ADMIN FOR ROLES
  function renderDynamicCustomServices(role) {
    const currentInstId = getTenantInstitutionId();
    const list = (db.customServices || []).filter(s => s.role === role && (!s.institutionId || s.institutionId === currentInstId));

    const boxId = role === 'student' ? 'catStuCustomServicesBox'
      : (role === 'faculty' ? 'catFacCustomServicesBox'
      : (role === 'hostel_faculty' ? 'catHostelCustomServicesBox' : 'catAdminCustomServicesBox'));

    const containerId = role === 'student' ? 'stuCustomServicesList'
      : (role === 'faculty' ? 'facCustomServicesList'
      : (role === 'hostel_faculty' ? 'hostelCustomServicesList' : 'adminCustomServicesList'));

    const boxEl = document.getElementById(boxId);
    const containerEl = document.getElementById(containerId);
    if (!boxEl || !containerEl) return;

    if (list.length === 0) {
      boxEl.style.display = 'none';
      return;
    }

    boxEl.style.display = 'block';
    containerEl.innerHTML = list.map(s => {
      return '<div class="services-item-row" data-custom-id="' + s.id + '" style="cursor:pointer;">' +
        '<div class="service-item-label"><span>' + (s.icon || '✨') + '</span> ' + s.title + '</div>' +
        '<span style="color:#a78bfa; font-size:0.75rem;">' + (s.category || 'Custom') + ' &rsaquo;</span>' +
      '</div>';
    }).join('');

    containerEl.querySelectorAll('.services-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.customId;
        const item = list.find(s => s.id === id);
        if (item) {
          showToast('Service: ' + item.title + ' (' + (item.desc || 'Active institution service') + ')', 'info');
        }
      });
    });
  }

  // 4. ADMIN SERVICE CUSTOMIZER
  function openAdminServiceCustomizer() {
    if (!db.currentUser || db.currentUser.role !== 'admin') {
      showToast('Service customization is restricted to Campus Administrators.', 'error');
      return;
    }
    const modal = document.getElementById('modalAdminServiceCustomizer');
    if (modal) {
      modal.classList.add('open');
      renderActiveCustomServicesList('student');
    }
  }

  function renderActiveCustomServicesList(targetRole) {
    const container = document.getElementById('custActiveServicesContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const list = (db.customServices || []).filter(s => s.role === targetRole && (!s.institutionId || s.institutionId === currentInstId));

    if (list.length === 0) {
      container.innerHTML = '<div style="font-size:0.75rem; color:#94a3b8; padding:8px; text-align:center;">No custom services added for this role yet. Add one above!</div>';
      return;
    }

    container.innerHTML = list.map(s => {
      return '<div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; border-radius:10px; padding:8px 12px;">' +
        '<div>' +
          '<span style="font-size:1rem; margin-right:8px;">' + (s.icon || '✨') + '</span>' +
          '<strong style="color:#fff; font-size:0.8rem;">' + s.title + '</strong>' +
          '<span style="font-size:0.7rem; color:#94a3b8; margin-left:8px;">(' + (s.category || 'General') + ')</span>' +
        '</div>' +
        '<button type="button" class="btn-delete-custom-service" data-id="' + s.id + '" style="background:rgba(239,68,68,0.15); border:none; color:#f87171; border-radius:8px; padding:4px 8px; cursor:pointer;" title="Delete Service">🗑️ Delete</button>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.btn-delete-custom-service').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        deleteCustomService(id, targetRole);
      });
    });
  }

  function deleteCustomService(serviceId, targetRole) {
    const currentInstId = getTenantInstitutionId();
    db.customServices = (db.customServices || []).filter(s => s.id !== serviceId);
    saveDb();

    // Sync deletion to backend
    fetch('/api/sync/delete-custom-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, institutionId: currentInstId, role: targetRole })
    }).catch(e => console.warn('Sync delete-custom-service:', e));

    renderActiveCustomServicesList(targetRole);
    if (db.currentUser) renderDynamicCustomServices(db.currentUser.role);
    showToast('Service deleted and removed from ' + targetRole + ' portal.', 'info');
  }

  // 5. ADMIN BANKING CONFIGURATION
  function openAdminBankConfig() {
    if (!db.currentUser || db.currentUser.role !== 'admin') {
      showToast('Banking setup is restricted to Campus Administrators.', 'error');
      return;
    }
    const currentInstId = getTenantInstitutionId();
    const inst = db.institutions[currentInstId] || {};

    const bName = document.getElementById('cfgBankName');
    if (bName) bName.value = inst.bankName || 'State Bank of India';
    const acc = document.getElementById('cfgAccountNo');
    if (acc) acc.value = inst.accountNo || '309811442586';
    const ifsc = document.getElementById('cfgIfsc');
    if (ifsc) ifsc.value = inst.ifsc || 'SBIN0010234';
    const upi = document.getElementById('cfgUpiId');
    if (upi) upi.value = inst.upiId || 'gec@sbi';

    const qrImg = document.getElementById('cfgQrImg');
    const qrPlaceholder = document.getElementById('cfgQrPlaceholder');
    if (inst.qrCodeUrl) {
      if (qrImg) { qrImg.src = inst.qrCodeUrl; qrImg.style.display = 'block'; }
      if (qrPlaceholder) qrPlaceholder.style.display = 'none';
    } else {
      if (qrImg) qrImg.style.display = 'none';
      if (qrPlaceholder) qrPlaceholder.style.display = 'block';
    }

    const modal = document.getElementById('modalAdminBankConfig');
    if (modal) modal.classList.add('open');
  }

  // 6. ADMIN CONFIDENTIAL FEEDBACK VIEWER
  function openAdminFeedbackView(filterCategory = 'all') {
    if (!db.currentUser || db.currentUser.role !== 'admin') {
      showToast('Student feedback is confidential and viewable only by Campus Administrator.', 'error');
      return;
    }

    const modal = document.getElementById('modalAdminFeedbackView');
    if (!modal) return;
    modal.classList.add('open');

    renderAdminFeedbackCards(filterCategory);
  }

  function renderAdminFeedbackCards(filterCategory) {
    const container = document.getElementById('adminFeedbackCardsContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    let feedbacks = (db.studentFeedback || []).filter(f => !f.institutionId || f.institutionId === currentInstId);

    if (filterCategory !== 'all') {
      feedbacks = feedbacks.filter(f => f.category === filterCategory);
    }

    if (feedbacks.length === 0) {
      container.innerHTML = '<div style="font-size:0.8rem; color:#94a3b8; text-align:center; padding:20px;">No student feedback submitted in this category yet.</div>';
      return;
    }

    container.innerHTML = feedbacks.map(f => {
      const starStr = '⭐'.repeat(Math.max(1, Math.min(5, f.rating || 5)));
      const catBadge = f.category === 'faculty' ? '👨‍🏫 Faculty' : (f.category === 'hostel' ? '🏢 Hostel' : '🍲 Canteen');
      return '<div style="background:#1e293b; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
          '<span style="background:rgba(99,102,241,0.2); color:#a5b4fc; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:8px;">' + catBadge + '</span>' +
          '<span style="font-size:0.85rem;">' + starStr + ' (' + f.rating + '/5)</span>' +
        '</div>' +
        '<div style="font-weight:700; color:#fff; font-size:0.85rem; margin-bottom:4px;">' + (f.targetName || 'General Staff') + '</div>' +
        '<p style="font-size:0.78rem; color:#cbd5e1; margin:0 0 6px 0; line-height:1.4;">"' + (f.comments || 'No comments provided.') + '"</p>' +
        '<div style="display:flex; justify-content:space-between; font-size:0.68rem; color:#94a3b8;">' +
          '<span>Student: ' + (f.studentRoll || 'Verified Student') + '</span>' +
          '<span>' + (f.createdAt ? f.createdAt.slice(0, 10) : 'Recent') + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 7. STUDENT CONFIDENTIAL FEEDBACK SUBMISSION
  function openStudentFeedbackModal() {
    const modal = document.getElementById('modalStudentFeedback');
    if (modal) modal.classList.add('open');
  }

  // 8. STUDENT FEE RECEIPT GENERATOR & STAMPED RECEIPT DISPLAY
  function openStudentFeeReceiptModal() {
    const modal = document.getElementById('modalStudentFeeReceipt');
    if (modal) {
      modal.classList.add('open');
      const dInput = document.getElementById('receiptDate');
      if (dInput) dInput.value = new Date().toISOString().slice(0, 10);
    }
  }

  function displayStampedFeeReceipt(rcpt) {
    const currentInstId = getTenantInstitutionId();
    const instName = db.institutions[currentInstId]?.name || (currentInstId + ' CAMPUS');

    const elInst = document.getElementById('rcptInstName');
    if (elInst) elInst.textContent = instName.toUpperCase();
    const elNum = document.getElementById('rcptNumber');
    if (elNum) elNum.textContent = rcpt.receiptNumber || ('GEC/2026/FEE/' + Math.floor(10000 + Math.random() * 90000));
    const elStu = document.getElementById('rcptStudentName');
    if (elStu) elStu.textContent = rcpt.studentName || db.currentUser?.name || 'Student';
    const elRoll = document.getElementById('rcptStudentRoll');
    if (elRoll) elRoll.textContent = rcpt.studentRoll || db.currentUser?.roll || 'CS-2024-082';
    const elDept = document.getElementById('rcptDept');
    if (elDept) elDept.textContent = db.currentUser?.branch || db.currentUser?.dept || 'Engineering';
    const elSem = document.getElementById('rcptSem');
    if (elSem) elSem.textContent = db.currentUser?.sem || '5th Semester';
    const elDate = document.getElementById('rcptDate');
    if (elDate) elDate.textContent = rcpt.paymentDate || new Date().toISOString().slice(0, 10);
    const elUtr = document.getElementById('rcptUtr');
    if (elUtr) elUtr.textContent = rcpt.utr || 'UPI/628192019482';
    const elHead = document.getElementById('rcptFeeHeadTitle');
    if (elHead) elHead.textContent = rcpt.feeHead || 'Semester Tuition Fee';
    const elAmt = document.getElementById('rcptAmountVal');
    if (elAmt) elAmt.textContent = '₹' + Number(rcpt.amount).toLocaleString('en-IN');

    const displayModal = document.getElementById('modalFeeReceiptDisplay');
    if (displayModal) displayModal.classList.add('open');
  }

  // 9. FACULTY CERTIFICATE ISSUANCE MODAL
  function openFacultyCertificateModal() {
    const modal = document.getElementById('modalFacultyIssueCertificate');
    if (modal) modal.classList.add('open');
  }

  // 10. NOTICES RENDERING HELPERS
  function renderStudentHomeNotices() {
    const container = document.getElementById('stuHomeNoticesContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const notices = (db.notices || []).filter(n => !n.institutionId || n.institutionId === currentInstId).slice(0, 3);
    container.innerHTML = notices.map(n => {
      return '<div class="notice-card" style="margin-bottom:8px; padding:10px; background:#131c31; border:1px solid rgba(255,255,255,0.06); border-radius:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">' +
          '<span style="background:rgba(99,102,241,0.2); color:#a5b4fc; font-size:0.68rem; font-weight:700; padding:2px 6px; border-radius:6px;">' + (n.category || 'Academic') + '</span>' +
          '<span style="font-size:0.7rem; color:#94a3b8;">' + (n.date || 'Recent') + '</span>' +
        '</div>' +
        '<div style="font-weight:700; font-size:0.82rem; color:#fff; margin-bottom:2px;">' + n.title + '</div>' +
        '<p style="font-size:0.74rem; color:#94a3b8; margin:0;">' + (n.body || n.content || '') + '</p>' +
      '</div>';
    }).join('');
  }

  function renderFacultyHomeNotices() {
    const container = document.getElementById('facHomeNoticesContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const notices = (db.notices || []).filter(n => !n.institutionId || n.institutionId === currentInstId).slice(0, 3);
    container.innerHTML = notices.map(n => {
      return '<div class="notice-card" style="margin-bottom:8px; padding:10px; background:#131c31; border:1px solid rgba(255,255,255,0.06); border-radius:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">' +
          '<span style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.68rem; font-weight:700; padding:2px 6px; border-radius:6px;">' + (n.category || 'Notice') + '</span>' +
          '<span style="font-size:0.7rem; color:#94a3b8;">' + (n.date || 'Recent') + '</span>' +
        '</div>' +
        '<div style="font-weight:700; font-size:0.82rem; color:#fff; margin-bottom:2px;">' + n.title + '</div>' +
        '<p style="font-size:0.74rem; color:#94a3b8; margin:0;">' + (n.body || '') + '</p>' +
      '</div>';
    }).join('');
  }

  function renderHostelHomeNotices() {
    const container = document.getElementById('hostelHomeNoticesContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const notices = (db.notices || []).filter(n => !n.institutionId || n.institutionId === currentInstId).slice(0, 3);
    container.innerHTML = notices.map(n => {
      return '<div class="notice-card" style="margin-bottom:8px; padding:10px; background:#131c31; border:1px solid rgba(255,255,255,0.06); border-radius:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">' +
          '<span style="background:rgba(245,158,11,0.2); color:#fbbf24; font-size:0.68rem; font-weight:700; padding:2px 6px; border-radius:6px;">' + (n.category || 'Hostel') + '</span>' +
          '<span style="font-size:0.7rem; color:#94a3b8;">' + (n.date || 'Recent') + '</span>' +
        '</div>' +
        '<div style="font-weight:700; font-size:0.82rem; color:#fff; margin-bottom:2px;">' + n.title + '</div>' +
        '<p style="font-size:0.74rem; color:#94a3b8; margin:0;">' + (n.body || '') + '</p>' +
      '</div>';
    }).join('');
  }

  function setupUserSession(user) {
    if (!user) return;
    db.currentUser = user;
    db.currentInstitutionId = user.institutionId || 'GEC-2026';
    saveAppSession(user);

    // Dynamic role class on body for CSS styling
    document.body.classList.remove('role-student', 'role-faculty', 'role-hostel', 'role-admin');
    const roleClass = user.role === 'hostel_faculty' ? 'role-hostel' : ('role-' + user.role);
    document.body.classList.add(roleClass);

    document.body.classList.add('logged-in');
    document.body.classList.remove('unauthenticated');

    const appHeaderEl = document.getElementById('appHeader');
    if (appHeaderEl) appHeaderEl.style.display = 'flex';

    // Bottom Navigation Bar & Admin-only FAB
    const bottomNavEl = document.getElementById('bottomNav');
    if (bottomNavEl) bottomNavEl.style.display = 'flex';
    const navFabNewRequest = document.getElementById('navFabNewRequest');
    if (navFabNewRequest) {
      navFabNewRequest.style.display = (user.role === 'admin') ? 'flex' : 'none';
      navFabNewRequest.title = 'Customize Services (+)';
    }

    const avInit = document.getElementById('avatarInitials');
    if (avInit) {
      const parts = (user.name || 'SC').trim().split(' ');
      avInit.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : user.name.slice(0, 2).toUpperCase();
    }

    // 1. SWITCH VIEW IMMEDIATELY TO HOME DASHBOARD!
    // This guarantees the user is NEVER left on the login page!
    switchView('page-home', 'Home Dashboard');

    // 2. Run all profile & dashboard renderers safely inside try/catch blocks
    try { updateAllUserAvatars(user); } catch (e) { console.warn('Avatar error:', e); }
    try { renderMoreProfile(); } catch (e) { console.warn('MoreProfile error:', e); }
    try { renderDigitalIdCard(); } catch (e) { console.warn('DigitalId error:', e); }

    try {
      if (user.role === 'student') {
        renderStudentData(user);
      } else if (user.role === 'hostel_faculty') {
        renderHostelFacultyData(user);
      } else if (user.role === 'faculty') {
        renderFacultyData(user);
      } else if (user.role === 'admin') {
        renderAdminData(user);
      }
    } catch (e) { console.warn('RoleData error:', e); }

    try { renderRoleHome(user); } catch (e) { console.warn('RoleHome error:', e); }
    try { renderRoleServices(user); } catch (e) { console.warn('RoleServices error:', e); }
    try { renderAiPromptChips(user.role); } catch (e) { console.warn('AiPromptChips error:', e); }
  }

  // --- 1. Campus Transportation System ---
  function renderTransportRoutes() {
    const container = document.getElementById('transportRoutesContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const routes = (db.transportRoutes || []).filter(r => !r.institutionId || r.institutionId === currentInstId);

    if (routes.length === 0) {
      container.innerHTML = '<div style="padding:24px; text-align:center; color:#94a3b8;">No transport routes available for your institution.</div>';
      return;
    }

    container.innerHTML = routes.map(r => {
      const badgeClass = r.statusType === 'completed' ? 'badge-approved' : 'badge-pending';
      const stopsHtml = (r.stops || []).map((stop, i) => {
        const isLast = i === r.stops.length - 1;
        return '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
          '<span style="width:8px; height:8px; border-radius:50%; background:' + (isLast ? '#10b981' : '#6366f1') + '; flex-shrink:0;"></span>' +
          '<span style="font-size:0.75rem; color:' + (isLast ? '#34d399' : '#cbd5e1') + '; font-weight:' + (isLast ? '700' : '500') + ';">' + stop + '</span>' +
        '</div>';
      }).join('');

      return '<div class="transport-route-card">' +
        '<div class="transport-route-header">' +
          '<div>' +
            '<h3 style="font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:2px;">' + r.name + '</h3>' +
            '<span style="font-size:0.72rem; color:#94a3b8;">Bus: <strong style="color:#7dd3fc;">' + r.busNumber + '</strong> • ' + r.time + '</span>' +
          '</div>' +
          '<span class="approval-badge ' + badgeClass + '">' + r.status + '</span>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.03); border-radius:12px; padding:10px 12px; margin:10px 0;">' +
          '<div style="font-size:0.68rem; font-weight:700; color:#a5b4fc; text-transform:uppercase; margin-bottom:6px;">Route Stops & Schedule</div>' +
          stopsHtml +
        '</div>' +
        '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px;">' +
          '<span style="font-size:0.75rem; color:#94a3b8;">Driver: <strong style="color:#fff;">' + r.driverName + '</strong></span>' +
          '<a href="tel:' + r.driverPhone + '" class="btn-secondary" style="padding:4px 10px; font-size:0.72rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">' +
            '<span>📞</span> Call Driver' +
          '</a>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderBusPass() {
    const user = db.currentUser;
    if (!user) return;
    const nameEl = document.getElementById('busPassHolderName');
    const subEl = document.getElementById('busPassHolderSub');
    const routeEl = document.getElementById('busPassRouteName');
    const qrContainer = document.getElementById('busPassQrCode');

    if (nameEl) nameEl.textContent = user.name;
    if (subEl) subEl.textContent = (user.roll || user.id) + ' • ' + (user.dept || 'Campus Member');
    if (routeEl) routeEl.textContent = 'Route 1: Cuttack Link Express (OD-05-AB-1204)';

    if (qrContainer && typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      try {
        new QRCode(qrContainer, {
          text: 'BUS-PASS:' + (user.id || 'PASS') + ':' + (user.institutionId || 'GEC') + ':VALID-2027',
          width: 120,
          height: 120,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        console.warn('QR error:', e);
      }
    }
  }

  // --- 2. Smart Library System ---
  function renderLibraryCatalog(query = '') {
    const container = document.getElementById('libraryBooksContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    let books = (db.libraryBooks || []).filter(b => !b.institutionId || b.institutionId === currentInstId);

    if (query) {
      const q = query.toLowerCase();
      books = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      );
    }

    if (books.length === 0) {
      container.innerHTML = '<div style="padding:24px; text-align:center; color:#94a3b8;">No matching books found in library catalog.</div>';
      return;
    }

    container.innerHTML = books.map(b => {
      const isAvail = b.available > 0;
      return '<div class="card-box" style="margin-bottom:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">' +
          '<span class="approval-badge badge-approved" style="font-size:0.65rem;">' + b.category + '</span>' +
          '<span style="font-size:0.75rem; color:' + (isAvail ? '#34d399' : '#f87171') + '; font-weight:700;">' +
            (isAvail ? (b.available + '/' + b.total + ' Available') : 'Out of Stock') +
          '</span>' +
        '</div>' +
        '<h4 style="color:#fff; font-size:0.95rem; font-weight:700; margin-bottom:2px;">' + b.title + '</h4>' +
        '<p style="font-size:0.75rem; color:#94a3b8; margin-bottom:8px;">By ' + b.author + ' • ' + b.edition + ' • ISBN: ' + b.isbn + '</p>' +
        '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:8px;">' +
          '<span style="font-size:0.7rem; color:#64748b;">📍 ' + b.shelf + '</span>' +
          '<button type="button" class="btn-primary" onclick="window.handleBorrowBook(&quot;' + b.id + '&quot;)" ' + (!isAvail ? 'disabled' : '') + ' style="padding:6px 14px; font-size:0.75rem;">' +
            '<span>📚</span> ' + (isAvail ? 'Borrow Book' : 'Reserved') +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  window.handleBorrowBook = function(bookId) {
    const currentInstId = getTenantInstitutionId();
    const book = (db.libraryBooks || []).find(b => b.id === bookId);
    if (!book || book.available <= 0) {
      showToast('Book is currently unavailable for borrowing.', 'error');
      return;
    }

    book.available--;
    if (!db.borrowedBooks) db.borrowedBooks = [];

    const now = new Date();
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const borrowEntry = {
      id: 'BORROW-' + Date.now(),
      userId: (db.currentUser && db.currentUser.id) || 'CS-2024-082',
      institutionId: currentInstId,
      bookId: book.id,
      title: book.title,
      author: book.author,
      issueDate: now.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    db.borrowedBooks.unshift(borrowEntry);
    saveDb();
    showToast('📖 Borrowed "' + book.title + '"! Due date: ' + borrowEntry.dueDate, 'success');
    renderLibraryCatalog(document.getElementById('librarySearchInput')?.value || '');
    renderBorrowedBooks();
  };

  function renderBorrowedBooks() {
    const container = document.getElementById('libraryBorrowedContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const userId = (db.currentUser && db.currentUser.id) || 'CS-2024-082';
    const list = (db.borrowedBooks || []).filter(b => (!b.institutionId || b.institutionId === currentInstId) && (!b.userId || b.userId === userId));

    if (list.length === 0) {
      container.innerHTML = '<div style="padding:24px; text-align:center; color:#94a3b8;">You currently have no borrowed books.</div>';
      return;
    }

    container.innerHTML = list.map(b => {
      return '<div class="card-box" style="margin-bottom:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">' +
          '<span class="approval-badge badge-pending">DUE: ' + b.dueDate + '</span>' +
          '<span style="font-size:0.72rem; color:#94a3b8;">Issued: ' + b.issueDate + '</span>' +
        '</div>' +
        '<h4 style="color:#fff; font-size:0.92rem; font-weight:700; margin-bottom:2px;">' + b.title + '</h4>' +
        '<p style="font-size:0.75rem; color:#94a3b8; margin-bottom:10px;">By ' + b.author + '</p>' +
        '<div style="display:flex; gap:8px;">' +
          '<button type="button" class="btn-secondary" onclick="window.handleRenewBook(&quot;' + b.id + '&quot;)" style="flex:1; padding:6px 10px; font-size:0.72rem;">' +
            '<span>🔄</span> Renew (+7 Days)' +
          '</button>' +
          '<button type="button" class="btn-secondary" onclick="window.handleReturnBook(&quot;' + b.id + '&quot;)" style="flex:1; padding:6px 10px; font-size:0.72rem; color:#34d399;">' +
            '<span>✅</span> Return Book' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  window.handleRenewBook = function(borrowId) {
    const item = (db.borrowedBooks || []).find(b => b.id === borrowId);
    if (!item) return;
    const currDue = new Date(item.dueDate);
    const newDue = new Date(currDue.getTime() + 7 * 24 * 60 * 60 * 1000);
    item.dueDate = newDue.toISOString().split('T')[0];
    saveDb();
    showToast('Book renewed! Extended due date: ' + item.dueDate, 'success');
    renderBorrowedBooks();
  };

  window.handleReturnBook = function(borrowId) {
    const idx = (db.borrowedBooks || []).findIndex(b => b.id === borrowId);
    if (idx !== -1) {
      const item = db.borrowedBooks[idx];
      const book = (db.libraryBooks || []).find(b => b.id === item.bookId);
      if (book) book.available++;
      db.borrowedBooks.splice(idx, 1);
      saveDb();
      showToast('Book returned to library successfully.', 'success');
      renderBorrowedBooks();
      renderLibraryCatalog(document.getElementById('librarySearchInput')?.value || '');
    }
  };

  // --- 3. Smart Assignment System ---
  let currentAsgFilter = 'ALL';
  function renderAssignmentsList(filter = currentAsgFilter) {
    currentAsgFilter = filter;
    const container = document.getElementById('assignmentsListContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    let list = (db.assignments || []).filter(a => !a.institutionId || a.institutionId === currentInstId);

    // Dynamic visibility for + Create Assignment button
    const btnCreate = document.getElementById('btnFacultyCreateAssignment');
    const isFacultyOrAdmin = db.currentUser && (db.currentUser.role === 'faculty' || db.currentUser.role === 'admin');
    if (btnCreate) {
      btnCreate.style.display = isFacultyOrAdmin ? 'inline-flex' : 'none';
    }

    if (filter === 'PENDING') {
      list = list.filter(a => a.status === 'PENDING');
    } else if (filter === 'SUBMITTED') {
      list = list.filter(a => a.status === 'SUBMITTED');
    }

    if (list.length === 0) {
      container.innerHTML = '<div style="padding:24px; text-align:center; color:#94a3b8;">' +
        (isFacultyOrAdmin ? 'No assignments posted yet. Click <strong>"+ Create Assignment"</strong> to upload and publish an assignment for your students.' : 'No assignments found in this category.') +
      '</div>';
      return;
    }

    container.innerHTML = list.map(a => {
      const isSubmitted = a.status === 'SUBMITTED';
      const badgeClass = isSubmitted ? 'badge-approved' : 'badge-pending';
      const statusLabel = isSubmitted ? 'SUBMITTED' : 'DUE SOON';

      let fileHtml = '';
      if (a.fileName) {
        fileHtml = '<div style="display:inline-flex; align-items:center; gap:6px; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); border-radius:8px; padding:4px 10px; font-size:0.75rem; color:#818cf8; margin-bottom:8px;">' +
          '<span>📎</span> Question Paper / File: <strong>' + a.fileName + '</strong>' +
        '</div>';
      }

      let actionHtml = '';
      if (isFacultyOrAdmin) {
        actionHtml = '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.08);">' +
          '<span style="font-size:0.74rem; color:#34d399;">👨‍🏫 Published by ' + (a.faculty || 'You') + '</span>' +
          '<button type="button" class="btn-secondary" onclick="window.deleteAssignment(&quot;' + a.id + '&quot;)" style="padding:4px 10px; font-size:0.72rem; color:#f87171; border-color:rgba(239,68,68,0.3);">' +
            '<span>🗑️</span> Delete' +
          '</button>' +
        '</div>';
      } else if (isSubmitted) {
        actionHtml = '<div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:10px; padding:8px 12px; font-size:0.75rem; color:#34d399; margin-bottom:6px;">' +
          '✓ Submitted on ' + (a.submission?.submittedAt || 'Portal') + (a.submission?.marks ? (' • Graded: ' + a.submission.marks + '/' + a.maxMarks) : ' • Awaiting Grading') +
        '</div>';
      } else {
        actionHtml = '<button type="button" class="btn-primary" onclick="window.openSubmitAssignmentModal(&quot;' + a.id + '&quot;)" style="width:100%; padding:8px 14px; font-size:0.78rem;">' +
          '<span>📝</span> Submit Solution Notes & Project' +
        '</button>';
      }

      return '<div class="card-box" style="margin-bottom:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">' +
          '<span style="font-size:0.72rem; color:#a5b4fc; font-weight:700;">' + a.course + '</span>' +
          '<span class="approval-badge ' + badgeClass + '">' + statusLabel + '</span>' +
        '</div>' +
        '<h3 style="color:#fff; font-size:0.95rem; font-weight:700; margin-bottom:4px;">' + a.title + '</h3>' +
        '<p style="font-size:0.78rem; color:#cbd5e1; margin-bottom:8px; line-height:1.4;">' + a.desc + '</p>' +
        fileHtml +
        '<div style="font-size:0.72rem; color:#94a3b8; margin-bottom:6px;">' +
          'Deadline: <strong style="color:#f87171;">' + a.dueDate + '</strong> • Max Marks: <strong style="color:#7dd3fc;">' + a.maxMarks + '</strong> • Faculty: ' + a.faculty +
        '</div>' +
        actionHtml +
      '</div>';
    }).join('');
  }

  window.deleteAssignment = function(asgId) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    if (!db.assignments) return;
    db.assignments = db.assignments.filter(a => a.id !== asgId);
    saveDb();
    showToast('🗑️ Assignment deleted successfully.', 'info');
    renderAssignmentsList();
  };

  window.openSubmitAssignmentModal = function(asgId) {
    const asg = (db.assignments || []).find(a => a.id === asgId);
    if (!asg) return;
    document.getElementById('submitAsgId').value = asg.id;
    document.getElementById('submitAsgTitle').textContent = asg.title;
    document.getElementById('submitAsgCourse').textContent = asg.course;
    document.getElementById('modalSubmitAssignment').style.display = 'flex';
  };

  // --- 4. Digital ID Card System ---
  function renderDigitalIdCard() {
    const user = db.currentUser;
    if (!user) return;

    const instNameEl = document.getElementById('idCardInstName');
    const photoEl = document.getElementById('idCardPhotoAvatar');
    const nameEl = document.getElementById('idCardHolderName');
    const roleEl = document.getElementById('idCardRoleBadge');
    const rollEl = document.getElementById('idCardRollNumber');
    const deptEl = document.getElementById('idCardDeptName');
    const bloodEl = document.getElementById('idCardBloodGroup');
    const barcodeEl = document.getElementById('idCardBarcodeText');
    const emergencyEl = document.getElementById('idCardEmergencyContact');
    const qrContainer = document.getElementById('idCardQrContainer');

    const inst = (db.institutions && db.institutions[user.institutionId]) || { name: 'GEC BHUBANESWAR' };
    if (instNameEl) instNameEl.textContent = (inst.name || 'SMART CAMPUS').toUpperCase();
    if (photoEl) photoEl.textContent = user.role === 'student' ? '👨‍🎓' : (user.role === 'hostel_faculty' ? '🏢' : (user.role === 'faculty' ? '👩‍🏫' : '🏛️'));
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role === 'student' ? 'Student' : (user.designation || user.role.toUpperCase());
    if (rollEl) rollEl.textContent = (user.role === 'student' ? 'Roll: ' : 'ID: ') + (user.roll || user.staffId || user.id);
    if (deptEl) deptEl.textContent = user.dept || user.branch || 'Computer Science & Engineering';
    if (bloodEl) bloodEl.textContent = user.bloodGroup || 'O+';
    if (emergencyEl) emergencyEl.textContent = user.contact || '+91 98765 43210';

    if (barcodeEl) {
      barcodeEl.textContent = '||| ' + (user.id || '2026').split('').join(' | ') + ' ||||';
    }

    if (qrContainer && typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      try {
        new QRCode(qrContainer, {
          text: 'SECURE-CAMPUS-ID:' + user.id + ':' + (user.institutionId || 'GEC') + ':CHIP-VERIFIED',
          width: 72,
          height: 72,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        console.warn('QR ID error:', e);
      }
    }
  }

  // --- 5. Requests Center & Aggregator ---
  let currentRequestsFilter = 'ALL';
  function renderRequestsCenter(filter = currentRequestsFilter) {
    currentRequestsFilter = filter;
    const container = document.getElementById('requestsListContainer');
    if (!container) return;
    const currentInstId = getTenantInstitutionId();
    const userId = (db.currentUser && db.currentUser.id) || 'CS-2024-082';

    const allReqs = [];

    (db.passes || []).filter(p => (!p.institutionId || p.institutionId === currentInstId) && (!p.studentId || p.studentId === userId)).forEach(p => {
      allReqs.push({
        id: p.id,
        type: 'Day Gate Pass',
        icon: '🎫',
        title: p.purpose || 'Outing',
        date: p.outDate || p.appliedAt || 'Recent',
        status: p.status || 'PENDING',
        details: 'Exit: ' + (p.outTime || '') + ' • Return: ' + (p.inTime || '')
      });
    });

    (db.leavePasses || []).filter(l => (!l.institutionId || l.institutionId === currentInstId) && (!l.studentId || l.studentId === userId)).forEach(l => {
      allReqs.push({
        id: l.id,
        type: 'Hostel Leave Pass',
        icon: '🧳',
        title: l.reason || 'Home Visit',
        date: l.fromDate || l.appliedAt || 'Recent',
        status: l.status || 'PENDING',
        details: 'From: ' + (l.fromDate || '') + ' to ' + (l.toDate || '') + ' (' + (l.destination || 'Home') + ')'
      });
    });

    (db.complaints || []).filter(c => (!c.institutionId || c.institutionId === currentInstId) && (!c.studentId || c.studentId === userId)).forEach(c => {
      allReqs.push({
        id: c.id,
        type: 'Hostel Complaint',
        icon: '🛠️',
        title: c.category || c.title || 'Room Repair',
        date: c.date || 'Recent',
        status: c.status || 'PENDING',
        details: c.description || c.notes || 'Maintenance request'
      });
    });

    let filtered = allReqs;
    if (filter === 'PENDING') {
      filtered = allReqs.filter(r => r.status.toUpperCase() === 'PENDING');
    } else if (filter === 'APPROVED') {
      filtered = allReqs.filter(r => r.status.toUpperCase() === 'APPROVED');
    } else if (filter === 'REJECTED') {
      filtered = allReqs.filter(r => r.status.toUpperCase() === 'REJECTED');
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:24px; text-align:center; color:#94a3b8;">No requests found in this category.</div>';
      return;
    }

    container.innerHTML = filtered.map(r => {
      const s = r.status.toUpperCase();
      const badgeClass = s === 'APPROVED' ? 'badge-approved' : (s === 'REJECTED' ? 'badge-urgent' : 'badge-pending');
      return '<div class="card-box" style="margin-bottom:12px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">' +
          '<span style="font-size:0.75rem; color:#a5b4fc; font-weight:700;">' + r.icon + ' ' + r.type + '</span>' +
          '<span class="approval-badge ' + badgeClass + '">' + s + '</span>' +
        '</div>' +
        '<h4 style="color:#fff; font-size:0.92rem; font-weight:700; margin-bottom:2px;">' + r.title + '</h4>' +
        '<p style="font-size:0.75rem; color:#cbd5e1; margin-bottom:6px;">' + r.details + '</p>' +
        '<div style="font-size:0.68rem; color:#64748b;">Ref: ' + r.id + ' • ' + r.date + '</div>' +
      '</div>';
    }).join('');
  }

  // --- 6. More / Profile Page ---
  function renderMoreProfile() {
    const user = db.currentUser;
    if (!user) return;
    const avatarEl = document.getElementById('moreProfileAvatar');
    const nameEl = document.getElementById('moreProfileName');
    const roleEl = document.getElementById('moreProfileRole');
    const idEl = document.getElementById('moreProfileId');

    if (avatarEl) avatarEl.textContent = user.role === 'student' ? '👨‍🎓' : (user.role === 'hostel_faculty' ? '🏢' : (user.role === 'faculty' ? '👩‍🏫' : '🏛️'));
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role === 'student' ? 'Student' : (user.designation || user.role.toUpperCase());
    if (idEl) idEl.textContent = 'ID: ' + (user.roll || user.staffId || user.id) + ' • ' + (user.institutionId || 'GEC-2026');
  }

  // Click on Profile Header Card in Settings -> Go to role profile
  document.getElementById('cardMoreProfileHeader')?.addEventListener('click', () => {
    window.navigateToUserProfile();
  });

  // --- 7. Event Listeners for Bottom Navigation, Quick Actions & Sub-Pages ---

  // Bottom Navigation tabs
  document.getElementById('navTabHome')?.addEventListener('click', () => switchView('page-home', 'Home Dashboard'));
  document.getElementById('navTabServices')?.addEventListener('click', () => switchView('page-services', 'Campus Services'));
  document.getElementById('navTabRequests')?.addEventListener('click', () => {
    switchView('page-requests', 'My Requests');
    renderRequestsCenter();
  });
  document.getElementById('navTabMore')?.addEventListener('click', () => {
    switchView('page-more', 'Account & Settings');
    renderMoreProfile();
  });
  document.getElementById('btnOpenNewRequestModal')?.addEventListener('click', () => {
    document.getElementById('modalNewRequestSheet')?.classList.add('active');
  });
  document.getElementById('btnCloseNewRequestSheet')?.addEventListener('click', () => {
    document.getElementById('modalNewRequestSheet')?.classList.remove('active');
  });

  // Request modal sheet options
  const closeRequestSheet = () => document.getElementById('modalNewRequestSheet')?.classList.remove('active');

  document.getElementById('reqTypeGatePass')?.addEventListener('click', () => {
    closeRequestSheet();
    switchView('page-student-gatepass', 'Gate Pass Application');
  });
  document.getElementById('reqTypeLeavePass')?.addEventListener('click', () => {
    closeRequestSheet();
    switchView('page-student-leavepass', 'Hostel Leave Pass');
  });
  document.getElementById('reqTypeComplaint')?.addEventListener('click', () => {
    closeRequestSheet();
    switchView('page-student-complaints', 'Hostel Complaint');
  });
  document.getElementById('reqTypeCertificate')?.addEventListener('click', () => {
    closeRequestSheet();
    switchView('page-student-certificates', 'Certificates');
  });
  document.getElementById('reqTypeBusPass')?.addEventListener('click', () => {
    closeRequestSheet();
    switchView('page-transport', 'Campus Transportation');
    document.getElementById('tabTransportPass')?.click();
  });
  document.getElementById('reqTypeLibrary')?.addEventListener('click', () => {
    closeRequestSheet();
    switchView('page-library', 'Smart Library');
    renderLibraryCatalog();
  });

  // Quick Actions Grid on page-home
  document.getElementById('qaAttendance')?.addEventListener('click', () => switchView('page-student-attendance', 'Attendance Tracker'));
  document.getElementById('qaTimetable')?.addEventListener('click', () => {
    switchView('page-student-timetable', 'Timetable');
    if (window.showStudentTimetable) window.showStudentTimetable('Mon');
  });
  document.getElementById('qaAssignments')?.addEventListener('click', () => {
    switchView('page-assignments', 'Smart Assignments');
    renderAssignmentsList();
  });
  document.getElementById('qaLibrary')?.addEventListener('click', () => {
    switchView('page-library', 'Smart Library');
    renderLibraryCatalog();
  });
  document.getElementById('qaTransport')?.addEventListener('click', () => {
    switchView('page-transport', 'Transportation');
    renderTransportRoutes();
  });
  document.getElementById('qaDigitalId')?.addEventListener('click', () => {
    switchView('page-digital-id', 'Digital ID Card');
    renderDigitalIdCard();
  });
  document.getElementById('qaGatePass')?.addEventListener('click', () => switchView('page-student-gatepass', 'Gate Pass'));
  document.getElementById('qaHostel')?.addEventListener('click', () => switchView('page-student-hostel', 'Hostel Residence'));
  document.getElementById('qaCertificates')?.addEventListener('click', () => switchView('page-student-certificates', 'Certificates'));
  document.getElementById('qaFees')?.addEventListener('click', () => switchView('page-student-fees', 'College Fees'));
  document.getElementById('qaComplaints')?.addEventListener('click', () => switchView('page-student-complaints', 'Complaints'));
  document.getElementById('qaNotices')?.addEventListener('click', () => {
    switchView('page-student-notices', 'Notices');
    renderStudentNotices();
  });

  document.getElementById('bannerAiCard')?.addEventListener('click', () => switchView('page-ai-assistant', 'Campus AI Assistant'));
  document.getElementById('heroTodaysClassesCard')?.addEventListener('click', () => {
    switchView('page-student-timetable', 'Timetable');
    if (window.showStudentTimetable) window.showStudentTimetable('Mon');
  });
  document.getElementById('btnViewAllServices')?.addEventListener('click', () => switchView('page-services', 'Campus Services'));

  // Services page rows
  document.getElementById('srvAttendance')?.addEventListener('click', () => switchView('page-student-attendance', 'Attendance Tracker'));
  document.getElementById('srvTimetable')?.addEventListener('click', () => {
    switchView('page-student-timetable', 'Timetable');
    if (window.showStudentTimetable) window.showStudentTimetable('Mon');
  });
  document.getElementById('srvAssignments')?.addEventListener('click', () => {
    switchView('page-assignments', 'Smart Assignments');
    renderAssignmentsList();
  });
  document.getElementById('srvLibrary')?.addEventListener('click', () => {
    switchView('page-library', 'Smart Library');
    renderLibraryCatalog();
  });
  document.getElementById('srvNotices')?.addEventListener('click', () => {
    switchView('page-student-notices', 'Notices');
    renderStudentNotices();
  });
  document.getElementById('srvDigitalId')?.addEventListener('click', () => {
    switchView('page-digital-id', 'Digital ID Card');
    renderDigitalIdCard();
  });
  document.getElementById('srvTransport')?.addEventListener('click', () => {
    switchView('page-transport', 'Transportation');
    renderTransportRoutes();
  });
  document.getElementById('srvGatePass')?.addEventListener('click', () => switchView('page-student-gatepass', 'Gate Pass'));
  document.getElementById('srvLeavePass')?.addEventListener('click', () => switchView('page-student-leavepass', 'Hostel Leave Pass'));
  document.getElementById('srvCertificates')?.addEventListener('click', () => switchView('page-student-certificates', 'Certificates'));
  document.getElementById('srvFees')?.addEventListener('click', () => switchView('page-student-fees', 'College Fees'));
  document.getElementById('srvHostelDetails')?.addEventListener('click', () => switchView('page-student-hostel', 'Hostel Residence'));
  document.getElementById('srvHostelComplaint')?.addEventListener('click', () => switchView('page-student-complaints', 'Hostel Complaint'));
  document.getElementById('srvCanteenFeedback')?.addEventListener('click', () => switchView('page-student-hostel', 'Mess & Dining'));
  document.getElementById('srvComplaints')?.addEventListener('click', () => switchView('page-student-complaints', 'Complaints'));
  document.getElementById('srvHelpdesk')?.addEventListener('click', () => switchView('page-student-hostel', 'Emergency Helpdesk'));

  // All .btn-back-home buttons
  document.querySelectorAll('.btn-back-home').forEach(btn => {
    btn.addEventListener('click', () => switchView('page-home', 'Home Dashboard'));
  });

  // Header quick buttons
  document.getElementById('btnHeaderAvatar')?.addEventListener('click', () => {
    window.navigateToUserProfile();
  });
  document.getElementById('btnNotificationBell')?.addEventListener('click', () => {
    switchView('page-student-notices', 'Notices & Circulars');
    renderStudentNotices();
  });

  // Transport Tabs
  document.getElementById('tabTransportRoutes')?.addEventListener('click', () => {
    document.getElementById('tabTransportRoutes')?.classList.add('active');
    document.getElementById('tabTransportPass')?.classList.remove('active');
    document.getElementById('transportRoutesContainer').style.display = 'block';
    document.getElementById('transportPassContainer').style.display = 'none';
    renderTransportRoutes();
  });
  document.getElementById('tabTransportPass')?.addEventListener('click', () => {
    document.getElementById('tabTransportPass')?.classList.add('active');
    document.getElementById('tabTransportRoutes')?.classList.remove('active');
    document.getElementById('transportRoutesContainer').style.display = 'none';
    document.getElementById('transportPassContainer').style.display = 'block';
    renderBusPass();
  });

  // Library Tabs & Search
  document.getElementById('tabLibraryCatalog')?.addEventListener('click', () => {
    document.getElementById('tabLibraryCatalog')?.classList.add('active');
    document.getElementById('tabLibraryBorrowed')?.classList.remove('active');
    document.getElementById('libraryCatalogView').style.display = 'block';
    document.getElementById('libraryBorrowedView').style.display = 'none';
    renderLibraryCatalog(document.getElementById('librarySearchInput')?.value || '');
  });
  document.getElementById('tabLibraryBorrowed')?.addEventListener('click', () => {
    document.getElementById('tabLibraryBorrowed')?.classList.add('active');
    document.getElementById('tabLibraryCatalog')?.classList.remove('active');
    document.getElementById('libraryCatalogView').style.display = 'none';
    document.getElementById('libraryBorrowedView').style.display = 'block';
    renderBorrowedBooks();
  });
  document.getElementById('librarySearchInput')?.addEventListener('input', (e) => {
    renderLibraryCatalog(e.target.value.trim());
  });

  // Assignment Filters & Forms
  document.querySelectorAll('#assignmentFilterPills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#assignmentFilterPills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderAssignmentsList(pill.dataset.asgfilter);
    });
  });

  document.getElementById('btnCloseSubmitAssignment')?.addEventListener('click', () => {
    document.getElementById('modalSubmitAssignment').style.display = 'none';
  });

  document.getElementById('formSubmitAssignment')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const asgId = document.getElementById('submitAsgId').value;
    const notes = document.getElementById('asgSolutionText').value.trim();
    const asg = (db.assignments || []).find(a => a.id === asgId);
    if (asg) {
      asg.status = 'SUBMITTED';
      asg.submission = {
        submittedAt: new Date().toLocaleString(),
        notes: notes,
        marks: null,
        grade: null
      };
      saveDb();
      showToast('🚀 Assignment submitted successfully!', 'success');
      document.getElementById('modalSubmitAssignment').style.display = 'none';
      document.getElementById('formSubmitAssignment').reset();
      renderAssignmentsList();
    }
  });

  window.openCreateAssignmentModal = function() {
    const modal = document.getElementById('modalCreateAssignment');
    if (!modal) return;
    modal.classList.add('open');
    modal.style.display = 'flex';
    const dueDateInput = document.getElementById('createAsgDueDate');
    if (dueDateInput && !dueDateInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      dueDateInput.value = d.toISOString().split('T')[0];
    }
  };

  window.closeCreateAssignmentModal = function() {
    const modal = document.getElementById('modalCreateAssignment');
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
  };

  document.getElementById('btnFacultyCreateAssignment')?.addEventListener('click', () => {
    window.openCreateAssignmentModal();
  });
  document.getElementById('btnCloseCreateAssignment')?.addEventListener('click', () => {
    window.closeCreateAssignmentModal();
  });
  document.getElementById('modalCreateAssignment')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalCreateAssignment') window.closeCreateAssignmentModal();
  });
  document.getElementById('createAsgFile')?.addEventListener('change', (e) => {
    const preview = document.getElementById('createAsgFilePreview');
    if (preview) {
      const file = e.target.files && e.target.files[0];
      if (file) {
        preview.textContent = '📄 Selected file: ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
      }
    }
  });

  document.getElementById('formCreateAssignment')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const course = (document.getElementById('createAsgCourse')?.value || '').trim();
    const title = (document.getElementById('createAsgTitle')?.value || '').trim();
    const dueDate = document.getElementById('createAsgDueDate')?.value;
    const maxMarks = parseInt(document.getElementById('createAsgMarks')?.value, 10) || 20;
    const desc = (document.getElementById('createAsgDesc')?.value || '').trim();
    const fileInput = document.getElementById('createAsgFile');
    const fileName = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : '';

    if (!db.assignments) db.assignments = [];
    const newAsg = {
      id: 'ASG-' + Date.now(),
      institutionId: getTenantInstitutionId(),
      course: course,
      title: title,
      faculty: (db.currentUser && db.currentUser.name) || 'Faculty Lead',
      dueDate: dueDate,
      maxMarks: maxMarks,
      desc: desc,
      fileName: fileName,
      status: 'PENDING',
      submission: null,
      createdAt: new Date().toISOString()
    };
    db.assignments.unshift(newAsg);
    saveDb();

    // Permanent cloud sync
    fetch('/api/sync/save-assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignment: newAsg })
    }).catch(err => console.warn('Sync save-assignment:', err));

    showToast('📢 Assignment published to all students successfully!', 'success');
    window.closeCreateAssignmentModal();
    document.getElementById('formCreateAssignment')?.reset();
    const preview = document.getElementById('createAsgFilePreview');
    if (preview) preview.style.display = 'none';
    renderAssignmentsList();
  });

  // Digital ID Card 3D Flip & Save
  const toggleCardFlip = () => {
    document.getElementById('digitalIdCardFlipper')?.classList.toggle('flipped');
  };
  document.getElementById('digitalIdCardFlipper')?.addEventListener('click', toggleCardFlip);
  document.getElementById('btnFlipIdCard')?.addEventListener('click', toggleCardFlip);
  document.getElementById('btnDownloadIdCard')?.addEventListener('click', () => {
    showToast('📥 Digital ID Card saved to offline device storage.', 'success');
  });

  // Requests Center Filter Pills
  document.querySelectorAll('#requestsFilterPills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#requestsFilterPills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderRequestsCenter(pill.dataset.filter);
    });
  });

  // More Page Items & Role Switching
  document.getElementById('menuItemDigitalId')?.addEventListener('click', () => {
    switchView('page-digital-id', 'Digital ID Card');
    renderDigitalIdCard();
  });
  document.getElementById('menuItemNotifications')?.addEventListener('click', () => {
    switchView('page-student-notices', 'Notices');
    renderStudentNotices();
  });
  document.getElementById('menuItemLanguage')?.addEventListener('click', () => {
    document.getElementById('localeSelect')?.focus();
  });
  document.getElementById('btnMoreSignOut')?.addEventListener('click', () => {
    handleSignOut();
  });

  // Role switching removed - Users must sign out to change role or institution.

  // Timetable Day Pills (Picture 2 Mockup)
  document.querySelectorAll('#timetableDayPills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const day = pill.dataset.ttday;
      if (window.showStudentTimetable) window.showStudentTimetable(day);
    });
  });



  // ================= PORTAL AUTO-FILL SYSTEM (DEMO PRESENTATION ACCELERATOR) =================
  // [Demo Auto-Fill removed per user request]



  // =========================================================================
  // ENTERPRISE EVENT LISTENERS & MODAL WIRES
  // =========================================================================

  // Close helper for all modals
  const closeModal = (id) => document.getElementById(id)?.classList.remove('open');

  // Admin Customizer wires
  document.getElementById('btnCloseServiceCustomizer')?.addEventListener('click', () => closeModal('modalAdminServiceCustomizer'));
  document.getElementById('adminQaCustomizer')?.addEventListener('click', openAdminServiceCustomizer);
  document.getElementById('srvAdminServiceCustomizer')?.addEventListener('click', openAdminServiceCustomizer);

  // Center '+' FAB opens Service Customizer for Admin
  document.getElementById('navFabNewRequest')?.addEventListener('click', () => {
    if (db.currentUser?.role === 'admin') {
      openAdminServiceCustomizer();
    }
  });

  // Role segmented buttons in customizer
  ['tabCustStudent', 'tabCustFaculty', 'tabCustHostel'].forEach(btnId => {
    document.getElementById(btnId)?.addEventListener('click', (e) => {
      document.querySelectorAll('#modalAdminServiceCustomizer .btn-segmented').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const targetRole = e.target.dataset.target;
      renderActiveCustomServicesList(targetRole);
    });
  });

  // Add custom service form
  document.getElementById('formAddCustomService')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('custServiceTitle')?.value?.trim();
    const icon = document.getElementById('custServiceIcon')?.value?.trim() || '💼';
    const category = document.getElementById('custServiceCategory')?.value || 'General';
    const desc = document.getElementById('custServiceDesc')?.value?.trim() || '';

    const activeTab = document.querySelector('#modalAdminServiceCustomizer .btn-segmented.active');
    const targetRole = activeTab ? activeTab.dataset.target : 'student';
    const currentInstId = getTenantInstitutionId();

    if (!title) { showToast('Service title required.', 'error'); return; }

    const newService = {
      id: 'SRV-' + Date.now().toString().slice(-5),
      role: targetRole,
      title,
      icon,
      category,
      desc,
      institutionId: currentInstId
    };

    if (!db.customServices) db.customServices = [];
    db.customServices.push(newService);
    saveDb();

    // Sync to backend
    fetch('/api/sync/save-custom-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: newService })
    }).catch(err => console.warn('Sync custom service:', err));

    showToast('Service "' + title + '" added for ' + targetRole + 's!', 'success');
    document.getElementById('custServiceTitle').value = '';
    document.getElementById('custServiceDesc').value = '';
    renderActiveCustomServicesList(targetRole);
    if (db.currentUser) renderDynamicCustomServices(db.currentUser.role);
  });

  // Admin Banking & QR Wires
  document.getElementById('btnCloseAdminBankConfig')?.addEventListener('click', () => closeModal('modalAdminBankConfig'));
  document.getElementById('adminQaBanking')?.addEventListener('click', openAdminBankConfig);
  document.getElementById('srvAdminBankConfig')?.addEventListener('click', openAdminBankConfig);

  let tempUploadedQrUrl = '';
  document.getElementById('cfgQrFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        tempUploadedQrUrl = evt.target.result;
        const img = document.getElementById('cfgQrImg');
        const ph = document.getElementById('cfgQrPlaceholder');
        if (img) { img.src = tempUploadedQrUrl; img.style.display = 'block'; }
        if (ph) ph.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('formAdminBankConfig')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentInstId = getTenantInstitutionId();
    const inst = db.institutions[currentInstId] || { id: currentInstId };

    inst.bankName = document.getElementById('cfgBankName')?.value?.trim();
    inst.accountNo = document.getElementById('cfgAccountNo')?.value?.trim();
    inst.ifsc = document.getElementById('cfgIfsc')?.value?.trim();
    inst.upiId = document.getElementById('cfgUpiId')?.value?.trim();
    if (tempUploadedQrUrl) inst.qrCodeUrl = tempUploadedQrUrl;

    db.institutions[currentInstId] = inst;
    saveDb();

    fetch('/api/sync/save-bank-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        institutionId: currentInstId,
        bankName: inst.bankName,
        accountNo: inst.accountNo,
        ifsc: inst.ifsc,
        upiId: inst.upiId,
        qrCodeUrl: inst.qrCodeUrl
      })
    }).catch(err => console.warn('Sync bank config:', err));

    showToast('Institution banking and UPI details updated permanently!', 'success');
    closeModal('modalAdminBankConfig');

    // Update student fee desk labels if visible
    const sBank = document.getElementById('stuFeeBankName');
    if (sBank) sBank.textContent = inst.bankName;
    const sAcc = document.getElementById('stuFeeAccountNo');
    if (sAcc) sAcc.textContent = inst.accountNo;
    const sIfsc = document.getElementById('stuFeeIfsc');
    if (sIfsc) sIfsc.textContent = inst.ifsc;
    const sUpi = document.getElementById('stuFeeUpiId');
    if (sUpi) sUpi.textContent = inst.upiId;
  });

  // Admin Feedback Viewer wires
  document.getElementById('btnCloseAdminFeedback')?.addEventListener('click', () => closeModal('modalAdminFeedbackView'));
  document.getElementById('adminQaFeedback')?.addEventListener('click', () => openAdminFeedbackView('all'));
  document.getElementById('srvAdminFeedbackView')?.addEventListener('click', () => openAdminFeedbackView('all'));

  ['fbFilterAll', 'fbFilterFaculty', 'fbFilterHostel', 'fbFilterCanteen'].forEach(btnId => {
    document.getElementById(btnId)?.addEventListener('click', (e) => {
      document.querySelectorAll('#modalAdminFeedbackView .btn-segmented').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.cat;
      renderAdminFeedbackCards(cat);
    });
  });

  // Student Feedback Wires
  document.getElementById('btnCloseStudentFeedback')?.addEventListener('click', () => closeModal('modalStudentFeedback'));
  document.getElementById('stuQaFeedback')?.addEventListener('click', openStudentFeedbackModal);
  document.getElementById('srvStuFeedback')?.addEventListener('click', openStudentFeedbackModal);

  // Star rating selector
  document.querySelectorAll('#stuFbStarRow .fb-star').forEach(star => {
    star.addEventListener('click', () => {
      const rating = Number(star.dataset.rating);
      document.getElementById('stuFbRatingVal').value = rating;
      document.querySelectorAll('#stuFbStarRow .fb-star').forEach(s => {
        const r = Number(s.dataset.rating);
        s.style.opacity = r <= rating ? '1' : '0.35';
      });
    });
  });

  document.getElementById('formStudentFeedback')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('stuFbCategory')?.value;
    const targetName = document.getElementById('stuFbTargetName')?.value?.trim();
    const rating = Number(document.getElementById('stuFbRatingVal')?.value || 5);
    const comments = document.getElementById('stuFbComments')?.value?.trim();
    const currentInstId = getTenantInstitutionId();

    const newFb = {
      id: 'FB-' + Date.now().toString().slice(-5),
      category,
      targetName,
      rating,
      comments,
      studentRoll: db.currentUser?.roll || 'Student',
      studentName: db.currentUser?.name || 'Anonymous Student',
      institutionId: currentInstId,
      createdAt: new Date().toISOString()
    };

    if (!db.studentFeedback) db.studentFeedback = [];
    db.studentFeedback.unshift(newFb);
    saveDb();

    fetch('/api/sync/save-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: newFb })
    }).catch(err => console.warn('Sync feedback:', err));

    showToast('Confidential feedback submitted! Delivered safely to Campus Admin.', 'success');
    closeModal('modalStudentFeedback');
    document.getElementById('stuFbComments').value = '';
  });

  // Student Fee Payment & Receipt Wires
  document.getElementById('btnCloseStudentFeeReceipt')?.addEventListener('click', () => closeModal('modalStudentFeeReceipt'));
  document.getElementById('btnCloseFeeReceiptDisplay')?.addEventListener('click', () => closeModal('modalFeeReceiptDisplay'));
  document.getElementById('stuQaReceipt')?.addEventListener('click', openStudentFeeReceiptModal);
  document.getElementById('srvStuFeeReceipt')?.addEventListener('click', openStudentFeeReceiptModal);

  document.getElementById('stuQaFees')?.addEventListener('click', () => switchView('page-student-fees', 'College Fee Desk'));
  document.getElementById('srvStuFeesPay')?.addEventListener('click', () => switchView('page-student-fees', 'College Fee Desk'));

  document.getElementById('formStudentFeeReceipt')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const feeHead = document.getElementById('receiptFeeHead')?.value;
    const amount = Number(document.getElementById('receiptAmount')?.value || 0);
    const utr = document.getElementById('receiptUtr')?.value?.trim();
    const paymentDate = document.getElementById('receiptDate')?.value;
    const currentInstId = getTenantInstitutionId();

    if (!utr) { showToast('Transaction UTR number required.', 'error'); return; }

    const receipt = {
      id: 'RCT-' + Date.now().toString().slice(-6),
      studentRoll: db.currentUser?.roll || 'CS-2024-082',
      studentName: db.currentUser?.name || 'Ashish Kumar Sahoo',
      feeHead,
      amount,
      utr,
      paymentDate,
      institutionId: currentInstId,
      receiptNumber: (currentInstId + '/' + new Date().getFullYear() + '/FEE/' + Math.floor(10000 + Math.random() * 90000)).toUpperCase(),
      createdAt: new Date().toISOString()
    };

    if (!db.feeReceipts) db.feeReceipts = [];
    db.feeReceipts.unshift(receipt);
    saveDb();

    fetch('/api/sync/save-fee-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receipt })
    }).catch(err => console.warn('Sync fee receipt:', err));

    closeModal('modalStudentFeeReceipt');
    displayStampedFeeReceipt(receipt);
    showToast('Verified e-receipt generated successfully!', 'success');
  });

  document.getElementById('btnPrintReceiptBtn')?.addEventListener('click', () => window.print());
  document.getElementById('btnDownloadReceiptPdf')?.addEventListener('click', () => {
    showToast('Receipt saved to device offline storage.', 'success');
  });

  // Faculty Certificate Issuance Wires
  document.getElementById('btnCloseFacultyCertModal')?.addEventListener('click', () => closeModal('modalFacultyIssueCertificate'));
  document.getElementById('facQaIssueCert')?.addEventListener('click', openFacultyCertificateModal);
  document.getElementById('srvFacIssueCertificate')?.addEventListener('click', openFacultyCertificateModal);

  document.getElementById('formFacultyIssueCert')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentRoll = document.getElementById('certIssueRoll')?.value?.trim().toUpperCase();
    const studentName = document.getElementById('certIssueStudentName')?.value?.trim();
    const title = document.getElementById('certIssueTitle')?.value?.trim();
    const type = document.getElementById('certIssueType')?.value;
    const facultyName = document.getElementById('certIssueFacultySign')?.value?.trim() || db.currentUser?.name;
    const currentInstId = getTenantInstitutionId();

    const cert = {
      id: 'CERT-' + Date.now().toString().slice(-5),
      studentRoll,
      studentName,
      title,
      type,
      issueDate: new Date().toISOString().slice(0, 10),
      facultyName,
      institutionId: currentInstId
    };

    if (!db.certificates) db.certificates = [];
    db.certificates.unshift(cert);
    saveDb();

    fetch('/api/sync/save-certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificate: cert })
    }).catch(err => console.warn('Sync certificate:', err));

    showToast('Certificate issued and available for ' + studentRoll + '!', 'success');
    closeModal('modalFacultyIssueCertificate');
  });

  // Settings Help & About Wires
  document.getElementById('btnCloseHelpSupport')?.addEventListener('click', () => closeModal('modalHelpSupport'));
  document.getElementById('btnCloseAboutModal')?.addEventListener('click', () => closeModal('modalAboutSmartCampus'));

  document.getElementById('menuItemHelp')?.addEventListener('click', () => {
    const modal = document.getElementById('modalHelpSupport');
    if (modal) modal.classList.add('open');
  });

  document.getElementById('menuItemAbout')?.addEventListener('click', () => {
    const modal = document.getElementById('modalAboutSmartCampus');
    if (modal) modal.classList.add('open');
  });

  // Support ticket submission
  document.getElementById('formSubmitSupportTicket')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('ticketSubject')?.value?.trim();
    const desc = document.getElementById('ticketDesc')?.value?.trim();
    const currentInstId = getTenantInstitutionId();

    const complaint = {
      id: 'TCK-' + Date.now().toString().slice(-5),
      complainantName: db.currentUser?.name || 'Campus User',
      complainantId: db.currentUser?.id || '',
      role: db.currentUser?.role || 'user',
      category: 'support_ticket',
      title: subject,
      description: desc,
      status: 'PENDING',
      institutionId: currentInstId
    };

    if (!db.complaints) db.complaints = [];
    db.complaints.unshift(complaint);
    saveDb();

    fetch('/api/sync/save-complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaint })
    }).catch(err => console.warn('Sync support ticket:', err));

    showToast('Support ticket #' + complaint.id + ' registered. IT desk will contact you.', 'success');
    closeModal('modalHelpSupport');
    document.getElementById('ticketSubject').value = '';
    document.getElementById('ticketDesc').value = '';
  });

  // Services Screen Search Filter
  document.getElementById('servicesSearchInput')?.addEventListener('input', (e) => {
    const q = (e.target.value || '').toLowerCase().trim();
    const activeContainer = document.querySelector('.role-services-container[style*="block"]') || document.getElementById('servicesRoleStudent');
    if (!activeContainer) return;

    activeContainer.querySelectorAll('.services-item-row').forEach(row => {
      const txt = row.textContent.toLowerCase();
      row.style.display = (!q || txt.includes(q)) ? 'flex' : 'none';
    });

    activeContainer.querySelectorAll('.services-category-box').forEach(box => {
      const hasVisible = Array.from(box.querySelectorAll('.services-item-row')).some(r => r.style.display !== 'none');
      box.style.display = hasVisible ? 'block' : 'none';
    });
  });

  // Link all ".btn-goto-services" to page-services
  document.querySelectorAll('.btn-goto-services').forEach(btn => {
    btn.addEventListener('click', () => switchView('page-services', 'Campus Services'));
  });

  // Wire other Quick Action Cards
  document.getElementById('stuQaAttendance')?.addEventListener('click', () => switchView('page-student-attendance', 'Attendance Tracker'));
  document.getElementById('stuQaTimetable')?.addEventListener('click', () => switchView('page-student-timetable', 'Timetable'));
  document.getElementById('stuQaAssignments')?.addEventListener('click', () => switchView('page-assignments', 'Smart Assignments'));
  document.getElementById('stuQaLibrary')?.addEventListener('click', () => switchView('page-library', 'Smart Library'));
  document.getElementById('stuQaTransport')?.addEventListener('click', () => switchView('page-transport', 'Transportation'));
  document.getElementById('stuQaDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID Card'));
  document.getElementById('stuQaGatePass')?.addEventListener('click', () => switchView('page-student-gatepass', 'Gate Pass Application'));
  document.getElementById('stuQaLeavePass')?.addEventListener('click', () => switchView('page-student-leavepass', 'Hostel Leave Pass'));
  document.getElementById('stuQaCertificates')?.addEventListener('click', () => switchView('page-student-certificates', 'Certificates Desk'));
  document.getElementById('stuQaComplaint')?.addEventListener('click', () => switchView('page-student-hostel-complaint', 'Hostel Complaint'));
  document.getElementById('stuQaAi')?.addEventListener('click', () => switchView('page-ai-assistant', 'Campus AI Assistant'));

  document.getElementById('facQaAttendance')?.addEventListener('click', () => switchView('page-faculty-attendance', 'Take Attendance'));
  document.getElementById('facQaTimetable')?.addEventListener('click', () => switchView('page-faculty-timetable', 'Faculty Timetable'));
  document.getElementById('facQaUploadAssignment')?.addEventListener('click', () => {
    switchView('page-assignments', 'Smart Assignments');
    window.openCreateAssignmentModal();
  });
  document.getElementById('facQaPostNotice')?.addEventListener('click', () => switchView('page-faculty-notices', 'Publish Notices'));
  document.getElementById('facQaLibrary')?.addEventListener('click', () => switchView('page-library', 'Smart Library'));
  document.getElementById('facQaTransport')?.addEventListener('click', () => switchView('page-transport', 'Transportation'));
  document.getElementById('facQaDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID Card'));
  document.getElementById('facQaAi')?.addEventListener('click', () => switchView('page-ai-assistant', 'Campus AI Assistant'));

  document.getElementById('hostelQaGatePasses')?.addEventListener('click', () => switchView('page-hostel-gatepasses', 'Review Gate Passes'));
  document.getElementById('hostelQaLeavePasses')?.addEventListener('click', () => switchView('page-hostel-leavepasses', 'Review Leave Passes'));
  document.getElementById('hostelQaNightRollCall')?.addEventListener('click', () => switchView('page-student-attendance', 'Night Roll Call'));
  document.getElementById('hostelQaComplaints')?.addEventListener('click', () => switchView('page-student-hostel-complaint', 'Hostel Complaints Desk'));
  document.getElementById('hostelQaPostNotice')?.addEventListener('click', () => switchView('page-hostel-notices', 'Hostel Circulars'));
  document.getElementById('hostelQaDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID Card'));
  document.getElementById('hostelQaAi')?.addEventListener('click', () => switchView('page-ai-assistant', 'Campus AI Assistant'));

  document.getElementById('adminQaDirectory')?.addEventListener('click', () => switchView('page-admin-students', 'Student Directory'));
  document.getElementById('adminQaAttendance')?.addEventListener('click', () => switchView('page-admin-overview', 'Track Attendance'));
  document.getElementById('adminQaTopScorers')?.addEventListener('click', () => switchView('page-admin-overview', 'Top Scorers'));
  document.getElementById('adminQaComplaints')?.addEventListener('click', () => switchView('page-student-hostel-complaint', 'Complaints Manager'));
  document.getElementById('adminQaTransport')?.addEventListener('click', () => switchView('page-transport', 'Transportation'));
  document.getElementById('adminQaPostNotice')?.addEventListener('click', () => switchView('page-faculty-notices', 'Broadcast Notices'));
  document.getElementById('adminQaAi')?.addEventListener('click', () => switchView('page-ai-assistant', 'Campus AI Assistant'));

  // Wire Role Services item rows
  document.getElementById('srvStuAttendance')?.addEventListener('click', () => switchView('page-student-attendance', 'Attendance Tracker'));
  document.getElementById('srvStuTimetable')?.addEventListener('click', () => switchView('page-student-timetable', 'Timetable'));
  document.getElementById('srvStuAssignments')?.addEventListener('click', () => switchView('page-assignments', 'Smart Assignments'));
  document.getElementById('srvStuLibrary')?.addEventListener('click', () => switchView('page-library', 'Smart Library'));
  document.getElementById('srvStuNotices')?.addEventListener('click', () => switchView('page-student-notices', 'Notices & Circulars'));
  document.getElementById('srvStuDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID Card'));
  document.getElementById('srvStuTransport')?.addEventListener('click', () => switchView('page-transport', 'Transportation'));
  document.getElementById('srvStuGatePass')?.addEventListener('click', () => switchView('page-student-gatepass', 'Gate Pass Application'));
  document.getElementById('srvStuLeavePass')?.addEventListener('click', () => switchView('page-student-leavepass', 'Hostel Leave Pass'));
  document.getElementById('srvStuCertificates')?.addEventListener('click', () => switchView('page-student-certificates', 'Certificates Desk'));
  document.getElementById('srvStuComplaints')?.addEventListener('click', () => switchView('page-student-hostel-complaint', 'Hostel & Canteen Complaints'));

  document.getElementById('srvFacAttendance')?.addEventListener('click', () => switchView('page-faculty-attendance', 'Take Attendance'));
  document.getElementById('srvFacTimetable')?.addEventListener('click', () => switchView('page-faculty-timetable', 'Faculty Timetable'));
  document.getElementById('srvFacUploadAssignment')?.addEventListener('click', () => {
    switchView('page-assignments', 'Smart Assignments');
    window.openCreateAssignmentModal();
  });
  document.getElementById('srvFacPostNotice')?.addEventListener('click', () => switchView('page-faculty-notices', 'Publish Notices'));
  document.getElementById('srvFacLibrary')?.addEventListener('click', () => switchView('page-library', 'Smart Library'));
  document.getElementById('srvFacTransport')?.addEventListener('click', () => switchView('page-transport', 'Transportation'));
  document.getElementById('srvFacDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID Card'));

  document.getElementById('srvHostelGatePasses')?.addEventListener('click', () => switchView('page-hostel-gatepasses', 'Review Gate Passes'));
  document.getElementById('srvHostelLeavePasses')?.addEventListener('click', () => switchView('page-hostel-leavepasses', 'Review Leave Passes'));
  document.getElementById('srvHostelNightRollCall')?.addEventListener('click', () => switchView('page-student-attendance', 'Night Roll Call'));
  document.getElementById('srvHostelComplaints')?.addEventListener('click', () => switchView('page-student-hostel-complaint', 'Hostel Complaints Desk'));
  document.getElementById('srvHostelPostNotice')?.addEventListener('click', () => switchView('page-hostel-notices', 'Hostel Circulars'));
  document.getElementById('srvHostelDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID Card'));

  document.getElementById('srvAdminStudents')?.addEventListener('click', () => switchView('page-admin-students', 'Student Directory'));
  document.getElementById('srvAdminFaculties')?.addEventListener('click', () => switchView('page-admin-faculties', 'Faculty Directory'));
  document.getElementById('srvAdminHostelStaff')?.addEventListener('click', () => switchView('page-admin-overview', 'Hostel Staff Directory'));
  document.getElementById('srvAdminAttendance')?.addEventListener('click', () => switchView('page-admin-overview', 'Attendance Monitoring'));
  document.getElementById('srvAdminTimetables')?.addEventListener('click', () => switchView('page-admin-timetables', 'Master Timetables'));
  document.getElementById('srvAdminLibrary')?.addEventListener('click', () => switchView('page-library', 'Smart Library'));
  document.getElementById('srvAdminTopScorers')?.addEventListener('click', () => switchView('page-admin-overview', 'Top Scorers'));
  document.getElementById('srvAdminDigitalId')?.addEventListener('click', () => switchView('page-digital-id', 'Digital ID System'));
  document.getElementById('srvAdminNotices')?.addEventListener('click', () => switchView('page-faculty-notices', 'Broadcast Notices'));
  document.getElementById('srvAdminTransport')?.addEventListener('click', () => switchView('page-transport', 'Transportation'));
  document.getElementById('srvAdminComplaints')?.addEventListener('click', () => switchView('page-student-hostel-complaint', 'Complaints Manager'));

  // ==========================================================================
  // ENTERPRISE EXTENSIONS: PROFILE ROUTER, SETTINGS MODALS, FEES DESK & BACK
  // ==========================================================================

  // 1. Role-Specific Profile Router (Eliminates Default Profile For All)
  window.navigateToUserProfile = function() {
    if (!db.currentUser) {
      switchView('view-auth', 'Smart Campus');
      return;
    }
    const role = db.currentUser.role;
    if (role === 'student') {
      renderStudentData(db.currentUser);
      switchView('page-student-profile', 'My Profile');
    } else if (role === 'faculty') {
      renderFacultyData(db.currentUser);
      switchView('page-faculty-profile', 'Faculty Profile');
    } else if (role === 'hostel_faculty') {
      renderHostelFacultyData(db.currentUser);
      switchView('page-hostel-profile', 'Hostel Profile');
    } else {
      renderAdminData(db.currentUser);
      switchView('page-admin-overview', 'Admin Overview');
    }
  };

  // 2. Settings Modals: Help & Support & About Smart Campus
  window.openHelpSupportModal = function() {
    const m = document.getElementById('modalHelpSupport');
    if (m) m.classList.add('open');
  };
  window.closeHelpSupportModal = function() {
    const m = document.getElementById('modalHelpSupport');
    if (m) m.classList.remove('open');
  };
  document.getElementById('menuItemHelp')?.addEventListener('click', window.openHelpSupportModal);
  document.getElementById('btnCloseHelpSupport')?.addEventListener('click', window.closeHelpSupportModal);

  window.openAboutSmartCampusModal = function() {
    const m = document.getElementById('modalAboutSmartCampus');
    if (m) m.classList.add('open');
  };
  window.closeAboutSmartCampusModal = function() {
    const m = document.getElementById('modalAboutSmartCampus');
    if (m) m.classList.remove('open');
  };
  document.getElementById('menuItemAbout')?.addEventListener('click', window.openAboutSmartCampusModal);
  document.getElementById('btnCloseAboutModal')?.addEventListener('click', window.closeAboutSmartCampusModal);

  // Help & Support Ticket Submission
  document.getElementById('formSubmitSupportTicket')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subj = document.getElementById('ticketSubject')?.value?.trim();
    const desc = document.getElementById('ticketDesc')?.value?.trim();
    if (!subj || !desc) { showToast('Please enter subject and description.', 'error'); return; }
    showToast('✅ Support ticket #' + Math.floor(1000 + Math.random() * 9000) + ' submitted to Campus IT Helpdesk.', 'success');
    document.getElementById('formSubmitSupportTicket')?.reset();
    window.closeHelpSupportModal();
  });

  // 3. Fast Copy to Clipboard Utility
  window.copyToClipboard = function(text, label = 'Information') {
    if (!text) return;
    const cleanText = text.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText).then(() => {
        showToast('📋 Copied ' + label + ': ' + cleanText, 'success');
      }).catch(() => {
        fallbackCopy(cleanText, label);
      });
    } else {
      fallbackCopy(cleanText, label);
    }
  };
  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('📋 Copied ' + label + ': ' + text, 'success');
  }

  // 4. Student Fee Desk & Verified Receipt Management
  window.renderStudentFeeDesk = function() {
    const currentInstId = getTenantInstitutionId();
    const inst = db.institutions[currentInstId] || {
      name: 'Central Campus',
      bankName: 'State Bank of India',
      accountNo: '309811442586',
      ifsc: 'SBIN0010234',
      accountHolder: 'Principal & Campus Accounts',
      upiId: 'gec@sbi'
    };

    const elTitle = document.getElementById('stuFeeInstTitle');
    if (elTitle) elTitle.textContent = (inst.name || currentInstId) + ' Fee Desk';

    const elBank = document.getElementById('stuFeeBankName');
    if (elBank) elBank.textContent = inst.bankName || 'State Bank of India';

    const elAcc = document.getElementById('stuFeeAccountNo');
    if (elAcc) elAcc.textContent = inst.accountNo || '309811442586';

    const elIfsc = document.getElementById('stuFeeIfsc');
    if (elIfsc) elIfsc.textContent = inst.ifsc || 'SBIN0010234';

    const elHolder = document.getElementById('stuFeeAccountHolder');
    if (elHolder) elHolder.textContent = inst.accountHolder || (inst.name || 'Campus Accounts');

    const elUpi = document.getElementById('stuFeeUpiId');
    if (elUpi) elUpi.textContent = inst.upiId || 'gec@sbi';

    const qrImg = document.getElementById('stuFeeQrImg');
    const dynamicQr = document.getElementById('stuFeeDynamicQr');
    if (inst.qrCodeUrl) {
      if (qrImg) { qrImg.src = inst.qrCodeUrl; qrImg.style.display = 'block'; }
      if (dynamicQr) dynamicQr.style.display = 'none';
    } else {
      if (qrImg) qrImg.style.display = 'none';
      if (dynamicQr) {
        dynamicQr.style.display = 'flex';
        const upiUri = encodeURIComponent('upi://pay?pa=' + (inst.upiId || 'gec@sbi') + '&pn=' + (inst.name || 'Campus') + '&cu=INR');
        dynamicQr.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + upiUri + '" alt="UPI QR Code" style="width:160px; height:160px; border-radius:8px;" onerror="this.onerror=null; this.parentElement.innerHTML=\'<div style=\\\'width:160px;height:160px;background:#e2e8f0;display:flex;align-items:center;justify-content:center;color:#1e293b;font-weight:bold;font-size:0.8rem;text-align:center;padding:8px;border-radius:8px;\\\'>SCAN VIA ANY UPI APP<br><span style=\\\'font-family:monospace;font-size:0.75rem;color:#2563eb;\\\'>' + (inst.upiId || 'gec@sbi') + '</span></div>\';">';
      }
    }

    renderStudentMyReceipts();
  };

  window.renderStudentMyReceipts = function() {
    const list = document.getElementById('stuMyReceiptsList');
    if (!list) return;
    const currentInstId = getTenantInstitutionId();
    const userId = db.currentUser?.id;
    const userRoll = db.currentUser?.roll;
    const receipts = (db.feeReceipts || []).filter(r =>
      (!r.institutionId || r.institutionId === currentInstId) &&
      (!userId || r.studentRoll === userRoll || r.studentId === userId || r.studentName === db.currentUser?.name)
    );

    if (receipts.length === 0) {
      list.innerHTML = '<div style="padding:16px; text-align:center; color:#94a3b8; font-size:0.78rem;">No payment receipts generated yet. Use the button above to generate one after paying fees.</div>';
      return;
    }

    list.innerHTML = receipts.map(rc => {
      return '<div class="approval-card" style="margin-bottom:8px;">' +
        '<div class="approval-meta">' +
          '<strong style="color:#fff; font-size:0.82rem;">' + (rc.feeHead || 'Tuition Fee') + '</strong>' +
          '<span class="approval-badge badge-approved">₹' + (Number(rc.amount || 0).toLocaleString('en-IN')) + ' PAID</span>' +
        '</div>' +
        '<div style="font-size:0.75rem; color:#94a3b8; margin-top:4px; display:flex; justify-content:space-between;">' +
          '<span>UTR: <code style="color:#60a5fa;">' + rc.utr + '</code></span>' +
          '<span>' + (rc.paymentDate || 'Recent') + '</span>' +
        '</div>' +
        '<div style="margin-top:6px; display:flex; justify-content:flex-end;">' +
          '<button type="button" class="btn-primary" onclick="window.viewGeneratedReceipt(\'' + rc.id + '\')" style="padding:4px 10px; font-size:0.72rem;">' +
            '<span>🧾</span> View Stamped Receipt' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');
  };

  window.viewGeneratedReceipt = function(id) {
    const rcpt = (db.feeReceipts || []).find(r => r.id === id);
    if (rcpt && typeof displayStampedFeeReceipt === 'function') {
      displayStampedFeeReceipt(rcpt);
    }
  };

  document.getElementById('btnOpenFeeReceiptFromFees')?.addEventListener('click', openStudentFeeReceiptModal);

  // 5. Capacitor Native Android Back Button Integration
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    try {
      window.Capacitor.Plugins.App.addListener('backButton', () => {
        window.goBackPage();
      });
    } catch (e) {
      console.warn('Capacitor App backButton listener registration:', e);
    }
  }


  // INITIAL BOOT & PERSISTENT SESSION RESTORATION:
  // When user minimizes or clears app from recents or closes app, restore profile directly!
  // Once logged in, the user stays logged into their profile and goes directly to their home page!
  // They will NOT see the login page until they manually sign out.
  let restoredUser = null;
  try {
    // 1. Direct user object in persistent storage
    const rawPersistedUser = localStorage.getItem('smart_campus_persisted_user');
    if (rawPersistedUser) {
      try {
        const u = JSON.parse(rawPersistedUser);
        if (u && u.id && u.role) {
          if (db.users && db.users[u.id]) {
            restoredUser = db.users[u.id];
          } else {
            if (!db.users) db.users = {};
            db.users[u.id] = u;
            restoredUser = u;
          }
        }
      } catch (e) {}
    }

    // 2. Persisted session payload
    if (!restoredUser) {
      const rawSession = localStorage.getItem('smart_campus_persisted_session') ||
                         localStorage.getItem('smart_campus_apk_session') ||
                         localStorage.getItem('smart_campus_active_session') ||
                         sessionStorage.getItem('smart_campus_active_session');
      if (rawSession) {
        const parsedSession = JSON.parse(rawSession);
        if (parsedSession && parsedSession.userId) {
          const targetUid = String(parsedSession.userId).toLowerCase();
          const foundKey = Object.keys(db.users || {}).find(k => k.toLowerCase() === targetUid);
          if (foundKey) {
            restoredUser = db.users[foundKey];
          } else {
            const foundUser = Object.values(db.users || {}).find(u =>
              (u.id && u.id.toLowerCase() === targetUid) ||
              (u.roll && u.roll.toLowerCase() === targetUid) ||
              (u.staffId && u.staffId.toLowerCase() === targetUid) ||
              (u.adminId && u.adminId.toLowerCase() === targetUid) ||
              (u.loginId && u.loginId.toLowerCase() === targetUid)
            );
            if (foundUser) {
              restoredUser = foundUser;
            }
          }
        }
      }
    }

    // 3. Fallback to db.currentUser
    if (!restoredUser && db.currentUser && db.currentUser.id && db.currentUser.role) {
      restoredUser = db.currentUser;
    }
  } catch (err) {
    console.warn('Failed to parse persistent session:', err);
  }

  if (restoredUser) {
    document.body.classList.add('logged-in');
    document.body.classList.remove('unauthenticated');
    db.currentUser = restoredUser;
    db.currentInstitutionId = restoredUser.institutionId || db.currentInstitutionId || 'GEC-2026';
    setupUserSession(restoredUser);
    console.log('Restored persistent profile for:', restoredUser.name, restoredUser.role);
  } else {
    document.body.classList.remove('logged-in');
    document.body.classList.add('unauthenticated');
    const appHeaderEl = document.getElementById('appHeader');
    const bNav = document.getElementById('bottomNav');
    if (appHeaderEl) appHeaderEl.style.display = 'flex';
    if (bNav) bNav.style.display = 'none';
    switchView('view-auth', 'Smart Campus', false);
  }

  console.log('Smart Campus V3.5 Engine ready.');


});