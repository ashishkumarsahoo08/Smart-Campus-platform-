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

// GET /api/feedback
exports.getAllFeedback = (req, res) => {
  const db = getDb();
  const { type } = req.query;
  let items = db.feedbackList || [];

  if (type) {
    items = items.filter(f => f.type.toLowerCase() === type.toLowerCase());
  }

  return res.json({
    success: true,
    total: items.length,
    feedback: items
  });
};

// POST /api/feedback
exports.submitFeedback = (req, res) => {
  const { type, category, targetName, courseCode, studentId, studentDisplay, isAnonymous, rating, ratingsDetail, comments, location, isUrgent } = req.body;

  if (!type || !comments) {
    return res.status(400).json({ error: 'Feedback type and comments are required.' });
  }

  const db = getDb();
  const timeInfo = getCurrentTimestamp();
  const newId = 'FB-' + Math.floor(100 + Math.random() * 900);

  const entry = {
    id: newId,
    type: type.toUpperCase(), // 'FACULTY' or 'CAMPUS'
    category: category || 'General Academic Feedback',
    targetName: targetName || 'Faculty / Campus Service',
    courseCode: courseCode || null,
    studentId: studentId || 'student1',
    studentDisplay: isAnonymous ? 'Anonymous Student' : (studentDisplay || 'Enrolled Student'),
    isAnonymous: !!isAnonymous,
    rating: typeof rating === 'number' ? rating : 4.5,
    ratingsDetail: ratingsDetail || {},
    location: location || null,
    isUrgent: !!isUrgent,
    comments: comments.trim(),
    date: timeInfo.date,
    time: timeInfo.time,
    status: isUrgent ? 'Action Required (Escalated)' : 'Received'
  };

  db.feedbackList.unshift(entry);

  const logEntry = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'FEEDBACK',
    badgeColor: 'gate',
    actorRole: 'Student',
    actorName: entry.studentDisplay,
    description: `Submitted ${entry.type} feedback for ${entry.targetName} (${entry.rating}⭐) on ${timeInfo.day}, ${timeInfo.date} at ${timeInfo.time}.`,
    timeInfo: timeInfo
  };

  db.activityHistory.unshift(logEntry);
  saveDb(db);

  return res.status(201).json({
    success: true,
    message: `${entry.type === 'FACULTY' ? 'Teaching appraisal' : 'Campus facility feedback'} submitted successfully!`,
    feedback: entry
  });
};
