const { getDb, saveDb } = require('../db');

function getCurrentTimestamp() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day: days[now.getDay()],
    date: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    time24: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    displayFull: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  };
}

// -------------------------------------------------------------
// 1. GET /api/gatepasses (Consolidated list across all pass types)
// -------------------------------------------------------------
exports.getAllPasses = (req, res) => {
  const db = getDb();
  const { studentId, status } = req.query;

  let outpasses = db.outpasses || [];
  let leaves = db.leaveApplications || [];
  let legacy = db.gatePasses || [];

  if (studentId) {
    outpasses = outpasses.filter(p => p.studentId === studentId);
    leaves = leaves.filter(p => p.studentId === studentId);
    legacy = legacy.filter(p => p.studentId === studentId);
  }
  if (status) {
    const s = status.toLowerCase();
    outpasses = outpasses.filter(p => p.status.toLowerCase().includes(s));
    leaves = leaves.filter(p => p.status.toLowerCase().includes(s));
    legacy = legacy.filter(p => p.status.toLowerCase().includes(s));
  }

  return res.json({
    success: true,
    outpasses,
    leaveApplications: leaves,
    passes: [...outpasses, ...leaves, ...legacy]
  });
};

// -------------------------------------------------------------
// 2. NORMAL OUTPASS SYSTEM (Market / Medical - Limited Hours)
// -------------------------------------------------------------
exports.getOutpasses = (req, res) => {
  const db = getDb();
  const { studentId, status, institutionId } = req.query;
  let list = db.outpasses || [];

  if (institutionId && institutionId !== 'ALL') {
    list = list.filter(p => (p.institutionId || 'INST-001') === institutionId);
  }
  if (studentId) list = list.filter(p => p.studentId === studentId);
  if (status) list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());

  return res.json({
    success: true,
    total: list.length,
    outpasses: list
  });
};

exports.applyOutpass = (req, res) => {
  const {
    studentId,
    category,
    purpose,
    destination,
    outTime,
    expectedReturnTime,
    timeLimitHours,
    parentPhone
  } = req.body;

  if (!studentId || !purpose || !expectedReturnTime) {
    return res.status(400).json({ error: 'Student ID, purpose, and expected return time are required.' });
  }

  const db = getDb();
  const timeInfo = getCurrentTimestamp();
  const user = db.users[studentId] || { name: 'Student', roll: 'CS-2024-082', dept: 'CSE' };
  const outpassId = 'OP-' + Math.floor(1000 + Math.random() * 9000);

  const cleanOutTime = outTime || timeInfo.time24;
  const standardQrData = `OUTPASS:${outpassId}:${studentId}:${user.roll || studentId}:EXP-${expectedReturnTime.replace(':', '')}`;

  const newOutpass = {
    id: outpassId,
    institutionId: req.body.institutionId || user.institutionId || 'INST-001',
    passType: 'OUTPASS',
    category: category || 'Market / Personal Errand',
    studentId,
    studentName: user.name,
    roll: user.roll || 'CS-2024-082',
    department: user.dept || 'Computer Science & Engineering',
    hostel: user.hostel || 'Aryabhatta Hostel, Room 304',
    phone: user.phone || '+91 98610 99823',
    parentPhone: parentPhone || user.parentPhone || '+91 98610 11223',
    purpose,
    destination: destination || 'Campus Surrounding / City Market',
    appliedDate: timeInfo.date,
    appliedTime: timeInfo.time,
    outTime: cleanOutTime,
    expectedReturnTime: expectedReturnTime,
    timeLimitHours: timeLimitHours || '3 Hours',
    status: 'PENDING_WARDEN',
    wardenApprovedBy: null,
    wardenApprovalTime: null,
    wardenNotes: null,
    qrCodeData: standardQrData,
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
  };

  if (!db.outpasses) db.outpasses = [];
  db.outpasses.unshift(newOutpass);

  // Activity log
  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'GATE_PASS',
    badgeColor: 'gate',
    actorRole: 'Student',
    actorName: user.name,
    description: `Applied for Normal Outpass #${outpassId} (${newOutpass.category} for "${purpose}"). Window: ${cleanOutTime} to ${expectedReturnTime}. Sent to Hostel Warden.`,
    timeInfo: timeInfo
  };
  if (!db.activityHistory) db.activityHistory = [];
  db.activityHistory.unshift(logEntry);

  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `Normal Outpass #${outpassId} submitted successfully. Forwarded to Hostel Warden for 1-click approval.`,
    outpass: newOutpass
  });
};

