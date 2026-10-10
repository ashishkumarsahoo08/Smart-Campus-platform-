const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');
const { getSupabaseClient, isSupabaseConfigured } = require('../supabase');

// Helper to safely sync with Supabase PostgreSQL cloud table if configured
async function syncToSupabaseCloud(table, payload) {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getSupabaseClient();
    if (!client) return;
    await client.from(table).upsert(payload);
  } catch (err) {
    console.warn(`[Supabase Sync Warning] Table ${table}:`, err.message);
  }
}

// GET /api/sync/all
router.get('/all', (req, res) => {
  try {
    const db = getDb();
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      institutions: db.institutions || {},
      users: db.users || {},
      passes: db.passes || [],
      leavePasses: db.leavePasses || [],
      notices: db.notices || [],
      customServices: db.customServices || [],
      studentFeedback: db.studentFeedback || [],
      feeReceipts: db.feeReceipts || [],
      certificates: db.certificates || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-user
router.post('/save-user', async (req, res) => {
  try {
    const user = req.body.user || req.body;
    if (!user || (!user.id && !user.loginId && !user.roll && !user.staffId)) {
      return res.status(400).json({ success: false, error: 'User identifier required.' });
    }
    const db = getDb();
    if (!db.users) db.users = {};
    const key = user.id || user.loginId || user.roll || user.staffId;
    db.users[key] = { ...(db.users[key] || {}), ...user, id: key, updatedAt: new Date().toISOString() };
    saveDb(db);

    syncToSupabaseCloud('users', {
      id: key,
      name: user.name,
      role: user.role,
      institution_id: user.institutionId,
      email: user.email,
      data: db.users[key]
    });

    return res.json({ success: true, message: 'User persisted successfully.', user: db.users[key] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-institution
router.post('/save-institution', async (req, res) => {
  try {
    const { institution, adminUser } = req.body;
    if (!institution || !institution.id) {
      return res.status(400).json({ success: false, error: 'Institution ID required.' });
    }
    const db = getDb();
    if (!db.institutions) db.institutions = {};
    const instId = institution.id.trim().toUpperCase();
    db.institutions[instId] = { ...(db.institutions[instId] || {}), ...institution, id: instId };

    if (adminUser) {
      if (!db.users) db.users = {};
      const adminKey = adminUser.id || adminUser.loginId || ('admin_' + instId.toLowerCase());
      db.users[adminKey] = { ...(db.users[adminKey] || {}), ...adminUser, id: adminKey, institutionId: instId, role: 'admin' };
    }
    saveDb(db);

    syncToSupabaseCloud('institutions', {
      id: instId,
      name: institution.name,
      code: instId,
      data: db.institutions[instId]
    });

    return res.json({ success: true, message: 'Institution persisted successfully.', institution: db.institutions[instId] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-bank-config
router.post('/save-bank-config', async (req, res) => {
  try {
    const { institutionId, bankName, accountNo, ifsc, upiId, qrCodeUrl } = req.body;
    if (!institutionId) {
      return res.status(400).json({ success: false, error: 'institutionId is required.' });
    }
    const db = getDb();
    if (!db.institutions) db.institutions = {};
    const instId = institutionId.trim().toUpperCase();
    const inst = db.institutions[instId] || { id: instId, name: instId + ' Campus' };
    inst.bankName = bankName;
    inst.accountNo = accountNo;
    inst.ifsc = ifsc;
    inst.upiId = upiId;
    if (qrCodeUrl) inst.qrCodeUrl = qrCodeUrl;
    db.institutions[instId] = inst;
    saveDb(db);

    syncToSupabaseCloud('institution_banking', {
      institution_id: instId,
      bank_name: bankName,
      account_no: accountNo,
      ifsc: ifsc,
      upi_id: upiId,
      qr_code_url: qrCodeUrl,
      updated_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Bank details saved permanently.', institution: inst });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-custom-service
router.post('/save-custom-service', (req, res) => {
  try {
    const service = req.body.service || req.body;
    if (!service || !service.id) return res.status(400).json({ success: false, error: 'Valid service object required.' });
    const db = getDb();
    if (!db.customServices) db.customServices = [];
    const idx = db.customServices.findIndex(s => s.id === service.id);
    if (idx >= 0) db.customServices[idx] = service;
    else db.customServices.push(service);
    saveDb(db);
    return res.json({ success: true, message: 'Custom service saved.', customServices: db.customServices });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/delete-custom-service
router.post('/delete-custom-service', (req, res) => {
  try {
    const { serviceId } = req.body;
    const db = getDb();
    if (db.customServices) {
      db.customServices = db.customServices.filter(s => s.id !== serviceId);
      saveDb(db);
    }
    return res.json({ success: true, message: 'Custom service deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-feedback
router.post('/save-feedback', (req, res) => {
  try {
    const feedback = req.body.feedback || req.body;
    if (!feedback || !feedback.id) return res.status(400).json({ success: false, error: 'Valid feedback object required.' });
    const db = getDb();
    if (!db.studentFeedback) db.studentFeedback = [];
    db.studentFeedback.unshift(feedback);
    saveDb(db);
    return res.json({ success: true, message: 'Feedback recorded.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-fee-receipt
router.post('/save-fee-receipt', (req, res) => {
  try {
    const receipt = req.body.receipt || req.body;
    if (!receipt || !receipt.id) return res.status(400).json({ success: false, error: 'Valid receipt object required.' });
    const db = getDb();
    if (!db.feeReceipts) db.feeReceipts = [];
    db.feeReceipts.unshift(receipt);
    saveDb(db);
    return res.json({ success: true, message: 'Fee receipt recorded.', receipt });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-certificate
router.post('/save-certificate', (req, res) => {
  try {
    const cert = req.body.cert || req.body;
    if (!cert || !cert.id) return res.status(400).json({ success: false, error: 'Valid certificate object required.' });
    const db = getDb();
    if (!db.certificates) db.certificates = [];
    db.certificates.unshift(cert);
    saveDb(db);
    return res.json({ success: true, message: 'Certificate recorded.', cert });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/sync/save-complaint
router.post('/save-complaint', (req, res) => {
  try {
    const complaint = req.body.complaint || req.body;
    if (!complaint || !complaint.id) return res.status(400).json({ success: false, error: 'Valid complaint object required.' });
    const db = getDb();
    if (!db.complaints) db.complaints = [];
    db.complaints.unshift(complaint);
    saveDb(db);
    return res.json({ success: true, message: 'Complaint recorded.', complaint });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
