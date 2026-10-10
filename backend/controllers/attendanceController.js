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

// GET /api/attendance/summary/:studentId
exports.getStudentSummary = (req, res) => {
  const { studentId } = req.params;
  const db = getDb();
  const student = db.users[studentId];

  if (!student || student.role !== 'student') {
    return res.status(404).json({ error: 'Student not found.' });
  }

  return res.json({
    success: true,
    studentId: student.id,
    name: student.name,
    roll: student.roll,
    overallAttendance: student.attendance,
    attended: student.attendanceAttended,
    total: student.attendanceSessionsTotal,
    subjects: student.subjects || []
  });
};

// GET /api/attendance/defaulters
exports.getDefaulters = (req, res) => {
  const db = getDb();
  const defaulters = Object.values(db.users).filter(u => u.role === 'student' && u.attendance < 75);
  return res.json({
    success: true,
    count: defaulters.length,
    defaulters: defaulters
  });
};

// GET /api/attendance/sessions
exports.getSessions = (req, res) => {
  const db = getDb();
  const list = db.attendanceSessions || [];
  return res.json({
    success: true,
    total: list.length,
    sessions: list
  });
};

// POST /api/attendance/session (Faculty online roll-call)
exports.recordSession = (req, res) => {
  const { subjectCode, subjectName, topic, batch, records, facultyName } = req.body;

  if (!subjectCode || !records) {
    return res.status(400).json({ error: 'Subject code and student records are required.' });
  }

  const db = getDb();
  const timeInfo = getCurrentTimestamp();
  const newSessionId = 'ATT-S' + Math.floor(100 + Math.random() * 900);

  const sessionObj = {
    id: newSessionId,
    date: timeInfo.date,
    time: timeInfo.time,
    subjectCode,
    subjectName: subjectName || 'Core Engineering Subject',
    topic: topic || 'Regular Lecture',
    faculty: facultyName || 'Faculty Professor',
    batch: batch || 'Batch A',
    records: records
  };

  db.attendanceSessions.unshift(sessionObj);

  // Update attendance numbers for each marked student
  Object.keys(records).forEach(stdId => {
    const student = db.users[stdId];
    if (student && student.role === 'student') {
      const status = records[stdId]; // 'P', 'A', 'L'
      student.attendanceSessionsTotal = (student.attendanceSessionsTotal || 154) + 1;
      if (status === 'P' || status === 'L') {
        student.attendanceAttended = (student.attendanceAttended || 136) + 1;
      }
      student.attendance = Math.round((student.attendanceAttended / student.attendanceSessionsTotal) * 100);

      // Update specific subject
      if (student.subjects) {
        const sub = student.subjects.find(s => s.code === subjectCode);
        if (sub) {
          sub.total = (sub.total || 30) + 1;
          if (status === 'P' || status === 'L') sub.attended = (sub.attended || 25) + 1;
          sub.percentage = Math.round((sub.attended / sub.total) * 100);
        }
      }

      // Proactive SMS alert if attendance is below 75%
      if (student.attendance < 75) {
        db.smsLogs.unshift({
          id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
          time: timeInfo.time,
          date: timeInfo.date,
          to: '+91 98******10 (Guardian)',
          type: 'Shortage Warning',
          message: `Smart Campus Alert: Ward ${student.name} (${student.roll}) attendance has dropped to ${student.attendance}% in ${subjectCode}. Min 75% required.`
        });
      }
    }
  });

  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'ATTENDANCE',
    badgeColor: 'attendance',
    actorRole: 'Faculty',
    actorName: facultyName || 'Faculty Professor',
    description: `Recorded online attendance register for ${subjectCode} (${sessionObj.batch}, Topic: ${sessionObj.topic}) on ${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}.`,
    timeInfo: timeInfo
  };

  db.activityHistory.unshift(logEntry);
  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `Attendance session #${newSessionId} for ${subjectCode} recorded successfully!`,
    session: sessionObj
  });
};