exports.approveOutpass = (req, res) => {
  const { id } = req.params;
  const { decision = 'Approved', wardenName = 'Dr. K.C. Swain (Hostel Warden)', wardenNotes = 'Approved for stated purpose.' } = req.body;

  const db = getDb();
  const outpass = (db.outpasses || []).find(p => p.id === id);

  if (!outpass) {
    return res.status(404).json({ error: 'Outpass record not found.' });
  }

  const timeInfo = getCurrentTimestamp();
  const isApproved = decision.toLowerCase() === 'approved';

  outpass.status = isApproved ? 'APPROVED' : 'REJECTED';
  outpass.wardenApprovedBy = wardenName;
  outpass.wardenApprovalTime = `${timeInfo.date} at ${timeInfo.time}`;
  outpass.wardenNotes = wardenNotes;

  // SMS Notice to parent
  if (!db.smsLogs) db.smsLogs = [];
  db.smsLogs.unshift({
    id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
    time: timeInfo.time,
    date: timeInfo.date,
    to: outpass.parentPhone || '+91 98610 11223 (Parent)',
    type: `Outpass ${outpass.status}`,
    message: `Smart Campus Notice: Normal Outpass #${outpass.id} for ward ${outpass.studentName} (${outpass.category}) has been ${outpass.status} by Warden. Valid return deadline: ${outpass.expectedReturnTime}.`
  });

  // Activity Log
  db.activityHistory.unshift({
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'GATE_PASS',
    badgeColor: isApproved ? 'gate' : 'grievance',
    actorRole: 'Warden',
    actorName: wardenName,
    description: `Warden ${outpass.status} Outpass #${outpass.id} for ${outpass.studentName} (${outpass.category}). QR code active for main gate scan.`,
    timeInfo: timeInfo
  });

  saveDb(db);

  return res.json({
    success: true,
    message: `Outpass #${outpass.id} ${outpass.status} by Hostel Warden. QR approval code generated for main gate exit scan.`,
    outpass
  });
};

// -------------------------------------------------------------
// 3. LONG LEAVE PASS SYSTEM (1+ Days Multi-Tier Workflow)
// -------------------------------------------------------------
exports.getLeaves = (req, res) => {
  const db = getDb();
  const { studentId, status, institutionId } = req.query;
  let list = db.leaveApplications || [];

  if (institutionId && institutionId !== 'ALL') {
    list = list.filter(p => (p.institutionId || 'INST-001') === institutionId);
  }
  if (studentId) list = list.filter(p => p.studentId === studentId);
  if (status) list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());

  return res.json({
    success: true,
    total: list.length,
    leaves: list
  });
};

