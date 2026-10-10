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

// POST /api/auth/login
exports.login = (req, res) => {
  const { role, username, password, institutionId } = req.body;

  if (!password || !password.trim()) {
    return res.status(400).json({ error: 'Password is required to sign in.' });
  }

  const db = getDb();
  let user = null;
  let institution = null;

  // Multi-Tenant Scoped Authentication
  if (institutionId && institutionId.trim()) {
    const normInstId = institutionId.trim().toUpperCase();
    institution = Object.values(db.institutions || {}).find(
      i => i.id.toUpperCase() === normInstId || (i.code && i.code.toUpperCase() === normInstId)
    );

    if (!institution) {
      return res.status(404).json({
        error: `Institution with ID "${institutionId}" is not registered on the platform. Please verify your Institution ID or register your institution via the Institution Portal.`
      });
    }

    const searchKey = (username || '').trim().toLowerCase();

    // 1. Administrator Login (Identified by Institution ID + Administrator Login ID + Password)
    if (role === 'admin') {
      if (!searchKey) {
        return res.status(400).json({ error: 'Administrator Login ID is required.' });
      }

      // Check if user is entering another role's ID type (enforce distinct ID types)
      const isStudentId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'student' && (
          (u.roll && u.roll.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey)
        )
      );
      if (isStudentId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Student Roll Number, not an Administrator Login ID. Please use the Student Login tab.`
        });
      }

      const isFacultyId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'faculty' && (
          (u.staffId && u.staffId.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey)
        )
      );
      if (isFacultyId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Faculty Staff ID, not an Administrator Login ID. Please use the Faculty Login tab.`
        });
      }

      user = Object.values(db.users || {}).find(
        u => u.role === 'admin' && u.institutionId === institution.id && (
          (u.loginId && u.loginId.toLowerCase() === searchKey) ||
          (u.staffId && u.staffId.toLowerCase() === searchKey) ||
          (u.id && u.id.toLowerCase() === searchKey)
        )
      );

      if (!user) {
        return res.status(404).json({
          error: `Administrator Login ID "${username}" not found under institution "${institution.name}". Please verify your Administrator Login ID.`
        });
      }
    }
    // 2. Faculty Login (Identified by Institution ID + Faculty ID / Staff ID + Password)
    else if (role === 'faculty') {
      if (!searchKey) {
        return res.status(400).json({ error: 'Faculty ID / Staff ID is required.' });
      }

      // Check if user is entering another role's ID type (enforce distinct ID types)
      const isStudentId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'student' && (
          (u.roll && u.roll.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey)
        )
      );
      if (isStudentId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is registered as a Student Roll Number, not a Faculty ID. Please use the Student Login tab.`
        });
      }

      const isParentId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'parent' && (
          (u.loginId && u.loginId.toLowerCase() === searchKey) ||
          (u.alias && u.alias.toLowerCase() === searchKey)
        )
      );
      if (isParentId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Parent ID, not a Faculty ID. Please use the Parent Login tab.`
        });
      }

      user = Object.values(db.users || {}).find(
        u => u.role === 'faculty' && u.institutionId === institution.id && (
          (u.staffId && u.staffId.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey) ||
          (u.id && u.id.toLowerCase() === searchKey)
        )
      );

      if (!user) {
        return res.status(404).json({
          error: `Faculty ID "${username}" not found under institution "${institution.name}". Please verify your Staff ID assigned by the Administrator.`
        });
      }
    }
    // 3. Student Login (Identified by Institution ID + Regd. No. / Roll No. + Password)
    else if (role === 'student') {
      if (!searchKey) {
        return res.status(400).json({ error: 'Student Roll No. / Regd No. is required.' });
      }

      // Check if user is entering another role's ID type
      const isFacultyId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'faculty' && (
          (u.staffId && u.staffId.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey)
        )
      );
      if (isFacultyId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Faculty Staff ID, not a Student Roll Number. Please use the Faculty Login tab.`
        });
      }

      const isParentId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'parent' && (
          (u.loginId && u.loginId.toLowerCase() === searchKey) ||
          (u.alias && u.alias.toLowerCase() === searchKey)
        )
      );
      if (isParentId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Parent ID, not a Student Roll Number. Please use the Parent Login tab.`
        });
      }

      user = Object.values(db.users || {}).find(
        u => u.role === 'student' && u.institutionId === institution.id && (
          (u.roll && u.roll.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey) ||
          (u.id && u.id.toLowerCase() === searchKey)
        )
      );

      if (!user) {
        return res.status(404).json({
          error: `Student with Roll No / Regd No "${username}" not found in institution "${institution.name}". Each student account must be registered by the Administrator.`
        });
      }
    }
    // 4. Parent Login (Identified by Institution ID + Parent ID + Password)
    else if (role === 'parent') {
      if (!searchKey) {
        return res.status(400).json({ error: 'Parent ID is required.' });
      }

      // Check if user is entering another role's ID type
      const isStudentId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'student' && (
          (u.roll && u.roll.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey)
        )
      );
      if (isStudentId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Student Roll Number, not a Parent ID. Please use the Student Login tab.`
        });
      }

      const isFacultyId = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'faculty' && (
          (u.staffId && u.staffId.toLowerCase() === searchKey) ||
          (u.loginId && u.loginId.toLowerCase() === searchKey)
        )
      );
      if (isFacultyId) {
        return res.status(400).json({
          error: `Invalid ID Type: "${username}" is a Faculty Staff ID, not a Parent ID. Please use the Faculty Login tab.`
        });
      }

      user = Object.values(db.users || {}).find(
        u => u.role === 'parent' && u.institutionId === institution.id && (
          (u.loginId && u.loginId.toLowerCase() === searchKey) ||
          (u.alias && u.alias.toLowerCase() === searchKey) ||
          (u.id && u.id.toLowerCase() === searchKey)
        )
      );

      if (!user) {
        return res.status(404).json({
          error: `Parent ID "${username}" not found under institution "${institution.name}". Please verify the Parent ID provided by the institution.`
        });
      }
    }
  }

  // Fallback direct global lookup if not resolved through institution-scoped flow
  if (!user) {
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username/ID and password are required.' });
    }
    const searchKey = username.trim().toLowerCase();
    user = Object.values(db.users).find(u =>
      (u.loginId && u.loginId.toLowerCase() === searchKey) ||
      (u.id && u.id.toLowerCase() === searchKey) ||
      (u.roll && u.roll.toLowerCase() === searchKey) ||
      (u.staffId && u.staffId.toLowerCase() === searchKey) ||
      (u.name && u.name.toLowerCase() === searchKey) ||
      (u.alias && u.alias.toLowerCase() === searchKey)
    );
  }

  if (!user) {
    return res.status(404).json({
      error: `Account not found for ID "${username || institutionId}". Each account must be registered under its institution before logging in.`
    });
  }

  const expectedPassword = user.password || 'campus123';
  if (password.trim() !== expectedPassword) {
    return res.status(401).json({
      error: `Incorrect password for ${user.name}! Please enter the password assigned or created for this account.`
    });
  }

  // Check institutional subscription validity
  let isSubscriptionExpired = false;
  if (!institution && user.institutionId && db.institutions) {
    institution = db.institutions[user.institutionId] || null;
  }

  if (institution && institution.subscription) {
    if (institution.subscription.status === 'EXPIRED') {
      isSubscriptionExpired = true;
    } else if (institution.subscription.endDate) {
      const end = new Date(institution.subscription.endDate);
      if (new Date() > end) {
        isSubscriptionExpired = true;
        institution.subscription.status = 'EXPIRED';
      }
    }
  }

  // Non-admin members (students, faculty, wardens, security) are locked out when subscription expires
  if (isSubscriptionExpired && user.role !== 'admin' && user.role !== 'superadmin') {
    return res.status(403).json({
      error: `Institutional License Expired: The subscription for "${institution ? institution.name : 'your institution'}" has ended. Access to academic records and passes is locked until the Administrator renews the institutional license.`,
      subscriptionExpired: true,
      institutionName: institution ? institution.name : 'Your Institution',
      institutionId: user.institutionId
    });
  }

  // Record login activity in audit history
  const timeInfo = getCurrentTimestamp();
  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'LOGIN',
    badgeColor: 'login',
    actorRole: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    actorName: user.name,
    institutionId: user.institutionId || 'GLOBAL',
    description: `User ${user.name} (${user.role.toUpperCase()}, ID: ${user.loginId || user.roll || user.staffId || user.id}) signed in to ${institution ? institution.name : 'Platform'} on ${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}.${isSubscriptionExpired ? ' [SUBSCRIPTION RENEWAL REQUIRED]' : ''}`,
    timeInfo: timeInfo
  };

  db.activityHistory.unshift(logEntry);
  if (db.activityHistory.length > 200) db.activityHistory.pop();
  saveDb(db);

  return res.json({
    success: true,
    message: `Authenticated as ${user.name} (${user.role.toUpperCase()})`,
    user: user,
    institution: institution,
    isSubscriptionExpired: isSubscriptionExpired,
    isSuperAdmin: user.role === 'superadmin',
    isInitialPassword: !user.passwordChanged
  });
};

// POST /api/auth/change-password
exports.changePassword = (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'User ID, current password, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const db = getDb();
  const user = db.users[userId];

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  const expectedCurrent = user.password || 'campus123';
  if (currentPassword !== expectedCurrent) {
    return res.status(401).json({ error: 'Current password is incorrect. Please verify and re-enter.' });
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({ error: 'New password cannot be identical to the current password.' });
  }

  const timeInfo = getCurrentTimestamp();
  user.password = newPassword;
  user.passwordChanged = true;
  user.passwordChangedAt = `${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}`;

  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'SECURITY',
    badgeColor: 'login',
    actorRole: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    actorName: user.name,
    description: `User ${user.name} (${user.role.toUpperCase()}, ID: ${user.loginId || user.roll || user.staffId || user.id}) updated account password via backend API on ${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}.`,
    timeInfo: timeInfo
  };

  db.activityHistory.unshift(logEntry);
  if (db.activityHistory.length > 200) db.activityHistory.pop();
  saveDb(db);

  return res.json({
    success: true,
    message: `Password updated successfully for ${user.name}!`,
    updatedAt: user.passwordChangedAt
  });
};

// POST /api/auth/register
// First-time self-registration for Administrators, Faculty, Students, and Parents
exports.register = (req, res) => {
  const {
    institutionId,
    role,
    loginId,
    name,
    password,
    dept,
    designation,
    sem,
    hostel,
    phone,
    parentPhone,
    email,
    wardRoll
  } = req.body || {};

  if (!institutionId || !institutionId.trim()) {
    return res.status(400).json({ error: 'Unique Institution ID is required to register.' });
  }

  const validRoles = ['admin', 'faculty', 'student', 'parent'];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: `Valid role is required (${validRoles.join(', ')}).` });
  }

  if (!loginId || !loginId.trim()) {
    const idLabels = {
      admin: 'Administrator Login ID',
      faculty: 'Faculty ID / Staff ID',
      student: 'Registration No. / Roll No.',
      parent: 'Parent ID'
    };
    return res.status(400).json({ error: `${idLabels[role] || 'Login ID'} is required.` });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full Name is required.' });
  }

  if (!password || password.trim().length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters.' });
  }

  const db = getDb();
  const normInstId = institutionId.trim().toUpperCase();
  const institution = Object.values(db.institutions || {}).find(
    i => i.id.toUpperCase() === normInstId || (i.code && i.code.toUpperCase() === normInstId)
  );

  if (!institution) {
    return res.status(404).json({
      error: `Institution with ID "${institutionId}" is not registered on the platform. Please verify the Institution ID or onboard your institution first.`
    });
  }

  // Check institutional license status
  if (institution.subscription && institution.subscription.status === 'EXPIRED') {
    return res.status(403).json({
      error: `Institutional License Expired: Registration for "${institution.name}" is locked until the institutional administrator renews the license.`
    });
  }

  const cleanId = loginId.trim();
  const searchKey = cleanId.toLowerCase();

  // Check duplicate ID under this institution
  const existingUser = Object.values(db.users || {}).find(
    u => u.institutionId === institution.id && (
      (u.loginId && u.loginId.toLowerCase() === searchKey) ||
      (u.staffId && u.staffId.toLowerCase() === searchKey) ||
      (u.roll && u.roll.toLowerCase() === searchKey) ||
      (u.id && u.id.toLowerCase() === searchKey)
    )
  );

  if (existingUser) {
    return res.status(400).json({
      error: `An account with ID "${cleanId}" is already registered under ${institution.name} as a ${existingUser.role.toUpperCase()}. Please sign in instead.`
    });
  }

  const timeInfo = getCurrentTimestamp();
  const cleanInstCode = institution.code || institution.id.replace(/[^a-zA-Z0-9]/g, '');
  const internalId = `${role}_${cleanInstCode.toLowerCase()}_${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const newUser = {
    id: internalId,
    loginId: cleanId,
    role: role,
    institutionId: institution.id,
    name: name.trim(),
    password: password.trim(),
    passwordChanged: false,
    createdBy: `First-Time Self-Registration (${institution.name})`,
    createdAt: `${timeInfo.day}, ${timeInfo.date}`
  };

  // Role-Specific Enrichment
  if (role === 'admin') {
    newUser.staffId = cleanId;
    newUser.dept = dept && dept.trim() ? dept.trim() : 'Central Academic Administration';
    newUser.designation = designation && designation.trim() ? designation.trim() : 'Campus Administrator';
    newUser.email = email && email.trim() ? email.trim() : '';
    newUser.avatar = '👨‍💼';
  } else if (role === 'faculty') {
    newUser.staffId = cleanId;
    newUser.dept = dept && dept.trim() ? dept.trim() : 'Computer Science & Engineering';
    newUser.designation = designation && designation.trim() ? designation.trim() : 'Assistant Professor';
    newUser.email = email && email.trim() ? email.trim() : '';
    newUser.phone = phone && phone.trim() ? phone.trim() : '';
    newUser.avatar = '👩‍🏫';
  } else if (role === 'student') {
    newUser.roll = cleanId;
    newUser.dept = dept && dept.trim() ? dept.trim() : 'Computer Science & Engineering';
    newUser.sem = sem && sem.trim() ? sem.trim() : '1st Semester';
    newUser.attendance = 100;
    newUser.attendanceAttended = 12;
    newUser.attendanceSessionsTotal = 12;
    newUser.hostel = hostel && hostel.trim() ? hostel.trim() : 'Main Campus Residence';
    newUser.phone = phone && phone.trim() ? phone.trim() : '';
    newUser.parentPhone = parentPhone && parentPhone.trim() ? parentPhone.trim() : '';
    newUser.avatar = '👨‍🎓';
    newUser.subjects = [
      { code: 'CS101', name: 'Programming Fundamentals', faculty: 'Department Faculty', attended: 6, total: 6, percentage: 100 },
      { code: 'CS102', name: 'Digital Logic Design', faculty: 'Department Faculty', attended: 6, total: 6, percentage: 100 }
    ];

    // Seed student fee ledger
    if (!db.fees) db.fees = {};
    db.fees[internalId] = {
      studentId: internalId,
      institutionId: institution.id,
      name: name.trim(),
      roll: cleanId,
      semester: newUser.sem,
      academicYear: '2026-27',
      totalFees: 50000,
      paidAmount: 50000,
      dueAmount: 0,
      status: 'PAID',
      dueDate: '15 Nov 2026',
      categories: [
        { id: 'tuition', name: 'Semester Academic Tuition', total: 40000, paid: 40000, due: 0, status: 'PAID' },
        { id: 'dev', name: 'Campus Digital Infrastructure', total: 10000, paid: 10000, due: 0, status: 'PAID' }
      ]
    };
  } else if (role === 'parent') {
    newUser.phone = phone && phone.trim() ? phone.trim() : '';
    newUser.avatar = '👪';

    // Link student ward if roll provided
    if (wardRoll && wardRoll.trim()) {
      const searchWard = wardRoll.trim().toLowerCase();
      const wardStudent = Object.values(db.users || {}).find(
        u => u.institutionId === institution.id && u.role === 'student' && (
          (u.roll && u.roll.toLowerCase() === searchWard) ||
          (u.loginId && u.loginId.toLowerCase() === searchWard)
        )
      );
      if (wardStudent) {
        newUser.wardId = wardStudent.id;
        newUser.wardName = wardStudent.name;
        wardStudent.parentId = internalId;
      } else {
        newUser.wardName = `Student Roll: ${wardRoll.trim()}`;
      }
    }
  }

  db.users[internalId] = newUser;

  // Audit history log
  if (!db.activityHistory) db.activityHistory = [];
  db.activityHistory.unshift({
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'REGISTRATION',
    badgeColor: 'login',
    actorRole: role.charAt(0).toUpperCase() + role.slice(1),
    actorName: name.trim(),
    institutionId: institution.id,
    description: `New ${role.toUpperCase()} account for "${name.trim()}" (ID: ${cleanId}) successfully registered under institution "${institution.name}" on ${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}.`,
    timeInfo: timeInfo
  });

  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `🎉 ${role.charAt(0).toUpperCase() + role.slice(1)} account for "${name.trim()}" registered successfully! You can now sign in using your credentials.`,
    user: newUser,
    institution: institution
  });
};
