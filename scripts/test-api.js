/**
 * Smart Campus Integration & Health Verification Test Suite
 * Run with: node scripts/test-api.js
 */

const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3042';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({ statusCode: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log(`🧪 SMART CAMPUS AUTOMATED DEPLOYMENT & HEALTH TEST SUITE`);
  console.log(`   Target Server: ${BASE_URL}`);
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /api/health returns 200 and healthy status', async () => {
    const res = await request('GET', '/api/health');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.status !== 'healthy') throw new Error(`Expected healthy, got ${res.data.status}`);
  });

  // 2. Network Info
  await test('GET /api/network-info returns server IP and ports', async () => {
    const res = await request('GET', '/api/network-info');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.httpPort) throw new Error('Missing httpPort in network-info');
  });

  // 3. Database Mode
  await test('GET /api/system/db-mode returns mode and metrics', async () => {
    const res = await request('GET', '/api/system/db-mode');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.mode) throw new Error('Missing mode in db-mode response');
  });

  // 4. User Directory
  await test('GET /api/users returns list of registered users', async () => {
    const res = await request('GET', '/api/users');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data.users)) throw new Error('Expected users to be an array');
  });

  // 5. Outpasses API
  await test('GET /api/gatepasses/outpasses returns outpass records', async () => {
    const res = await request('GET', '/api/gatepasses/outpasses');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data.outpasses)) throw new Error('Expected outpasses array');
  });

  // 6. Leaves API
  await test('GET /api/gatepasses/leaves returns multi-day leave records', async () => {
    const res = await request('GET', '/api/gatepasses/leaves');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data.leaves)) throw new Error('Expected leaves array');
  });

  // 7. Gate Movements API
  await test('GET /api/gatepasses/movements returns security scan log', async () => {
    const res = await request('GET', '/api/gatepasses/movements');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data.movements)) throw new Error('Expected movements array');
  });

  // 8. Fee Desk Overview
  await test('GET /api/fees/overview returns finance KPIs', async () => {
    const res = await request('GET', '/api/fees/overview');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.summary || res.data.summary.totalStudentsEnrolled === undefined) throw new Error('Expected summary.totalStudentsEnrolled field');
  });

  // 9. API Configuration
  await test('GET /api/system/api-config returns Bhashini and Grok status', async () => {
    const res = await request('GET', '/api/system/api-config');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.config.bhashini || !res.data.config.grok) throw new Error('Missing API provider configs');
  });

  // 10. Web Application Static Files
  await test('GET / (index.html) serves with 200 OK and security headers', async () => {
    const res = await request('GET', '/');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.headers['x-content-type-options']) throw new Error('Missing X-Content-Type-Options security header');
  });

  // 11. Favicon SVG
  await test('GET /favicon.svg serves with 200 OK', async () => {
    const res = await request('GET', '/favicon.svg');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
  });

  // 12. PWA Manifest
  await test('GET /manifest.json serves with 200 OK', async () => {
    const res = await request('GET', '/manifest.json');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.short_name !== 'SmartCampus') throw new Error('Invalid manifest short_name');
  });

  // 13. Institutions Directory API
  await test('GET /api/institutions returns registered institutions list', async () => {
    const res = await request('GET', '/api/institutions');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.institutions || typeof res.data.institutions !== 'object') throw new Error('Expected institutions dictionary');
  });

  // 14. Subscription Plans API
  await test('GET /api/institutions/subscription-plans returns plans and owner notice', async () => {
    const res = await request('GET', '/api/institutions/subscription-plans');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data.plans)) throw new Error('Expected plans array');
    if (!res.data.websiteOwnerNotice) throw new Error('Expected websiteOwnerNotice string');
  });

  // 15. Plan Pricing Update API
  await test('POST /api/institutions/subscription-plans updates plans dynamically', async () => {
    const res = await request('POST', '/api/institutions/subscription-plans', {
      plans: { 'PLAN-TOKEN': { priceINR: 1, durationLabel: 'Instant Test' } }
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success: true');
  });

  // 16a. Payment Webhook Endpoint (The Push System)
  let testOrderId = '';
  await test('POST /api/payment/webhook processes gateway push callback and updates payment_status to success', async () => {
    // Create an order
    const orderRes = await request('POST', '/api/institutions/create-payment-order', {
      planId: 'PLAN-MONTHLY',
      institutionName: 'Automated Push Test Institute',
      contactEmail: 'webhook@citest.edu'
    });
    if (orderRes.statusCode !== 201) throw new Error(`Create order failed with ${orderRes.statusCode}`);
    testOrderId = orderRes.data.order.id;

    // Send Webhook callback
    const webhookRes = await request('POST', '/api/payment/webhook', {
      transactionId: testOrderId,
      status: 'success',
      bankRrn: 'RRN-PUSH-987654'
    });
    if (webhookRes.statusCode !== 200) throw new Error(`Webhook failed with ${webhookRes.statusCode}: ${JSON.stringify(webhookRes.data)}`);
    if (webhookRes.data.payment_status !== 'success') throw new Error(`Expected payment_status success, got ${webhookRes.data.payment_status}`);
  });

  // 16b. Payment Status Enquiry Fallback (The Pull System / Polling)
  await test('GET /api/payment/status/:orderId verifies polling fallback returns current order status', async () => {
    const statusRes = await request('GET', `/api/payment/status/${testOrderId}`);
    if (statusRes.statusCode !== 200) throw new Error(`Status polling failed with ${statusRes.statusCode}`);
    if (statusRes.data.status !== 'success') throw new Error(`Expected status success, got ${statusRes.data.status}`);
    if (statusRes.data.payment_status !== 'success') throw new Error(`Expected payment_status success, got ${statusRes.data.payment_status}`);
  });

  // 16c. Order Success Page
  await test('GET /order-success.html serves verified receipt confirmation page', async () => {
    const res = await request('GET', '/order-success.html');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.includes('Payment Confirmed')) throw new Error('Expected Payment Confirmed title in page HTML');
  });

  // 16d. Subscription Registration with Verified Order
  await test('POST /api/institutions/register-subscription provisions institution with verified order', async () => {
    const res = await request('POST', '/api/institutions/register-subscription', {
      institutionName: 'Automated CI Test Institute',
      institutionCode: 'CITEST',
      contactEmail: 'ci@citest.edu',
      adminPassword: 'Password@2026',
      planId: 'PLAN-MONTHLY',
      amountPaid: 1,
      orderId: testOrderId
    });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(`Expected 200/201, got ${res.statusCode}: ${JSON.stringify(res.data)}`);
    if (!res.data.institutionId) throw new Error('Missing institutionId in response');
  });

  // 17. Authentication Login API
  await test('POST /api/auth/login authenticates registered users', async () => {
    const res = await request('POST', '/api/auth/login', {
      role: 'student',
      username: 'CS-2026-001',
      password: 'campus123'
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.user || res.data.user.role !== 'student') throw new Error('Invalid user object in login response');
  });

  // 18. Multilingual Translation Languages
  await test('GET /api/translation/languages returns supported languages', async () => {
    const res = await request('GET', '/api/translation/languages');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!Array.isArray(res.data.languages)) throw new Error('Expected languages array');
  });

  // 19. AI Assistant NLP Engine
  await test('POST /api/ai/chat returns intelligent campus response', async () => {
    const res = await request('POST', '/api/ai/chat', {
      query: 'What is my current semester fee due?',
      studentId: 'student1',
      language: 'en'
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.reply) throw new Error('Missing reply from AI chat');
  });

  // 20. Production Security Headers & Fingerprint Removal
  await test('Security headers are active & X-Powered-By is hidden', async () => {
    const res = await request('GET', '/api/health');
    if (res.headers['x-powered-by']) throw new Error('X-Powered-By header should be disabled');
    if (!res.headers['x-content-type-options']) throw new Error('Missing X-Content-Type-Options header');
    if (!res.headers['x-frame-options']) throw new Error('Missing X-Frame-Options header');
  });

  console.log('\n--------------------------------------------------------');
  console.log(`🏁 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('--------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL INTEGRATION & HEALTH TESTS PASSED! System is 100% deployment ready.');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