exports.applyLeave = (req, res) => {
  const {
    studentId,
    leaveType,
    reason,
    destinationAddress,
    fromDate,
    fromTime,
    toDate,
    toTime,
    parentName,
    parentPhone,
    travelMode
  } = req.body;

  if (!studentId || !reason || !fromDate || !toDate) {
    return res.status(400).json({ error: 'Student ID, reason, from-date, and to-date are required.' });
  }

  const db = getDb();
  const timeInfo = getCurrentTimestamp();
  const user = db.users[studentId] || { name: 'Student', roll: 'CS-2024-082', dept: 'CSE' };
  const leaveId = 'LP-' + Math.floor(1000 + Math.random() * 9000);

  // Calculate day difference
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

  const standardQrData = `LEAVE:${leaveId}:${studentId}:${user.roll || studentId}:FROM-${fromDate}:TO-${toDate}`;

  const newLeave = {
    id: leaveId,
    institutionId: req.body.institutionId || user.institutionId || 'INST-001',
    passType: 'LEAVE',
    leaveType: leaveType || 'Home Visit / Family Gathering',
    studentId,
    studentName: user.name,
    roll: user.roll || 'CS-2024-082',
    department: user.dept || 'Computer Science & Engineering',
    semester: user.semester || 'Semester 5',
    hostel: user.hostel || 'Aryabhatta Hostel, Room 304',
    phone: user.phone || '+91 98610 99823',
    parentName: parentName || 'Parent / Guardian',
    parentPhone: parentPhone || '+91 98610 11223',
    reason,
    destinationAddress: destinationAddress || 'Home Address',
    fromDate,
    fromTime: fromTime || '08:00',
    toDate,
    toTime: toTime || '20:00',
    totalDays: diffDays,
    travelMode: travelMode || 'Bus / Train',
    appliedDate: timeInfo.date,
    appliedTime: timeInfo.time,
    status: 'PENDING_COORDINATOR', // Tier 1 -> Tier 2 -> Tier 3 -> APPROVED
    approvalWorkflow: {
      coordinator: {
        verified: false,
        officerName: null,
        timestamp: null,
        remarks: null
      },
      superintendent: {
        verified: false,
        officerName: null,
        timestamp: null,
        remarks: null
      },
      warden: {
        approved: false,
        officerName: null,
        timestamp: null,
        remarks: null
      }
    },
    qrCodeData: standardQrData,
    movement: {
      exitScanned: false,
      exitTime: null,
      exitSecurityOfficer: null,
      entryScanned: false,
      entryTime: null,
      entrySecurityOfficer: null,
      isLate: false
    }
  };

  if (!db.leaveApplications) db.leaveApplications = [];
  db.leaveApplications.unshift(newLeave);

  // Activity log
  if (!db.activityHistory) db.activityHistory = [];
  db.activityHistory.unshift({
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'GATE_PASS',
    badgeColor: 'gate',
    actorRole: 'Student',
    actorName: user.name,
    description: `Submitted ${diffDays}-day Leave Application #${leaveId} (${newLeave.leaveType} to ${destinationAddress}). Routed to Tier 1: Academic Coordinator.`,
    timeInfo: timeInfo
  });

  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `Leave application #${leaveId} submitted. Initiated 3-tier institutional approval (Coordinator ➔ Superintendent ➔ Warden).`,
    leave: newLeave
  });
};

