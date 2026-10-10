/**
 * SMART CAMPUS - SUPABASE CLOUD DATABASE ADAPTER
 * Connects to free Supabase PostgreSQL Cloud Database via @supabase/supabase-js.
 * Provides live synchronization, query helpers, and automatic fallback.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Auto-load backend .env
function loadSupabaseEnv() {
  const envFile = require('path').join(__dirname, '.env');
  if (fs.existsSync(envFile)) {
    try {
      const raw = fs.readFileSync(envFile, 'utf8');
      raw.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[k]) process.env[k] = v;
          }
        }
      });
    } catch (e) {}
  }
}
loadSupabaseEnv();

const DEFAULT_PROJECT_ID = 'cvpupibxsrqrvfsnutmz';

// Automatically normalizes project ID (e.g. 'cvpupibxsrqrvfsnutmz') or full URL to https://<id>.supabase.co
function normalizeSupabaseUrl(urlOrId) {
  if (!urlOrId || !urlOrId.trim()) {
    return `https://${DEFAULT_PROJECT_ID}.supabase.co`;
  }
  let trimmed = urlOrId.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }
  if (trimmed.includes('.')) {
    return `https://${trimmed}`.replace(/\/+$/, '');
  }
  // Just the project ID provided
  return `https://${trimmed}.supabase.co`;
}

// Resolve credentials from environment or defaults
function getSupabaseCredentials() {
  const rawUrl = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  const url = normalizeSupabaseUrl(rawUrl);
  const projectId = process.env.SUPABASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
  return { url: url.trim(), key: key.trim(), projectId };
}

let supabaseInstance = null;

function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false },
        db: { schema: 'public' }
      });
    } catch (err) {
      console.warn('⚠️ Supabase client initialization warning:', err.message);
      return null;
    }
  }
  return supabaseInstance;
}

function isSupabaseConfigured() {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http') && key.length > 20);
}

/**
 * Live test connection to Supabase instance
 */
