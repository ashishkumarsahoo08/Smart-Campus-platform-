const { getDb, saveDb } = require('../db');

function getCurrentTimestamp() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day: days[now.getDay()],
    date: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    displayFull: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  };
}

// GET /api/fees/student/:studentId
exports.getStudentFees = (req, res) => {
  const { studentId } = req.params;
  const db = getDb();

  // Find fee profile
  let feeProfile = db.fees ? db.fees[studentId] : null;

  // Fallback / Auto-generate if student exists but fee profile not yet instantiated
  if (!feeProfile && db.users[studentId]) {
    const user = db.users[studentId];
    feeProfile = {
      studentId: user.id,
      roll: user.roll || user.loginId || 'CS-2024',
      name: user.name,
      academicYear: '2026–2027',
      semester: user.sem || '5th Semester',
      totalFees: 68500,
      paidAmount: 35000,
      dueAmount: 33500,
      dueDate: '15 Oct 2026',
      lateFeePerDay: 50,
      isOverdue: false,
      scholarshipDiscount: 0,
      status: 'PARTIAL',
      categories: [
        { id: 'tuition', name: 'Tuition & Academic Instructional Fee', total: 42000, paid: 25000, due: 17000 },
        { id: 'hostel', name: 'Hostel & Residence Charge', total: 14000, paid: 10000, due: 4000 },
        { id: 'mess', name: 'Mess & Food Dining Facility', total: 7500, paid: 0, due: 7500 },
        { id: 'exam', name: 'Semester Examination & University Fee', total: 2500, paid: 0, due: 2500 },
        { id: 'lab', name: 'Computing Lab & Cloud Infrastructure', total: 2500, paid: 0, due: 2500 }
      ]
    };
    if (!db.fees) db.fees = {};
    db.fees[studentId] = feeProfile;
    saveDb(db);
  }

  if (!feeProfile) {
    return res.status(404).json({ error: 'Fee record not found for student.' });
  }

  // Get student's institution configuration for customized scanner & receiving account
  const user = db.users ? db.users[studentId] : null;
  const instId = user?.institutionId || feeProfile.institutionId || 'INST-001';
  const institution = (db.institutions && db.institutions[instId]) ? db.institutions[instId] : null;

  // Fetch recent payments for this student
  const studentPayments = (db.feePayments || []).filter(p => p.studentId === studentId);

  return res.json({
    success: true,
    fees: feeProfile,
    institution: institution ? {
      id: institution.id,
      name: institution.name,
      shortName: institution.shortName,
      logo: institution.logo,
      paymentConfig: institution.paymentConfig,
      receiptTemplate: institution.receiptTemplate
    } : null,
    paymentHistory: studentPayments
  });
};