// PATCH /api/gatepasses/leave/:id/verify (Tier-based review)
exports.verifyLeave = (req, res) => {
  const { id } = req.params;
  const {
    tier, // 'coordinator' | 'superintendent' | 'warden'
    decision = 'Approved', // 'Approved' | 'Rejected'
    officerName,
    remarks
  } = req.body;

  const db = getDb();
  const leave = (db.leaveApplications || []).find(p => p.id === id);

  if (!leave) {
    return res.status(404).json({ error: 'Leave application not found.' });
  }

  const timeInfo = getCurrentTimestamp();
  const isApproved = decision.toLowerCase() === 'approved';

  if (!isApproved) {
    leave.status = 'REJECTED';
    leave.rejectionReason = remarks || `Rejected by ${tier}`;
    saveDb(db);
    return res.json({
      success: true,
      message: `Leave application #${leave.id} was rejected at ${tier} stage.`,
      leave
    });
  }

  // Handle Multi-tier progression
  if (tier === 'coordinator') {
    leave.approvalWorkflow.coordinator = {
      verified: true,
      officerName: officerName || 'Prof. A.K. Sharma (Academic Coordinator)',
      timestamp: `${timeInfo.date} at ${timeInfo.time}`,
      remarks: remarks || 'Academic records and attendance verified. Eligible for leave.'
    };
    leave.status = 'PENDING_SUPERINTENDENT';
  } else if (tier === 'superintendent') {
    leave.approvalWorkflow.superintendent = {
      verified: true,
      officerName: officerName || 'Dr. Manas Jena (Hostel Superintendent)',
      timestamp: `${timeInfo.date} at ${timeInfo.time}`,
      remarks: remarks || 'Hostel clearance verified. Mess rebate recorded.'
    };
    leave.status = 'PENDING_WARDEN';
  } else if (tier === 'warden') {
    leave.approvalWorkflow.warden = {
      approved: true,
      officerName: officerName || 'Dr. K.C. Swain (Chief Hostel Warden)',
      timestamp: `${timeInfo.date} at ${timeInfo.time}`,
      remarks: remarks || 'Parent consent confirmed. Gate pass issued.'
    };
    leave.status = 'APPROVED';

    // Dispatch SMS to parent on final Warden approval
    if (!db.smsLogs) db.smsLogs = [];
    db.smsLogs.unshift({
      id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      time: timeInfo.time,
      date: timeInfo.date,
      to: leave.parentPhone || '+91 98610 11223 (Parent)',
      type: 'Leave Pass Approved',
      message: `Smart Campus Notice: ${leave.totalDays}-day Leave Pass #${leave.id} for ward ${leave.studentName} has been fully APPROVED by Chief Warden. Destination: ${leave.destinationAddress}. Valid from ${leave.fromDate} to ${leave.toDate}.`
    });
  }

  db.activityHistory.unshift({
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'GATE_PASS',
    badgeColor: leave.status === 'APPROVED' ? 'gate' : 'announcement',
    actorRole: tier.charAt(0).toUpperCase() + tier.slice(1),
    actorName: officerName || 'Authority',
    description: `Tier Review (${tier}): Verified Leave Pass #${leave.id} for ${leave.studentName}. Status now: ${leave.status}.`,
    timeInfo: timeInfo
  });

  saveDb(db);

  return res.json({
    success: true,
    message: `Tier review recorded for ${tier}. Pass status: ${leave.status}.`,
    leave
  });
};

