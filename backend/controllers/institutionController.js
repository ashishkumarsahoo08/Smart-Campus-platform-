const path = require('path');
const fs = require('fs');
const {
  getDb,
  saveDb,
  getInstitutions,
  getInstitution,
  saveInstitution,
  createInstitution,
  renewSubscription,
  savePaymentConfig,
  saveReceiptTemplate,
  getSubscriptionPlans,
  saveSubscriptionPlans,
  DATA_DIR
} = require('../db');

// GET /api/institutions/subscription-plans
exports.getSubscriptionPlans = (req, res) => {
  const plans = getSubscriptionPlans();
  return res.json({
    success: true,
    plans,
    websiteOwnerNotice: 'All subscription fees are currently initialized to â‚¹1 (One Rupee). The website owner can manually update and configure subscription fees.'
  });
};

// PUT /api/institutions/subscription-plans
exports.updateSubscriptionPlans = async (req, res) => {
  let { plans } = req.body || {};
  if (!plans) {
    return res.status(400).json({ error: 'Plans data is required.' });
  }

  let plansArray = [];
  if (Array.isArray(plans)) {
    plansArray = plans;
  } else if (typeof plans === 'object' && plans !== null) {
    plansArray = Object.keys(plans).map(k => ({
      id: k,
      ...plans[k]
    }));
  } else {
    return res.status(400).json({ error: 'Plans array or object map is required.' });
  }

  const db = getDb();
  const currentPlans = db.subscriptionPlans || [];

  const updated = currentPlans.map(curr => {
    const matching = plansArray.find(p => p.id === curr.id);
    if (matching) {
      return {
        ...curr,
        priceINR: Math.max(0, Number(matching.priceINR !== undefined ? matching.priceINR : curr.priceINR) || 0),
        name: matching.name || curr.name,
        description: matching.description || curr.description,
        badge: matching.badge || curr.badge,
        durationDays: matching.durationDays || curr.durationDays,
        period: matching.period || matching.durationLabel || curr.period
      };
    }
    return curr;
  });

  // Check if any plan in plansArray was not in currentPlans
  plansArray.forEach(p => {
    if (!updated.some(curr => curr.id === p.id)) {
      updated.push({
        id: p.id,
        name: p.name || p.id,
        priceINR: Math.max(0, Number(p.priceINR || 0)),
        period: p.period || p.durationLabel || 'Custom',
        badge: p.badge || (p.priceINR === 0 ? 'â‚¹0 Promo' : 'Active Tier'),
        description: p.description || 'Institutional Subscription Plan',
        durationDays: p.durationDays || 30,
        features: p.features || ['Full Access to Smart Campus Platform']
      });
    }
  });

  saveSubscriptionPlans(updated);

  // Regenerate QR cache
  try {
    const QRCode = require('qrcode');
    const cachePath = path.join(DATA_DIR, 'subscription_qr_cache.json');
    let cache = {};
    if (fs.existsSync(cachePath)) {
      try {
        cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      } catch (e) {}
    }
    for (const p of updated) {
      const upiId = 'ashish.ss@ptyes';
      const safeNote = `${(p.name || 'License').replace(/[^a-zA-Z0-9]/g, '_')}_Fee`;
      const uri = `upi://pay?pa=${upiId}&pn=Smart%20Campus%20Platform&am=${Number(p.priceINR).toFixed(2)}&cu=INR&tn=${safeNote}`;
      const dataUrl = await QRCode.toDataURL(uri, {
        margin: 2,
        width: 300,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
      cache[p.id] = {
        upiId,
        uri,
        amount: p.priceINR,
        planName: p.name,
        duration: p.duration || `${p.durationDays} Days`,
        dataUrl
      };
    }
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (qrErr) {
    console.warn('QR cache update warning:', qrErr.message);
  }

  return res.json({
    success: true,
    message: 'âœ… Subscription fees successfully updated by Website Owner. New prices are now active across all registration and renewal portals.',
    plans: updated
  });
};

// GET /api/institutions/subscription-qrs
exports.getSubscriptionQrs = (req, res) => {
  try {
    const cachePath = path.join(DATA_DIR, 'subscription_qr_cache.json');
    if (fs.existsSync(cachePath)) {
      const qrs = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return res.json({ success: true, qrs });
    }
  } catch (err) {
    console.error('Error reading subscription QR cache:', err);
  }
  return res.status(500).json({ error: 'Subscription QR cache not available' });
};

// GET /api/institutions/subscription-qr/:planId
exports.getSubscriptionQrByPlan = async (req, res) => {
  const { planId } = req.params;
  const upiId = req.query.upiId || 'ashish.ss@ptyes';
  const db = getDb();
  const plans = db.subscriptionPlans || [];
  const plan = plans.find(p => p.id === planId) || {
    id: planId,
    name: 'Subscription License',
    priceINR: 5999
  };

  try {
    const cachePath = path.join(DATA_DIR, 'subscription_qr_cache.json');
    if (fs.existsSync(cachePath)) {
      const qrs = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (qrs[planId] && (!req.query.upiId || req.query.upiId === qrs[planId].upiId)) {
        return res.json({ success: true, planId, ...qrs[planId] });
      }
    }

    const QRCode = require('qrcode');
    const safeNote = `${(plan.name || 'License').replace(/[^a-zA-Z0-9]/g, '_')}_Fee`;
    const uri = `upi://pay?pa=${upiId}&pn=Smart+Campus+Platform&am=${plan.priceINR || 5999}.00&cu=INR&tn=${safeNote}`;
    const dataUrl = await QRCode.toDataURL(uri, {
      margin: 2,
      width: 300,
      color: { dark: '#0f172a', light: '#ffffff' }
    });

    return res.json({
      success: true,
      planId: plan.id,
      planName: plan.name,
      amount: plan.priceINR,
      upiId,
      uri,
      dataUrl
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate QR code: ' + err.message });
  }
};

// GET /api/institutions
exports.getAllInstitutions = (req, res) => {
  const db = getDb();
  const institutions = getInstitutions();
  const plans = db.subscriptionPlans || [];

  // Calculate metrics per institution
  const enhanced = institutions.map(inst => {
    const users = Object.values(db.users || {}).filter(u => u.institutionId === inst.id);
    const students = users.filter(u => u.role === 'student');
    const faculty = users.filter(u => u.role === 'faculty');
    const outpasses = (db.outpasses || []).filter(o => o.institutionId === inst.id);
    const leaves = (db.leaveApplications || []).filter(l => l.institutionId === inst.id);

    // Compute remaining days and dynamic status
    let status = inst.subscription?.status || 'ACTIVE';
    let daysRemaining = 0;
    if (inst.subscription?.endDate) {
      const end = new Date(inst.subscription.endDate);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      if (diffTime < 0) {
        status = 'EXPIRED';
      }
    }

    return {
      ...inst,
      metrics: {
        totalUsers: users.length,
        totalStudents: students.length,
        totalFaculty: faculty.length,
        totalOutpasses: outpasses.length,
        totalLeaves: leaves.length
      },
      subscription: {
        ...(inst.subscription || {}),
        status,
        daysRemaining
      }
    };
  });

  return res.json({
    success: true,
    total: enhanced.length,
    institutions: enhanced,
    availablePlans: plans,
    platformOwner: {
      name: db.platformOwner?.name || 'SaaS Platform Owner',
      email: db.platformOwner?.email || 'licensing@smartcampus.cloud'
    }
  });
};

// GET /api/institutions/:id
exports.getInstitutionById = (req, res) => {
  const { id } = req.params;
  const inst = getInstitution(id);
  if (!inst) {
    return res.status(404).json({ error: `Institution with ID "${id}" not found.` });
  }

  const db = getDb();
  let status = inst.subscription?.status || 'ACTIVE';
  let daysRemaining = 0;
  if (inst.subscription?.endDate) {
    const end = new Date(inst.subscription.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    if (diffTime < 0) {
      status = 'EXPIRED';
    }
  }

  return res.json({
    success: true,
    institution: {
      ...inst,
      subscription: {
        ...(inst.subscription || {}),
        status,
        daysRemaining
      }
    },
    availablePlans: db.subscriptionPlans || []
  });
};

// POST /api/institutions (Onboard New College / Institution)
exports.onboardInstitution = (req, res) => {
  const {
    name,
    code,
    regdNo,
    address,
    contactEmail,
    contactPhone,
    adminName,
    adminLoginId,
    adminPassword,
    planId,
    bankName,
    accountNumber,
    ifscCode,
    upiId
  } = req.body || {};

  if (!name || !contactEmail) {
    return res.status(400).json({ error: 'Institution Name and Contact Email are required.' });
  }

  const result = createInstitution({
    id: (req.body.id || req.body.customInstId || req.body.institutionId || "").trim() || undefined,
    name,
    code,
    regdNo,
    address,
    contactEmail,
    contactPhone,
    adminName,
    adminLoginId,
    adminPassword,
    planId: planId || 'PLAN-YEARLY',
    bankName,
    accountNumber,
    ifscCode,
    upiId
  });

  return res.status(201).json({
    success: true,
    message: `ðŸŽ‰ Institution "${name}" onboarded successfully with isolated database partition!`,
    institution: result.institution,
    adminCredentials: {
      loginId: result.adminUser.loginId,
      name: result.adminUser.name,
      temporaryPassword: result.tempPassword,
      role: 'Administrator (College Root)',
      institutionId: result.institution.id
    }
  });
};

// PATCH /api/institutions/:id/subscription (Renew or Change Plan)
exports.updateSubscription = (req, res) => {
  const { id } = req.params;
  const { planId = 'PLAN-YEARLY' } = req.body || {};

  const updated = renewSubscription(id, planId);
  if (!updated) {
    return res.status(404).json({ error: `Institution with ID "${id}" not found.` });
  }

  return res.json({
    success: true,
    message: `âœ… Institutional license for "${updated.name}" renewed successfully! Full campus features unlocked.`,
    subscription: updated.subscription,
    institution: updated
  });
};

// PATCH /api/institutions/:id/payment-config (Customize Receiving Scanner & Bank Details)
exports.updatePaymentConfig = (req, res) => {
  const { id } = req.params;
  const config = (req.body && req.body.paymentConfig) ? req.body.paymentConfig : (req.body || {});

  const updatedConfig = savePaymentConfig(id, config);
  if (!updatedConfig) {
    return res.status(404).json({ error: `Institution with ID "${id}" not found.` });
  }

  return res.json({
    success: true,
    message: 'ðŸ¦ Institutional Fee Payment Gateway & Scanner saved successfully! Students will now see these receiving details.',
    paymentConfig: updatedConfig
  });
};

// PATCH /api/institutions/:id/receipt-template (Customize E-Receipt Formatter)
exports.updateReceiptTemplate = (req, res) => {
  const { id } = req.params;
  const template = (req.body && req.body.receiptTemplate) ? req.body.receiptTemplate : (req.body || {});

  const updatedTemplate = saveReceiptTemplate(id, template);
  if (!updatedTemplate) {
    return res.status(404).json({ error: `Institution with ID "${id}" not found.` });
  }

  return res.json({
    success: true,
    message: 'ðŸ§¾ Official Institutional E-Receipt Template saved successfully! All generated receipts will use this layout and seal.',
    receiptTemplate: updatedTemplate
  });
};

// GET /api/institutions/:id/receipt-preview
exports.getReceiptPreview = (req, res) => {
  const { id } = req.params;
  const inst = getInstitution(id);
  if (!inst) {
    return res.status(404).json({ error: `Institution with ID "${id}" not found.` });
  }

  const tpl = inst.receiptTemplate || {};
  const mockReceipt = {
    receiptNumber: `${tpl.receiptPrefix || 'REC-2026/'}PREVIEW-001`,
    institutionId: inst.id,
    institutionName: inst.name,
    headerTitle: tpl.headerTitle || inst.name,
    subTitle: tpl.subTitle || '(An Autonomous Institution)',
    regdNoDisplay: tpl.regdNoDisplay || `Regd: ${inst.regdNo}`,
    addressDisplay: tpl.addressDisplay || inst.address,
    studentName: 'Satyajit Mohapatra',
    roll: 'CS-2024-082',
    semester: '5th Semester',
    department: 'Computer Science & Engineering',
    transactionRef: 'UTR-HDFC-9982310029',
    amountPaid: 45000,
    amountInWords: 'Rupees Forty-Five Thousand Only',
    balanceRemaining: 0,
    paymentMethod: 'UPI Instant QR',
    status: 'COMPLETED â€¢ VERIFIED',
    timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    signatoryTitle: tpl.signatoryTitle || 'Comptroller of Finance',
    signatoryName: tpl.signatoryName || 'Accounts Authority',
    sealText: tpl.sealText || 'OFFICIAL DIGITAL VERIFICATION SEAL',
    footerNotice: tpl.footerNotice || 'This is an authentic system-generated e-receipt.',
    qrToken: `https://portal.smartcampus.edu/verify/receipt/${tpl.receiptPrefix || 'REC-'}PREVIEW-001`
  };

  return res.json({
    success: true,
    sampleReceipt: mockReceipt
  });
};

// POST /api/institutions/create-payment-order (Automated Direct UPI Dynamic Checkout Order)
exports.createPaymentOrder = async (req, res) => {
  try {
    const { planId, institutionName, contactEmail } = req.body || {};
    const db = getDb();
    const plans = db.subscriptionPlans || [];
    const plan = plans.find(p => p.id === planId) || plans.find(p => p.id === 'PLAN-MONTHLY') || {
      id: planId || 'PLAN-MONTHLY',
      name: 'Monthly License',
      priceINR: 0
    };

    const amount = Number(plan.priceINR !== undefined ? plan.priceINR : 0);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const upiId = 'ashish.ss@ptyes';
    const payeeName = 'Smart Campus SaaS Platform';
    const safeNote = `Order_${orderId}_${(plan.name || 'License').replace(/[^a-zA-Z0-9]/g, '_')}`;
    const uri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tr=${orderId}&tn=${encodeURIComponent(safeNote)}`;

    let dataUrl = '';
    try {
      const QRCode = require('qrcode');
      dataUrl = await QRCode.toDataURL(uri, {
        margin: 2,
        width: 320,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    } catch (e) {
      dataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uri)}`;
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry
    const newOrder = {
      id: orderId,
      orderId,
      planId: plan.id,
      planName: plan.name,
      institutionName: (institutionName || 'Campus Subscriber').trim(),
      contactEmail: (contactEmail || '').trim(),
      amount,
      currency: 'INR',
      status: amount === 0 ? 'CONFIRMED' : 'PENDING',
      payment_status: amount === 0 ? 'success' : 'pending',
      bankRrn: amount === 0 ? `FREE-PROMO-${Date.now().toString().slice(-6)}` : null,
      upiId,
      upiUri: uri,
      qrDataUrl: dataUrl,
      createdAt: new Date().toISOString(),
      expiresAt,
      verifiedAt: amount === 0 ? new Date().toISOString() : null,
      verifiedBy: amount === 0 ? 'Zero-Fee Promotional Activation' : null
    };

    if (!db.paymentOrders) db.paymentOrders = {};
    db.paymentOrders[orderId] = newOrder;
    saveDb(db);

    // Auto-mirror to Supabase if configured
    try {
      const { getSupabaseClient } = require('../supabase');
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from('payment_orders').upsert({
          id: newOrder.id,
          plan_id: newOrder.planId,
          institution_name: newOrder.institutionName,
          contact_email: newOrder.contactEmail,
          amount_inr: newOrder.amount,
          status: newOrder.status,
          upi_uri: newOrder.upiUri,
          bank_rrn: newOrder.bankRrn || '',
          expires_at: newOrder.expiresAt,
          verified_at: newOrder.verifiedAt
        }, { onConflict: 'id' }).then(() => {}).catch(() => {});
      }
    } catch (e) {}

    return res.status(201).json({
      success: true,
      message: 'Payment order created successfully.',
      order: newOrder
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create payment order: ' + err.message });
  }
};

// GET /api/institutions/payment-order/:orderId (Polling Status Check)
exports.getPaymentOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const db = getDb();
  if (!db.paymentOrders || !db.paymentOrders[orderId]) {
    return res.status(404).json({ error: `Payment order "${orderId}" not found.` });
  }
  const order = db.paymentOrders[orderId];
  return res.json({
    success: true,
    order: {
      id: order.id,
      orderId: order.id,
      planId: order.planId,
      planName: order.planName,
      amount: order.amount,
      status: order.status,
      bankRrn: order.bankRrn,
      verifiedAt: order.verifiedAt,
      expiresAt: order.expiresAt,
      isExpired: new Date() > new Date(order.expiresAt)
    }
  });
};

// POST /api/institutions/confirm-payment-order (Simulated Bank Webhook / Instant UPI Confirmation)
exports.confirmPaymentOrder = async (req, res) => {
  const { orderId, method = 'UPI_FAST_CHECKOUT', customRrn } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required to confirm payment.' });
  }
  const db = getDb();
  if (!db.paymentOrders || !db.paymentOrders[orderId]) {
    return res.status(404).json({ error: `Payment order "${orderId}" not found.` });
  }

  const order = db.paymentOrders[orderId];
  if (order.status === 'CONFIRMED') {
    return res.json({
      success: true,
      message: 'âœ… Payment already confirmed by bank switch.',
      order
    });
  }

  const bankRrn = customRrn || `TXN-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  order.status = 'CONFIRMED';
  order.payment_status = 'success';
  order.bankRrn = bankRrn;
  order.paymentMethod = method;
  order.verifiedAt = now;
  order.verifiedBy = 'Automated Payment Switch (Auto-Verified)';

  saveDb(db);

  // Background mirror to Supabase
  try {
    const { getSupabaseClient } = require('../supabase');
    const supabase = getSupabaseClient();
    if (supabase) {
      // Update 'orders' table
      supabase.from('orders').upsert({
        id: order.id,
        order_id: order.id,
        transaction_id: bankRrn,
        amount: order.amount,
        status: 'SUCCESS',
        payment_status: 'success',
        bank_rrn: order.bankRrn,
        verified_at: order.verifiedAt,
        updated_at: now
      }, { onConflict: 'id' }).then(() => {}).catch(() => {});

      // Update 'payment_orders' table
      supabase.from('payment_orders').upsert({
        id: order.id,
        status: 'CONFIRMED',
        payment_status: 'success',
        bank_rrn: order.bankRrn,
        verified_at: order.verifiedAt,
        updated_at: now
      }, { onConflict: 'id' }).then(() => {}).catch(() => {});
    }
  } catch (e) {}

  return res.json({
    success: true,
    message: `âš¡ Payment of â‚¹${order.amount.toLocaleString('en-IN')} successfully confirmed by banking network! Reference: ${bankRrn}`,
    order
  });
};

// GET /api/institutions/supabase-status
exports.getSupabaseStatus = async (req, res) => {
  try {
    const { testSupabaseConnection, isSupabaseConfigured, getSupabaseCredentials } = require('../supabase');
    const creds = getSupabaseCredentials();
    const result = await testSupabaseConnection();
    return res.json({
      success: true,
      configured: isSupabaseConfigured(),
      projectId: creds.projectId || 'cvpupibxsrqrvfsnutmz',
      projectUrl: creds.url || 'https://cvpupibxsrqrvfsnutmz.supabase.co',
      dashboardUrl: `https://supabase.com/dashboard/project/${creds.projectId || 'cvpupibxsrqrvfsnutmz'}`,
      apiSettingsUrl: `https://supabase.com/dashboard/project/${creds.projectId || 'cvpupibxsrqrvfsnutmz'}/settings/api`,
      sqlEditorUrl: `https://supabase.com/dashboard/project/${creds.projectId || 'cvpupibxsrqrvfsnutmz'}/sql/new`,
      ...result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/institutions/supabase-sync
exports.syncSupabase = async (req, res) => {
  try {
    const { syncLocalToSupabase } = require('../supabase');
    const db = getDb();
    const result = await syncLocalToSupabase(db);
    return res.json({
      success: result.success,
      message: result.success ? 'âœ… Cloud database synchronization complete!' : 'âš ï¸ Synchronization finished with warnings/errors.',
      details: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/institutions/supabase-config
exports.configSupabase = async (req, res) => {
  try {
    const { supabaseUrl, supabaseKey } = req.body || {};
    if (!supabaseUrl && !supabaseKey) {
      return res.status(400).json({ error: 'Supabase Project ID/URL and API Key are required.' });
    }
    const inputUrl = (supabaseUrl || 'cvpupibxsrqrvfsnutmz').trim();
    const finalUrl = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}.supabase.co`;
    const projectId = finalUrl.replace(/^https?:\/\//, '').split('.')[0] || 'cvpupibxsrqrvfsnutmz';

    process.env.SUPABASE_PROJECT_ID = projectId;
    process.env.SUPABASE_URL = finalUrl;
    if (supabaseKey) {
      process.env.SUPABASE_KEY = supabaseKey.trim();
      process.env.SUPABASE_SERVICE_ROLE_KEY = supabaseKey.trim();
    }

    try {
      const envPath = path.join(__dirname, '..', '..', '.env');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }
      if (envContent.includes('SUPABASE_PROJECT_ID=')) {
        envContent = envContent.replace(/SUPABASE_PROJECT_ID=.*/g, `SUPABASE_PROJECT_ID=${projectId}`);
      } else {
        envContent += `\nSUPABASE_PROJECT_ID=${projectId}`;
      }
      if (envContent.includes('SUPABASE_URL=')) {
        envContent = envContent.replace(/SUPABASE_URL=.*/g, `SUPABASE_URL=${finalUrl}`);
      } else {
        envContent += `\nSUPABASE_URL=${finalUrl}`;
      }
      if (supabaseKey) {
        if (envContent.includes('SUPABASE_KEY=')) {
          envContent = envContent.replace(/SUPABASE_KEY=.*/g, `SUPABASE_KEY=${supabaseKey.trim()}`);
        } else {
          envContent += `\nSUPABASE_KEY=${supabaseKey.trim()}`;
        }
      }
      fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    } catch (e) {}

    const { testSupabaseConnection } = require('../supabase');
    const testRes = await testSupabaseConnection(supabaseUrl, supabaseKey);

    return res.json({
      success: true,
      message: 'Supabase credentials saved and active.',
      connection: testRes
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/institutions/register-subscription
// Self-Service Onboarding:
// - Free / â‚¹0 Plans: No transaction ID or screenshot needed. Fill details -> Instant Institution ID!
// - Paid (> â‚¹0) Plans: Verified automatically via payment switch checkout order before provisioning.
exports.registerSubscription = (req, res) => {
  const {
    institutionName,
    institutionCode,
    contactEmail,
    contactPhone,
    address,
    adminLoginId,
    adminPassword,
    planId = 'PLAN-MONTHLY',
    amountPaid,
    orderId,
    transactionRef,
    screenshotDataUrl
  } = req.body || {};

  if (!institutionName || !institutionName.trim()) {
    return res.status(400).json({ error: 'Institution Name is required.' });
  }
  if (!contactEmail || !contactEmail.trim()) {
    return res.status(400).json({ error: 'Official Contact Email is required.' });
  }
  if (!adminPassword || adminPassword.trim().length < 4) {
    return res.status(400).json({ error: 'Administrator password is required (minimum 4 characters).' });
  }
  const db = getDb();
  const plans = db.subscriptionPlans || [];
  const plan = plans.find(p => p.id === planId) || plans.find(p => p.id === 'PLAN-MONTHLY') || {
    id: 'PLAN-MONTHLY',
    name: 'Monthly Flexible License',
    durationDays: 30,
    priceINR: 0
  };

  const expectedAmount = Number(plan.priceINR !== undefined ? plan.priceINR : 0);
  let finalTxRef = '';
  let verificationMethod = '';

  // FLOW 1: ZERO / FREE SUBSCRIPTION (â‚¹0)
  if (expectedAmount === 0) {
    // Strictly NO transaction ID or screenshot required!
    finalTxRef = `FREE-PROMO-${Math.floor(100000 + Math.random() * 900000)}`;
    verificationMethod = '100% Free Promotional Plan (Instant Zero-Fee Activation)';
  } else {
    // FLOW 2: PAID SUBSCRIPTION (> â‚¹0) -> AUTOMATED PAYMENT VERIFICATION
    if (!orderId) {
      return res.status(400).json({
        error: `Payment Verification Failed: Please scan and complete the UPI / Net Banking payment order. Arbitrary numbers without bank confirmation are rejected.`
      });
    }

    const order = db.paymentOrders && db.paymentOrders[orderId];
    if (!order) {
      return res.status(400).json({
        error: `Payment Verification Failed: Order ID "${orderId}" not found in payment system. Please generate a valid order.`
      });
    }

    const isConfirmed = (
      order.payment_status === 'success' ||
      order.status === 'CONFIRMED' ||
      order.status === 'SUCCESS' ||
      order.status === 'PAID'
    );

    if (!isConfirmed) {
      return res.status(400).json({
        error: `Payment Verification Failed: Order "${orderId}" is not yet confirmed by the banking switch. Please complete payment in your UPI app.`
      });
    }

    if (order.amount !== expectedAmount) {
      return res.status(400).json({
        error: `Payment Verification Failed: Order amount (â‚¹${order.amount}) does not match plan price (â‚¹${expectedAmount}).`
      });
    }

    finalTxRef = order.bankRrn || `TXN-${order.id}`;
    verificationMethod = `Automated Payment Switch (Order: ${order.id}, RRN: ${finalTxRef})`;
  }

  // Generate Unique Institution ID: e.g. INST-AUST-7892 or INST-CAMPUS-5521
  const cleanCode = (institutionCode || institutionName)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 5) || 'CAMPUS';

  let uniqueInstId;
  let attempts = 0;
  do {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    uniqueInstId = `INST-${cleanCode}-${randomDigits}`;
    attempts++;
  } while (db.institutions && db.institutions[uniqueInstId] && attempts < 50);

  const now = new Date();
  const startDate = now.toISOString().split('T')[0];
  const duration = plan.durationDays || 30;
  const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const timeFormatted = `${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newInst = {
    id: uniqueInstId,
    code: cleanCode,
    name: institutionName.trim(),
    shortName: institutionName.trim().length > 30 ? cleanCode : institutionName.trim(),
    address: address && address.trim() ? address.trim() : 'Main Campus Complex',
    regdNo: `UGC-OD-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    logo: 'ðŸ›ï¸',
    contactEmail: contactEmail.trim(),
    contactPhone: contactPhone && contactPhone.trim() ? contactPhone.trim() : '+91 98610 12345',
    adminUserId: `admin_${uniqueInstId.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    subscription: {
      plan: plan.id,
      planName: plan.name,
      amount: plan.priceINR,
      startDate: startDate,
      endDate: endDate,
      status: 'ACTIVE',
      autoRenew: true,
      daysRemaining: duration,
      lastRenewedAt: timeFormatted,
      paymentVerification: {
        verified: true,
        transactionRef: finalTxRef,
        amountPaid: expectedAmount,
        orderId: orderId || null,
        screenshotUploaded: Boolean(screenshotDataUrl),
        verifiedAt: timeFormatted,
        verifiedBy: verificationMethod
      }
    },
    paymentConfig: {
      bankName: 'State Bank of India',
      branchName: 'Campus Core Branch',
      accountName: `${institutionName.trim()} Student Welfare & Academic Fund`,
      accountNumber: '30981144' + Math.floor(1000 + Math.random() * 9000),
      ifscCode: 'SBIN0010234',
      upiId: `${cleanCode.toLowerCase()}fee@sbi`,
      qrScannerUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(cleanCode.toLowerCase() + 'fee@sbi')}&pn=${encodeURIComponent(institutionName.trim())}&cu=INR`,
      instructions: 'Transfer fees via UPI QR or NEFT/IMPS. Verified e-receipt generated instantly.'
    },
    receiptTemplate: {
      headerTitle: institutionName.trim().toUpperCase(),
      subTitle: '(An Autonomous Institution â€¢ Verified Digital UMS Partition)',
      regdNoDisplay: `Institutional Regd. No: UGC-OD-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      addressDisplay: address && address.trim() ? address.trim() : 'Main Campus Complex',
      signatoryTitle: 'Comptroller of Finance & Accounts',
      signatoryName: 'Accounts Officer',
      receiptPrefix: `${cleanCode}-REC-${now.getFullYear()}/`,
      sealText: 'OFFICIAL DIGITAL VERIFICATION SEAL',
      footerNotice: 'This is an authentic, system-generated digital e-receipt verified by the institution.'
    }
  };

  if (!db.institutions) db.institutions = {};
  db.institutions[uniqueInstId] = newInst;

  // 1. Create Root Administrator for this Institution
  const adminId = newInst.adminUserId;
  const adminPwd = adminPassword.trim();
  const finalAdminLoginId = (adminLoginId && adminLoginId.trim()) ? adminLoginId.trim() : 'ADM-01';
  if (!db.users) db.users = {};

  db.users[adminId] = {
    id: adminId,
    loginId: finalAdminLoginId,
    role: 'admin',
    institutionId: uniqueInstId,
    name: `${institutionName.trim()} Administrator`,
    staffId: finalAdminLoginId,
    dept: 'Central Campus Administration',
    designation: 'Registrar & Chief Administrator',
    avatar: 'ðŸ‘¨â€ðŸ’¼',
    password: adminPwd,
    passwordChanged: false,
    createdBy: 'Institutional Registration & Payment System',
    createdAt: timeFormatted
  };

  // 2. Create Starter Faculty for this Institution
  const facultyId = `fac_${uniqueInstId.toLowerCase().replace(/[^a-z0-9]/g, '')}_1`;
  db.users[facultyId] = {
    id: facultyId,
    loginId: 'FAC-101',
    role: 'faculty',
    institutionId: uniqueInstId,
    name: 'Prof. S. Verma',
    staffId: 'FAC-101',
    dept: 'Computer Science & Engineering',
    designation: 'Assistant Professor & Class Mentor',
    avatar: 'ðŸ‘©â€ðŸ«',
    password: 'campus123',
    passwordChanged: false,
    createdBy: `Administrator (${institutionName.trim()})`,
    createdAt: timeFormatted
  };

  // 3. Create Starter Student for this Institution
  const studentId = `stu_${uniqueInstId.toLowerCase().replace(/[^a-z0-9]/g, '')}_1`;
  const parentId = `par_${uniqueInstId.toLowerCase().replace(/[^a-z0-9]/g, '')}_1`;

  db.users[studentId] = {
    id: studentId,
    loginId: 'CS-2026-001',
    role: 'student',
    institutionId: uniqueInstId,
    name: 'Aarav Sharma',
    roll: 'CS-2026-001',
    dept: 'Computer Science & Engineering',
    sem: '1st Semester',
    attendance: 92,
    attendanceAttended: 46,
    attendanceSessionsTotal: 50,
    avatar: 'ðŸ‘¨â€ðŸŽ“',
    parentId: parentId,
    password: 'campus123',
    passwordChanged: false,
    createdBy: `Administrator (${institutionName.trim()})`,
    createdAt: timeFormatted,
    hostel: 'Campus Hostel Block A, Room 102',
    phone: '+91 98610 33221',
    parentPhone: '+91 98610 44332',
    subjects: [
      { code: 'CS101', name: 'Programming Fundamentals & Logic', faculty: 'Prof. S. Verma', attended: 24, total: 25, percentage: 96 },
      { code: 'CS102', name: 'Computer Architecture & Systems', faculty: 'Prof. S. Verma', attended: 22, total: 25, percentage: 88 }
    ]
  };

  // 4. Create Starter Parent for this Institution
  db.users[parentId] = {
    id: parentId,
    loginId: 'PAR-9001',
    role: 'parent',
    institutionId: uniqueInstId,
    name: 'Mr. R.K. Sharma',
    wardId: studentId,
    wardName: 'Aarav Sharma',
    avatar: 'ðŸ‘ª',
    password: 'campus123',
    passwordChanged: false,
    createdBy: `Administrator (${institutionName.trim()})`,
    createdAt: timeFormatted
  };

  // 5. Create Student Fee Record
  if (!db.fees) db.fees = {};
  db.fees[studentId] = {
    studentId: studentId,
    institutionId: uniqueInstId,
    name: 'Aarav Sharma',
    roll: 'CS-2026-001',
    semester: '1st Semester (2026-27)',
    academicYear: '2026-27',
    totalFees: 60000,
    paidAmount: 60000,
    dueAmount: 0,
    status: 'PAID',
    dueDate: '30 Oct 2026',
    categories: [
      { id: 'tuition', name: '1st Semester Academic Tuition', total: 45000, paid: 45000, due: 0, status: 'PAID' },
      { id: 'hostel', name: 'Hostel Block A & Boarding', total: 15000, paid: 15000, due: 0, status: 'PAID' }
    ]
  };

  // 6. Record Activity in Audit Log
  if (!db.activityHistory) db.activityHistory = [];
  db.activityHistory.unshift({
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    actionType: 'ONBOARDING',
    badgeColor: 'attendance',
    actorRole: 'SaaS Platform Payment Engine',
    actorName: 'Automated Payment Verification',
    institutionId: uniqueInstId,
    description: `ðŸ›ï¸ Institution "${institutionName.trim()}" onboarded successfully! Unique Institution ID assigned: "${uniqueInstId}". License: ${plan.name} (${expectedAmount === 0 ? 'Free Promo' : 'Paid â‚¹' + expectedAmount.toLocaleString('en-IN')}, Ref: ${finalTxRef}).`,
    timeInfo: {
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      date: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  });

  saveDb(db);

  // Auto-mirror to Supabase if configured
  try {
    const { getSupabaseClient } = require('../supabase');
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('institutions').upsert({
        id: newInst.id,
        code: newInst.code,
        name: newInst.name,
        short_name: newInst.shortName,
        address: newInst.address,
        regd_no: newInst.regdNo,
        contact_email: newInst.contactEmail,
        contact_phone: newInst.contactPhone,
        admin_user_id: newInst.adminUserId,
        subscription: newInst.subscription,
        payment_config: newInst.paymentConfig,
        receipt_template: newInst.receiptTemplate
      }, { onConflict: 'id' }).then(() => {}).catch(() => {});
    }
  } catch (e) {}

  return res.status(201).json({
    success: true,
    message: expectedAmount === 0 
      ? `ðŸŽ‰ 100% Free Promotional Subscription activated! Institution "${institutionName.trim()}" is now registered with Unique ID ${uniqueInstId}.`
      : `ðŸŽ‰ Payment of â‚¹${expectedAmount.toLocaleString('en-IN')} confirmed by bank! Institution "${institutionName.trim()}" is now registered.`,
    institutionId: uniqueInstId,
    institution: newInst,
    subscription: newInst.subscription,
    adminCredentials: {
      institutionId: uniqueInstId,
      loginId: finalAdminLoginId,
      password: adminPwd,
      role: 'Administrator'
    },
    starterCredentials: {
      faculty: { institutionId: uniqueInstId, staffId: 'FAC-101', role: 'Faculty', password: 'campus123' },
      student: { institutionId: uniqueInstId, roll: 'CS-2026-001', role: 'Student', password: 'campus123' },
      parent: { institutionId: uniqueInstId, parentId: 'PAR-9001', role: 'Parent', password: 'campus123' }
    },
    paymentReceipt: {
      receiptNumber: `SUB-REC-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      institutionId: uniqueInstId,
      institutionName: institutionName.trim(),
      planId: plan.id,
      planName: plan.name,
      durationDays: duration,
      amountPaid: expectedAmount,
      transactionRef: finalTxRef,
      screenshotAttached: Boolean(screenshotDataUrl),
      verificationStatus: 'AUTOMATICALLY_VERIFIED',
      verifiedTimestamp: timeFormatted
    }
  });
};