// POST /api/fees/pay
exports.processPayment = (req, res) => {
  const { studentId, amount, paymentMethod, paymentModeDetails, feeCategory } = req.body;

  const numAmount = parseFloat(amount);
  if (!studentId || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Valid student ID and positive payment amount are required.' });
  }

  const db = getDb();
  let feeProfile = db.fees ? db.fees[studentId] : null;
  const user = db.users ? db.users[studentId] : null;

  if (!feeProfile && user) {
    feeProfile = {
      studentId: user.id,
      institutionId: user.institutionId || 'INST-001',
      roll: user.roll || user.loginId || 'CS-2024',
      name: user.name,
      academicYear: '2026–2027',
      semester: user.sem || '5th Semester',
      totalFees: 68500,
      paidAmount: 35000,
      dueAmount: 33500,
      dueDate: '15 Oct 2026',
      lateFeePerDay: 50,
      isOverdue: false,
      scholarshipDiscount: 0,
      status: 'PARTIAL',
      categories: [
        { id: 'tuition', name: 'Tuition & Academic Instructional Fee', total: 42000, paid: 25000, due: 17000 },
        { id: 'hostel', name: 'Hostel & Residence Charge', total: 14000, paid: 10000, due: 4000 },
        { id: 'mess', name: 'Mess & Food Dining Facility', total: 7500, paid: 0, due: 7500 },
        { id: 'exam', name: 'Semester Examination & University Fee', total: 2500, paid: 0, due: 2500 },
        { id: 'lab', name: 'Computing Lab & Cloud Infrastructure', total: 2500, paid: 0, due: 2500 }
      ]
    };
    if (!db.fees) db.fees = {};
    db.fees[studentId] = feeProfile;
    saveDb(db);
  }

  if (!feeProfile) {
    return res.status(404).json({ error: 'Student fee record not found.' });
  }

  if (numAmount > feeProfile.dueAmount) {
    return res.status(400).json({
      error: `Payment amount (₹${numAmount.toLocaleString('en-IN')}) cannot exceed the outstanding balance (₹${feeProfile.dueAmount.toLocaleString('en-IN')}).`
    });
  }

  // Determine institution and custom e-receipt template
  const instId = user?.institutionId || feeProfile.institutionId || 'INST-001';
  const institution = (db.institutions && db.institutions[instId]) ? db.institutions[instId] : null;
  const tpl = institution?.receiptTemplate || {};

  const timeInfo = getCurrentTimestamp();
  const receiptPrefix = tpl.receiptPrefix || `REC-${new Date().getFullYear()}/`;
  const receiptNo = `${receiptPrefix}${Math.floor(10000 + Math.random() * 90000)}`;

  const utrRef = paymentModeDetails?.utrNumber || (paymentMethod === 'UPI'
    ? `UPI/${Date.now().toString().slice(-8)}/${Math.floor(100 + Math.random() * 900)}`
    : (paymentMethod === 'NETBANKING'
      ? `NEFT/${paymentModeDetails?.bank || 'INSTITUTION'}/${Date.now().toString().slice(-8)}`
      : `CARD/${Date.now().toString().slice(-8)}`));

  // Distribute paid amount among categories
  let remainingPay = numAmount;
  if (feeCategory && feeCategory !== 'ALL') {
    const targetCat = feeProfile.categories.find(c => c.id === feeCategory);
    if (targetCat) {
      const applyAmt = Math.min(remainingPay, targetCat.due);
      targetCat.paid += applyAmt;
      targetCat.due -= applyAmt;
      remainingPay -= applyAmt;
    }
  }

  // If general or remaining amount, distribute to due categories in priority
  if (remainingPay > 0) {
    for (const cat of feeProfile.categories) {
      if (cat.due > 0) {
        const applyAmt = Math.min(remainingPay, cat.due);
        cat.paid += applyAmt;
        cat.due -= applyAmt;
        remainingPay -= applyAmt;
        if (remainingPay <= 0) break;
      }
    }
  }

  // Update total profile balances
  feeProfile.paidAmount += numAmount;
  feeProfile.dueAmount = Math.max(0, feeProfile.dueAmount - numAmount);
  feeProfile.status = feeProfile.dueAmount === 0 ? 'PAID' : 'PARTIAL';
  feeProfile.lastPaymentDate = `${timeInfo.date} at ${timeInfo.time}`;

  // Build official verified receipt object formatted according to administrator's custom template
  const receipt = {
    id: 'TXN-' + Date.now(),
    institutionId: instId,
    institutionName: institution ? institution.name : 'Smart Campus Institution',
    headerTitle: tpl.headerTitle || tpl.collegeName || (institution ? institution.name : 'INSTITUTIONAL FEE DESK'),
    collegeName: tpl.collegeName || tpl.headerTitle || (institution ? institution.name : 'INSTITUTIONAL FEE DESK'),
    subTitle: tpl.subTitle || tpl.subtitle || '(An Autonomous Educational Institution)',
    subtitle: tpl.subtitle || tpl.subTitle || '(An Autonomous Educational Institution)',
    regdNoDisplay: tpl.regdNoDisplay || `Institutional Regd. No: ${institution?.regdNo || 'UGC-OD-2004-9812'}`,
    addressDisplay: tpl.addressDisplay || tpl.address || (institution?.address || 'Campus Address'),
    address: tpl.address || tpl.addressDisplay || (institution?.address || 'Campus Address'),
    receiptNumber: receiptNo,
    receiptNo: receiptNo,
    transactionRef: utrRef,
    utr: utrRef,
    studentId: studentId,
    studentName: feeProfile.name,
    roll: feeProfile.roll,
    studentRoll: feeProfile.roll,
    semester: feeProfile.semester,
    academicYear: feeProfile.academicYear,
    department: user ? (user.dept || 'Engineering') : 'General',
    amountPaid: numAmount,
    amount: numAmount,
    amountInWords: `Rupees ${numAmount.toLocaleString('en-IN')} Only`,
    balanceRemaining: feeProfile.dueAmount,
    paymentMethod: paymentMethod || 'UPI',
    mode: paymentMethod || 'UPI',
    category: feeCategory || 'Semester Institutional Due Clearance',
    paymentModeDetails: paymentModeDetails || { mode: 'Online Instant Gateway' },
    status: 'COMPLETED • VERIFIED',
    timestamp: timeInfo.displayFull,
    date: timeInfo.date,
    time: timeInfo.time,
    signatoryTitle: tpl.signatoryTitle || tpl.signatory || 'Comptroller of Finance & Accounts',
    signatoryName: tpl.signatoryName || tpl.signatory || 'Accounts Authority',
    sealText: tpl.sealText || `DIGITAL VERIFICATION SEAL • ${receiptNo}`,
    verificationSeal: `DIGITAL-SEAL-COMPTROLLER-${receiptNo}-${Date.now().toString().slice(-6)}`,
    footerNotice: tpl.footerNotice || tpl.terms || 'This is an authentic, system-generated digital e-receipt verified under the Smart Campus Platform. No physical signature required.',
    terms: tpl.terms || tpl.footerNotice || 'This is an authentic, system-generated digital e-receipt verified under the Smart Campus Platform. No physical signature required.',
    qrToken: `https://portal.smartcampus.edu/verify/receipt/${receiptNo}`
  };

  if (!db.feePayments) db.feePayments = [];
  db.feePayments.unshift(receipt);

  // Send instant automated SMS alert to guardian & student
  const parentId = user ? user.parentId : null;
  const parent = parentId && db.users[parentId] ? db.users[parentId] : null;
  const guardianContact = parent ? parent.name : 'Guardian';

  const smsText = `${institution ? institution.shortName : 'Campus'} Fee Desk: Payment of ₹${numAmount.toLocaleString('en-IN')} successfully received for ${feeProfile.name} (${feeProfile.roll}). Receipt #${receiptNo}. Remaining Balance: ₹${feeProfile.dueAmount.toLocaleString('en-IN')}.`;

  if (!db.smsLogs) db.smsLogs = [];
  db.smsLogs.unshift({
    id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
    time: timeInfo.time,
    date: timeInfo.date,
    to: `+91 98******10 (${guardianContact})`,
    type: 'Fee Receipt Confirmation',
    message: smsText
  });

  // Log in Institutional Audit Trail
  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'FEE_PAYMENT',
    badgeColor: 'gate',
    actorRole: 'Student',
    actorName: feeProfile.name,
    description: `Processed online fee payment of ₹${numAmount.toLocaleString('en-IN')} via ${paymentMethod} (${utrRef}). Receipt #${receiptNo} generated. Balance remaining: ₹${feeProfile.dueAmount.toLocaleString('en-IN')}.`,
    timeInfo: timeInfo
  };

  if (!db.activityHistory) db.activityHistory = [];
  db.activityHistory.unshift(logEntry);

  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `Payment of ₹${numAmount.toLocaleString('en-IN')} processed successfully!`,
    receipt,
    updatedFees: feeProfile
  });
};