// -------------------------------------------------------------
// 4. MAIN GATE SECURITY SCANNER (Dual Scan: EXIT & ENTRY)
// -------------------------------------------------------------
exports.scanPass = (req, res) => {
  const {
    qrData,
    passId,
    securityOfficer = 'Officer Rajesh Kumar (Main Gate #1)',
    gateNumber = 'Main Gate #1',
    forceDirection // optional: 'EXIT' or 'ENTRY'
  } = req.body;

  const db = getDb();
  const timeInfo = getCurrentTimestamp();

  // Find pass by passId or parsed qrData
  const searchKey = passId || (qrData ? qrData.split(':')[1] : null);

  let targetPass = null;
  let passType = 'OUTPASS';

  if (searchKey) {
    targetPass = (db.outpasses || []).find(p => p.id === searchKey || p.qrCodeData === qrData);
    if (targetPass) {
      passType = 'OUTPASS';
    } else {
      targetPass = (db.leaveApplications || []).find(p => p.id === searchKey || p.qrCodeData === qrData);
      if (targetPass) {
        passType = 'LEAVE';
      } else {
        targetPass = (db.gatePasses || []).find(p => p.id === searchKey);
        if (targetPass) passType = 'LEGACY';
      }
    }
  }

  // If still not found, check studentId
  if (!targetPass && searchKey) {
    targetPass = (db.outpasses || []).find(p => p.studentId === searchKey && p.status === 'APPROVED');
    if (targetPass) passType = 'OUTPASS';
  }

  if (!targetPass) {
    return res.status(404).json({
      success: false,
      error: `Pass not found for code "${searchKey || qrData}". Please check Pass ID or scan valid QR.`
    });
  }

  // Verify approval
  if (targetPass.status !== 'APPROVED' && targetPass.status !== 'ACTIVE_OUTSIDE') {
    return res.status(403).json({
      success: false,
      error: `ACCESS DENIED: Pass #${targetPass.id} is currently "${targetPass.status}". Only APPROVED passes are valid for campus gate movement.`,
      pass: targetPass
    });
  }

  if (!targetPass.movement) {
    targetPass.movement = { exitScanned: false, entryScanned: false };
  }

  let direction = forceDirection;
  if (!direction) {
    // Auto-detect direction: If student hasn't exited, next is EXIT; if already exited, next is ENTRY!
    direction = (!targetPass.movement.exitScanned) ? 'EXIT' : 'ENTRY';
  }

  let movementRecord = null;

  if (direction === 'EXIT') {
    // ----------------- CAMPUS EXIT SCAN -----------------
    targetPass.movement.exitScanned = true;
    targetPass.movement.exitTime = `${timeInfo.date} at ${timeInfo.time}`;
    targetPass.movement.exitSecurityOfficer = securityOfficer;
    targetPass.status = 'ACTIVE_OUTSIDE';

    movementRecord = {
      id: 'SCAN-' + Math.floor(10000 + Math.random() * 90000),
      passId: targetPass.id,
      passType: passType,
      studentId: targetPass.studentId,
      studentName: targetPass.studentName,
      roll: targetPass.roll,
      direction: 'EXIT',
      timestamp: `${timeInfo.date} at ${timeInfo.time}`,
      date: timeInfo.date,
      time: timeInfo.time,
      securityOfficer,
      gateNumber,
      status: 'OUTSIDE_CAMPUS',
      isLate: false,
      deadline: targetPass.expectedReturnTime || targetPass.toDate || 'Evening Cutoff',
      destination: targetPass.destination || targetPass.destinationAddress || 'Local Market',
      remarks: `Main gate exit authorized by security. Logged into ${passType} database.`
    };

    if (!db.gateMovements) db.gateMovements = [];
    db.gateMovements.unshift(movementRecord);

    // Parent SMS on Exit
    if (!db.smsLogs) db.smsLogs = [];
    db.smsLogs.unshift({
      id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      time: timeInfo.time,
      date: timeInfo.date,
      to: targetPass.parentPhone || '+91 98610 11223 (Guardian)',
      type: 'Gate Exit Notification',
      message: `Smart Campus Gate #1: Ward ${targetPass.studentName} has EXITED campus gate at ${timeInfo.time} (${targetPass.category || targetPass.leaveType}). Expected return: ${targetPass.expectedReturnTime || targetPass.toDate}.`
    });

    db.activityHistory.unshift({
      id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
      actionType: 'GATE_PASS',
      badgeColor: 'gate',
      actorRole: 'Security',
      actorName: securityOfficer,
      description: `Security verified EXIT for ${targetPass.studentName} (#${targetPass.id}, ${passType}). Departed campus at ${timeInfo.time}.`,
      timeInfo: timeInfo
    });

    saveDb(db);

    return res.json({
      success: true,
      direction: 'EXIT',
      message: `✅ CAMPUS EXIT RECORDED: ${targetPass.studentName} cleared through ${gateNumber} at ${timeInfo.time}. Status set to OUTSIDE CAMPUS.`,
      pass: targetPass,
      movement: movementRecord,
      storedInTable: passType === 'LEAVE' ? 'leaveApplications' : 'outpasses'
    });

  } else {
    // ----------------- CAMPUS ENTRY SCAN -----------------
    targetPass.movement.entryScanned = true;
    targetPass.movement.entryTime = `${timeInfo.date} at ${timeInfo.time}`;
    targetPass.movement.entrySecurityOfficer = securityOfficer;

    // Check if return is on time or late
    let isLate = false;
    let lateDetails = 'Returned within permitted window.';

    if (passType === 'OUTPASS' && targetPass.expectedReturnTime) {
      // E.g. expected 19:30 vs now
      const expParts = targetPass.expectedReturnTime.split(':');
      if (expParts.length >= 2) {
        const expHours = parseInt(expParts[0]);
        const expMinutes = parseInt(expParts[1]);
        const nowHours = new Date().getHours();
        const nowMinutes = new Date().getMinutes();
        if (nowHours > expHours || (nowHours === expHours && nowMinutes > expMinutes)) {
          isLate = true;
          const diff = (nowHours - expHours) * 60 + (nowMinutes - expMinutes);
          targetPass.movement.isLate = true;
          targetPass.movement.lateMinutes = diff;
          lateDetails = `Late return: Exceeded cutoff by ${diff} minutes. Flagged to Warden.`;
        }
      }
    }

    targetPass.status = isLate ? 'RETURNED_LATE' : 'RETURNED_SAFELY';

    movementRecord = {
      id: 'SCAN-' + Math.floor(10000 + Math.random() * 90000),
      passId: targetPass.id,
      passType: passType,
      studentId: targetPass.studentId,
      studentName: targetPass.studentName,
      roll: targetPass.roll,
      direction: 'ENTRY',
      timestamp: `${timeInfo.date} at ${timeInfo.time}`,
      date: timeInfo.date,
      time: timeInfo.time,
      securityOfficer,
      gateNumber,
      status: targetPass.status,
      isLate,
      remarks: `Main gate entry scanned. ${lateDetails}`
    };

    if (!db.gateMovements) db.gateMovements = [];
    db.gateMovements.unshift(movementRecord);

    // Parent SMS on Entry
    if (!db.smsLogs) db.smsLogs = [];
    db.smsLogs.unshift({
      id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      time: timeInfo.time,
      date: timeInfo.date,
      to: targetPass.parentPhone || '+91 98610 11223 (Guardian)',
      type: 'Gate Entry Notification',
      message: `Smart Campus Gate #1: Ward ${targetPass.studentName} has SAFELY RETURNED and entered campus gate at ${timeInfo.time}.${isLate ? ' ⚠️ Late return noted.' : ' Safe on-time return.'}`
    });

    db.activityHistory.unshift({
      id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
      actionType: 'GATE_PASS',
      badgeColor: isLate ? 'grievance' : 'gate',
      actorRole: 'Security',
      actorName: securityOfficer,
      description: `Security verified ENTRY for ${targetPass.studentName} (#${targetPass.id}). Returned to campus at ${timeInfo.time}. (${targetPass.status})`,
      timeInfo: timeInfo
    });

    saveDb(db);

    return res.json({
      success: true,
      direction: 'ENTRY',
      isLate,
      message: `✅ CAMPUS ENTRY RECORDED: ${targetPass.studentName} safely checked back in at ${timeInfo.time}.${isLate ? ' ⚠️ Late return recorded in database.' : ' On-time return verified.'}`,
      pass: targetPass,
      movement: movementRecord,
      storedInTable: passType === 'LEAVE' ? 'leaveApplications' : 'outpasses'
    });
  }
};

