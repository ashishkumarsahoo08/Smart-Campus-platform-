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

// GET /api/users
exports.getAllUsers = (req, res) => {
  const db = getDb();
  const { institutionId } = req.query;
  let users = Object.values(db.users || {});
  if (institutionId && institutionId !== 'ALL') {
    users = users.filter(u => u.institutionId === institutionId || u.role === 'superadmin');
  }
  return res.json({
    success: true,
    total: users.length,
    users: users
  });
};

// POST /api/users (Administrator provisions new user)
exports.createUser = (req, res) => {
  const { role, name, id: rawId, dept, password, adminName, institutionId = 'INST-001' } = req.body;

  if (!role || !name || !rawId || !password) {
    return res.status(400).json({ error: 'Role, Name, User ID, and Initial Password are required.' });
  }

  const db = getDb();
  const idTrim = rawId.trim();

  // Check duplicate
  const duplicate = Object.values(db.users).find(u =>
    (u.loginId && u.loginId.toLowerCase() === idTrim.toLowerCase()) ||
    (u.id && u.id.toLowerCase() === idTrim.toLowerCase()) ||
    (u.roll && u.roll.toLowerCase() === idTrim.toLowerCase()) ||
    (u.staffId && u.staffId.toLowerCase() === idTrim.toLowerCase())
  );

  if (duplicate) {
    return res.status(409).json({
      error: `User ID "${idTrim}" is already assigned to ${duplicate.name} (${duplicate.role.toUpperCase()})! Please enter a unique ID.`
    });
  }

  const timeInfo = getCurrentTimestamp();
  const userKey = `${role}_${idTrim.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;

  const newUser = {
    id: userKey,
    loginId: idTrim,
    institutionId: institutionId,
    role: role,
    name: name.trim(),
    password: password.trim(),
    passwordChanged: false,
    createdBy: `Administrator: ${adminName || 'College Registrar'}`,
    createdAt: `${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}`,
    avatar: role === 'student' ? '👨‍🎓' : (role === 'faculty' ? '👩‍🏫' : (role === 'parent' ? '👪' : '👨‍💼'))
  };

  if (role === 'student') {
    newUser.roll = idTrim;
    newUser.dept = dept || 'Computer Science & Engineering';
    newUser.sem = '5th Semester';
    newUser.attendance = 85;
    newUser.attendanceAttended = 34;
    newUser.attendanceSessionsTotal = 40;
    newUser.subjects = [
      { code: 'CS501', name: 'AI & Machine Learning', faculty: 'Prof. A.K. Sharma', attended: 9, total: 10, percentage: 90 },
      { code: 'CS502', name: 'Cloud Computing & DevOps', faculty: 'Dr. Priya Patel', attended: 8, total: 10, percentage: 80 },
      { code: 'CS503', name: 'Data Structures & Algorithms', faculty: 'Prof. A.K. Sharma', attended: 9, total: 10, percentage: 90 },
      { code: 'CS504', name: 'Database Management Systems', faculty: 'Prof. S. Mohanty', attended: 8, total: 10, percentage: 80 }
    ];
  } else if (role === 'faculty') {
    newUser.staffId = idTrim;
    newUser.dept = dept || 'Computer Science & Engineering';
    newUser.designation = 'Assistant Professor';
  } else if (role === 'parent') {
    newUser.wardId = 'student1';
    newUser.wardName = 'Satyajit Mohapatra';
  } else if (role === 'admin') {
    newUser.staffId = idTrim;
    newUser.dept = dept || 'Central Academic Administration';
    newUser.designation = 'Administrative Officer';
  }

  db.users[userKey] = newUser;

  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'USER_PROVISION',
    badgeColor: 'admin',
    actorRole: 'Administrator',
    actorName: adminName || 'Dr. R.N. Sen',
    description: `Administrator provisioned new user account: ${newUser.name} (Login ID: ${idTrim}, Role: ${role.toUpperCase()}) with initial password.`,
    timeInfo: timeInfo
  };

  db.activityHistory.unshift(logEntry);
  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `Account created successfully for ${newUser.name}!`,
    user: newUser
  });
};

// POST /api/users/:id/reset-password (Admin password override)
exports.resetPassword = (req, res) => {
  const { id } = req.params;
  const { newTemporaryPassword, adminName } = req.body;

  if (!newTemporaryPassword) {
    return res.status(400).json({ error: 'A new temporary password must be provided.' });
  }

  const db = getDb();
  const user = db.users[id];

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  const timeInfo = getCurrentTimestamp();
  user.password = newTemporaryPassword.trim();
  user.passwordChanged = false; // Flag that user needs to update on next login

  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'SECURITY',
    badgeColor: 'admin',
    actorRole: 'Administrator',
    actorName: adminName || 'Dr. R.N. Sen',
    description: `Administrator reset password for user ${user.name} (ID: ${user.loginId || user.roll || user.staffId || user.id}) to temporary password.`,
    timeInfo: timeInfo
  };

  db.activityHistory.unshift(logEntry);
  saveDb(db);

  return res.json({
    success: true,
    message: `Password reset to temporary password for ${user.name}.`,
    user: user
  });
};