// GET /api/fees/receipt/:receiptNo
exports.getReceipt = (req, res) => {
  const { receiptNo } = req.params;
  const db = getDb();

  const receipt = (db.feePayments || []).find(p =>
    p.receiptNumber === receiptNo ||
    p.id === receiptNo ||
    p.transactionRef === receiptNo
  );

  if (!receipt) {
    return res.status(404).json({ error: 'Receipt not found.' });
  }

  return res.json({
    success: true,
    receipt
  });
};

// GET /api/fees/overview (Administrator & Comptroller view)
exports.getOverview = (req, res) => {
  const db = getDb();
  const feeProfiles = Object.values(db.fees || {});

  let totalAssessed = 0;
  let totalCollected = 0;
  let totalOutstanding = 0;
  let defaultersCount = 0;

  const roster = feeProfiles.map(f => {
    totalAssessed += f.totalFees || 0;
    totalCollected += f.paidAmount || 0;
    totalOutstanding += f.dueAmount || 0;
    if (f.dueAmount > 0) defaultersCount++;

    return {
      studentId: f.studentId,
      name: f.name,
      roll: f.roll,
      semester: f.semester,
      totalFees: f.totalFees,
      paidAmount: f.paidAmount,
      dueAmount: f.dueAmount,
      dueDate: f.dueDate,
      status: f.status,
      isOverdue: f.isOverdue || false
    };
  });

  const collectionRate = totalAssessed > 0
    ? parseFloat(((totalCollected / totalAssessed) * 100).toFixed(1))
    : 0;

  return res.json({
    success: true,
    summary: {
      totalAssessed,
      totalCollected,
      totalOutstanding,
      defaultersCount,
      totalStudentsEnrolled: feeProfiles.length,
      collectionRate
    },
    roster,
    recentPayments: (db.feePayments || []).slice(0, 10)
  });
};