// -------------------------------------------------------------
// 5. GET GATE MOVEMENTS (Main Gate Security Log)
// -------------------------------------------------------------
exports.getMovements = (req, res) => {
  const db = getDb();
  const { passType, direction, institutionId } = req.query;
  let list = db.gateMovements || [];

  if (institutionId && institutionId !== 'ALL') {
    list = list.filter(m => (m.institutionId || 'INST-001') === institutionId);
  }
  if (passType) list = list.filter(m => m.passType.toLowerCase() === passType.toLowerCase());
  if (direction) list = list.filter(m => m.direction.toLowerCase() === direction.toLowerCase());

  const outpassCount = list.filter(m => m.passType === 'OUTPASS').length;
  const leaveCount = list.filter(m => m.passType === 'LEAVE').length;
  const outsideCount = (db.outpasses || []).filter(p => p.status === 'ACTIVE_OUTSIDE' && (!institutionId || p.institutionId === institutionId)).length +
                       (db.leaveApplications || []).filter(l => l.status === 'ACTIVE_OUTSIDE' && (!institutionId || l.institutionId === institutionId)).length;

  return res.json({
    success: true,
    total: list.length,
    outsideCount,
    outpassCount,
    leaveCount,
    movements: list
  });
};

// -------------------------------------------------------------
// 6. LEGACY COMPATIBILITY
// -------------------------------------------------------------
exports.applyPass = exports.applyOutpass;
exports.updatePassDecision = exports.approveOutpass;
