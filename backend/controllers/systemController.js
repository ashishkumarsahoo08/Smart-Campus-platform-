const { getDb, saveDb, resetToCleanDb, populateFullDemoData } = require('../db');
const os = require('os');

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// GET /api/system/history
exports.getActivityHistory = (req, res) => {
  const db = getDb();
  const { role, action } = req.query;
  let items = db.activityHistory || [];

  if (role && role !== 'all') {
    items = items.filter(it => it.actorRole.toLowerCase() === role.toLowerCase());
  }
  if (action && action !== 'all') {
    items = items.filter(it => it.actionType === action);
  }

  return res.json({
    success: true,
    total: items.length,
    history: items
  });
};

// GET /api/system/sms-logs
exports.getSmsLogs = (req, res) => {
  const db = getDb();
  return res.json({
    success: true,
    total: (db.smsLogs || []).length,
    logs: db.smsLogs || []
  });
};

// GET /api/system/network-info
exports.getNetworkInfo = (req, res) => {
  const localIp = getLocalIp();
  const httpPort = process.env.HTTP_PORT || 3042;
  const httpsPort = process.env.HTTPS_PORT || 3443;
  return res.json({
    ip: localIp,
    httpPort,
    httpsPort,
    httpUrl: `http://${localIp}:${httpPort}/`,
    httpsUrl: `https://${localIp}:${httpsPort}/`
  });
};

// GET /api/system/api-config
exports.getApiConfigs = (req, res) => {
  const db = getDb();
  const settings = db.apiSettings || {};

  const rapidapiConfig = {
    provider: settings.rapidapi?.provider || 'RapidAPI Multilingual Engine',
    apiKey: settings.rapidapi?.apiKey || settings.bhasini?.apiKey || '',
    host: settings.rapidapi?.host || 'google-translate1.p.rapidapi.com',
    configured: Boolean(settings.rapidapi?.apiKey || settings.bhasini?.apiKey),
    hasKey: Boolean(settings.rapidapi?.apiKey || settings.bhasini?.apiKey),
    status: (settings.rapidapi?.apiKey || settings.bhasini?.apiKey)
      ? '🟢 Live RapidAPI Engine Connected'
      : '🟡 Active (Local Neural Campus Bridge)',
    portalUrl: 'https://rapidapi.com/category/Translation',
    requestInstructions: 'Step 1: Sign up at rapidapi.com (free 30-second signup)\nStep 2: Copy your X-RapidAPI-Key\nStep 3: Paste key below to activate live multi-language translation.'
  };

  const grokApiKey = settings.voiceAssistant?.grokApiKey || process.env.GROK_API_KEY || process.env.XAI_API_KEY || '';
  const grokConfig = {
    provider: settings.voiceAssistant?.provider || 'Grok AI (xAI) + Web Speech Neural Engine',
    model: settings.voiceAssistant?.model || 'grok-beta',
    apiKey: grokApiKey,
    configured: Boolean(grokApiKey),
    hasGrokKey: Boolean(grokApiKey),
    status: grokApiKey ? '🟢 Live xAI Grok Cloud Connected' : '🟡 Active (Browser Speech + Campus AI Brain)',
    portalUrl: 'https://console.x.ai/',
    requestInstructions: 'Step 1: Visit console.x.ai or aistudio.google.com\nStep 2: Create a project and generate an API key.\nStep 3: Paste key below to activate cloud LLM reasoning.'
  };

  return res.json({
    success: true,
    apiSettings: {
      rapidapi: rapidapiConfig,
      bhasini: rapidapiConfig,
      voiceAssistant: grokConfig
    },
    config: {
      rapidapi: rapidapiConfig,
      bhashini: rapidapiConfig,
      grok: grokConfig
    }
  });
};