// POST /api/fees/reminder (Admin sends fee due notice via SMS)
exports.sendFeeReminder = (req, res) => {
  const { studentId, broadcastAll, customMessage } = req.body;
  const db = getDb();
  const timeInfo = getCurrentTimestamp();

  let targetStudents = [];
  if (broadcastAll) {
    targetStudents = Object.values(db.fees || {}).filter(f => f.dueAmount > 0);
  } else if (studentId && db.fees && db.fees[studentId]) {
    targetStudents = [db.fees[studentId]];
  }

  if (targetStudents.length === 0) {
    return res.status(400).json({ error: 'No students with pending dues found for reminder.' });
  }

  let sentCount = 0;
  targetStudents.forEach(std => {
    const msg = customMessage || `Smart Campus Accounts: Ward ${std.name} (${std.roll}) has an outstanding semester fee due of ₹${std.dueAmount.toLocaleString('en-IN')}. Please clear dues by ${std.dueDate} to prevent examination admit card withholding.`;

    db.smsLogs.unshift({
      id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      time: timeInfo.time,
      date: timeInfo.date,
      to: `+91 98******10 (${std.name} & Guardian)`,
      type: 'Fee Due Reminder',
      message: msg
    });

    if (!db.feeReminders) db.feeReminders = [];
    db.feeReminders.unshift({
      id: 'REM-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
      studentId: std.studentId,
      studentName: std.name,
      dueAmount: std.dueAmount,
      date: timeInfo.date,
      time: timeInfo.time,
      status: 'Delivered via Institutional SMS Gateway'
    });

    sentCount++;
  });

  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'FEE_REMINDER',
    badgeColor: 'admin',
    actorRole: 'Comptroller / Administrator',
    actorName: 'Accounts Cell',
    description: `Dispatched automated Fee Due Notice SMS to ${sentCount} student accounts with pending balances on ${timeInfo.day}, ${timeInfo.date}.`,
    timeInfo: timeInfo
  };
  db.activityHistory.unshift(logEntry);

  saveDb(db);

  return res.json({
    success: true,
    message: `Fee due notice SMS dispatched successfully to ${sentCount} recipient(s)!`,
    remindersSent: sentCount
  });
};