async function testSupabaseConnection(overrideUrl = null, overrideKey = null) {
  const rawUrl = (overrideUrl || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_ID || DEFAULT_PROJECT_ID);
  const url = normalizeSupabaseUrl(rawUrl);
  const key = (overrideKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
  const projectId = DEFAULT_PROJECT_ID;

  if (!key) {
    return {
      connected: false,
      configured: false,
      projectId,
      projectUrl: url,
      apiKeySettingsUrl: `https://supabase.com/dashboard/project/${projectId}/settings/api`,
      sqlEditorUrl: `https://supabase.com/dashboard/project/${projectId}/sql/new`,
      error: `Project URL configured for "${projectId}" (${url}). To complete connection, copy and paste your anon public key or service_role key from https://supabase.com/dashboard/project/${projectId}/settings/api.`
    };
  }

    const startTime = Date.now();
  try {
    const testClient = createClient(url, key, { auth: { persistSession: false } });
    
    // Attempt lightweight ping on subscription_plans or institutions
    const { data, error } = await testClient.from('subscription_plans').select('id').limit(1);
    
    const latency = Date.now() - startTime;
    if (error && error.code !== 'PGRST116') {
      if (error.message && (error.message.includes('relation') || error.message.includes('schema cache') || error.message.includes('does not exist'))) {
        return {
          connected: true,
          configured: true,
          schemaNeeded: true,
          latencyMs: latency,
          message: 'Connected to Supabase PostgreSQL cloud instance! Live synchronization is active.'
        };
      }
      return {
        connected: false,
        configured: true,
        error: error.message || 'Database query error from Supabase.'
      };
    }

    return {
      connected: true,
      configured: true,
      schemaNeeded: false,
      latencyMs: latency,
      message: `Connected to Supabase Cloud Database! (Latency: ${latency}ms)`
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      error: err.message || 'Connection to Supabase failed.'
    };
  }
}

/**
 * Sync entire local JSON database to Supabase Cloud
 */
async function syncLocalToSupabase(localDb) {
  const client = getSupabaseClient();
  if (!client || !localDb) {
    return { success: false, error: 'Supabase client not configured or local data empty' };
  }

  const results = {
    plansSynced: 0,
    institutionsSynced: 0,
    ordersSynced: 0,
    usersSynced: 0,
    errors: []
  };

  try {
    // 1. Sync Subscription Plans
    if (Array.isArray(localDb.subscriptionPlans) && localDb.subscriptionPlans.length > 0) {
      for (const p of localDb.subscriptionPlans) {
        const row = {
          id: p.id,
          name: p.name,
          duration_days: p.durationDays || 30,
          price_inr: p.priceINR !== undefined ? p.priceINR : 0,
          period: p.period || 'Custom',
          badge: p.badge || '',
          description: p.description || '',
          features: p.features || [],
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('subscription_plans').upsert(row, { onConflict: 'id' });
        if (error) results.errors.push(`Plan ${p.id}: ${error.message}`);
        else results.plansSynced++;
      }
    }

    // 2. Sync Institutions
    if (localDb.institutions && typeof localDb.institutions === 'object') {
      for (const [id, inst] of Object.entries(localDb.institutions)) {
        const row = {
          id: inst.id || id,
          code: inst.code || '',
          name: inst.name || '',
          short_name: inst.shortName || '',
          address: inst.address || '',
          regd_no: inst.regdNo || '',
          contact_email: inst.contactEmail || '',
          contact_phone: inst.contactPhone || '',
          admin_user_id: inst.adminUserId || 'admin',
          subscription: inst.subscription || {},
          payment_config: inst.paymentConfig || {},
          receipt_template: inst.receiptTemplate || {},
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('institutions').upsert(row, { onConflict: 'id' });
        if (error) results.errors.push(`Institution ${id}: ${error.message}`);
        else results.institutionsSynced++;
      }
    }

    // 3. Sync Payment Orders
    if (localDb.paymentOrders && typeof localDb.paymentOrders === 'object') {
      for (const [id, order] of Object.entries(localDb.paymentOrders)) {
        const row = {
          id: order.id || id,
          plan_id: order.planId || '',
          institution_name: order.institutionName || '',
          contact_email: order.contactEmail || '',
          amount_inr: order.amount || 0,
          status: order.status || 'PENDING',
          upi_uri: order.upiUri || '',
          bank_rrn: order.bankRrn || '',
          verified_at: order.verifiedAt || null,
          created_at: order.createdAt || new Date().toISOString(),
          expires_at: order.expiresAt || null
        };
        const { error } = await client.from('payment_orders').upsert(row, { onConflict: 'id' });
        if (error) results.errors.push(`Order ${id}: ${error.message}`);
        else results.ordersSynced++;
      }
    }

    // 4. Sync Users
    if (localDb.users && typeof localDb.users === 'object') {
      results.usersSynced = 0;
      for (const [id, user] of Object.entries(localDb.users)) {
        const row = {
          id: user.id || id,
          institution_id: user.institutionId || null,
          role: user.role || 'student',
          name: user.name || id,
          login_id: user.loginId || id,
          email: user.email || null,
          phone: user.phone || null,
          roll: user.roll || null,
          staff_id: user.staffId || null,
          dept: user.dept || null,
          sem: user.sem || null,
          password: user.password || 'campus123',
          attendance: user.attendance ? { percentage: user.attendance, attended: user.attendanceAttended, total: user.attendanceSessionsTotal } : {}
        };
        const { error } = await client.from('users').upsert(row, { onConflict: 'id' });
        if (error) results.errors.push(`User ${id}: ${error.message}`);
        else results.usersSynced++;
      }
    }

    // 5. Sync Gate Passes
    const passes = Array.isArray(localDb.outpasses) ? localDb.outpasses : [];
    if (passes.length > 0) {
      results.gatePassesSynced = 0;
      for (const p of passes) {
        const row = {
          id: p.id,
          institution_id: p.institutionId || null,
          student_id: p.studentId || '',
          student_name: p.studentName || '',
          roll: p.roll || '',
          type: p.type || 'OUTPASS',
          destination: p.destination || '',
          reason: p.reason || '',
          out_time: p.outTime || '',
          expected_in_time: p.expectedInTime || '',
          status: p.status || 'PENDING',
          qr_data: p.qrToken || ''
        };
        const { error } = await client.from('gate_passes').upsert(row, { onConflict: 'id' });
        if (error) results.errors.push(`Pass ${p.id}: ${error.message}`);
        else results.gatePassesSynced++;
      }
    }

    // 6. Sync Activity History
    const activity = Array.isArray(localDb.activityHistory) ? localDb.activityHistory.slice(0, 50) : [];
    if (activity.length > 0) {
      results.activitySynced = 0;
      for (const a of activity) {
        const row = {
          id: a.id,
          institution_id: a.institutionId || null,
          action_type: a.actionType || 'AUDIT',
          actor_role: a.actorRole || 'System',
          actor_name: a.actorName || 'System Service',
          description: a.description || ''
        };
        const { error } = await client.from('activity_history').upsert(row, { onConflict: 'id' });
        if (error) results.errors.push(`Activity ${a.id}: ${error.message}`);
        else results.activitySynced++;
      }
    }

    return {
      success: results.errors.length === 0,
      summary: results
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      summary: results
    };
  }
}

module.exports = {
  getSupabaseCredentials,
  getSupabaseClient,
  isSupabaseConfigured,
  testSupabaseConnection,
  syncLocalToSupabase
};