// POST /api/system/api-config
exports.saveApiConfig = (req, res) => {
  const body = req.body || {};
  const db = getDb();

  if (!db.apiSettings) db.apiSettings = {};

  // Support RapidAPI payload (nested: body.rapidapi or body.bhashini or body.bhasini)
  const rapidPayload = body.rapidapi || body.bhashini || body.bhasini;
  if (rapidPayload) {
    if (!db.apiSettings.rapidapi) db.apiSettings.rapidapi = {};
    if (rapidPayload.apiKey !== undefined) db.apiSettings.rapidapi.apiKey = rapidPayload.apiKey.trim();
    if (rapidPayload.host !== undefined) db.apiSettings.rapidapi.host = rapidPayload.host.trim();
    db.apiSettings.rapidapi.provider = 'RapidAPI Multilingual Engine';
    db.apiSettings.rapidapi.configured = Boolean(db.apiSettings.rapidapi.apiKey);
    db.apiSettings.rapidapi.status = db.apiSettings.rapidapi.apiKey
      ? '🟢 Live RapidAPI Engine Connected'
      : '🟡 Active (Local Neural Campus Bridge)';
    // Sync with legacy key
    db.apiSettings.bhasini = { ...db.apiSettings.rapidapi };
  }

  // Support nested: body.grok or body.voiceAssistant
  const grokPayload = body.grok || body.voiceAssistant;
  if (grokPayload) {
    if (!db.apiSettings.voiceAssistant) db.apiSettings.voiceAssistant = {};
    if (grokPayload.apiKey !== undefined) db.apiSettings.voiceAssistant.grokApiKey = grokPayload.apiKey.trim();
    if (grokPayload.model !== undefined) db.apiSettings.voiceAssistant.model = grokPayload.model.trim();
    db.apiSettings.voiceAssistant.status = db.apiSettings.voiceAssistant.grokApiKey
      ? '🟢 Live xAI Grok Cloud Connected'
      : '🟡 Active (Browser Speech + Campus AI Brain)';
  }

  // Support flat keys: rapidApiKey, rapidApiHost, bhasiniApiKey, grokApiKey, etc.
  const { provider, rapidApiKey, rapidApiHost, bhasiniApiKey, grokApiKey, grokModel } = body;
  const translationApiKey = rapidApiKey !== undefined ? rapidApiKey : bhasiniApiKey;
  if (provider === 'rapidapi' || provider === 'bhasini' || translationApiKey !== undefined) {
    if (!db.apiSettings.rapidapi) db.apiSettings.rapidapi = {};
    if (translationApiKey !== undefined) db.apiSettings.rapidapi.apiKey = translationApiKey.trim();
    if (rapidApiHost !== undefined) db.apiSettings.rapidapi.host = rapidApiHost.trim();
    db.apiSettings.rapidapi.provider = 'RapidAPI Multilingual Engine';
    db.apiSettings.rapidapi.configured = Boolean(db.apiSettings.rapidapi.apiKey);
    db.apiSettings.rapidapi.status = db.apiSettings.rapidapi.apiKey
      ? '🟢 Live RapidAPI Engine Connected'
      : '🟡 Active (Local Neural Campus Bridge)';
    db.apiSettings.bhasini = { ...db.apiSettings.rapidapi };
  }

  if (provider === 'grok' || grokApiKey !== undefined) {
    if (!db.apiSettings.voiceAssistant) db.apiSettings.voiceAssistant = {};
    if (grokApiKey !== undefined) db.apiSettings.voiceAssistant.grokApiKey = grokApiKey.trim();
    if (grokModel !== undefined) db.apiSettings.voiceAssistant.model = grokModel.trim();
    db.apiSettings.voiceAssistant.status = db.apiSettings.voiceAssistant.grokApiKey
      ? '🟢 Live xAI Grok Cloud Connected'
      : '🟡 Active (Browser Speech + Campus AI Brain)';
  }

  saveDb(db);

  return res.json({
    success: true,
    message: 'RapidAPI configuration saved and updated successfully in institutional database!',
    updatedSettings: db.apiSettings
  });
};

// POST /api/system/reset-clean (Wipes all dummy records, leaves only 1 master admin)
exports.resetToCleanSlate = (req, res) => {
  const { adminName = 'Dr. R.N. Sen', adminLoginId = 'ADM-001', adminPassword = 'campus123' } = req.body || {};
  const cleanDb = resetToCleanDb(adminName, adminLoginId, adminPassword);
  return res.json({
    success: true,
    message: 'Institutional Database reset to Clean Slate (Production Mode) successfully. All dummy demo data removed.',
    mode: 'CLEAN_SLATE',
    usersCount: Object.keys(cleanDb.users).length,
    activeAdmin: cleanDb.users.admin
  });
};

// POST /api/system/load-demo (Re-seeds showcase demo data for presentations)
exports.loadDemoData = (req, res) => {
  const demoDb = populateFullDemoData();
  return res.json({
    success: true,
    message: 'Sample demonstration data loaded successfully for committee evaluation and presentation testing.',
    mode: 'DEMO',
    usersCount: Object.keys(demoDb.users).length,
    outpassCount: (demoDb.outpasses || []).length,
    leaveCount: (demoDb.leaveApplications || []).length
  });
};

// GET /api/system/db-mode
exports.getDatabaseMode = (req, res) => {
  const db = getDb();
  const userCount = Object.keys(db.users || {}).length;
  const isClean = db.mode === 'CLEAN_SLATE' || userCount <= 1;
  return res.json({
    success: true,
    mode: isClean ? 'CLEAN_SLATE' : 'DEMO',
    userCount,
    outpassCount: (db.outpasses || []).length,
    leaveCount: (db.leaveApplications || []).length,
    attendanceCount: (db.attendanceSessions || []).length
  });
};
