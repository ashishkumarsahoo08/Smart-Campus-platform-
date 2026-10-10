/**
 * SMART CAMPUS - AUTOMATED PAYMENT VERIFICATION CONTROLLER
 * Implements Webhook (Push) and Status Polling (Pull) Architecture.
 * Updates local data and mirrors updates to Supabase 'orders' & 'payment_orders' tables.
 */

const { getDb, saveDb } = require('../db');

/**
 * 1. WEBHOOK ENDPOINT (The Push System):
 * POST /api/payment/webhook
 * Simulates a payment gateway webhook callback.
 * Reads: { transactionId, status, [orderId, bankRrn, amount] }
 * If status is 'success', updates matching row in local DB and Supabase 'orders' table to payment_status = 'success'.
 */
exports.handleWebhook = async (req, res) => {
  try {
    const body = req.body || {};
    const targetId = (body.transactionId || body.orderId || body.order_id || body.id || '').trim();
    const rawStatus = (body.status || body.payment_status || body.paymentStatus || '').toString().toLowerCase().trim();

    if (!targetId) {
      return res.status(400).json({
        success: false,
        error: 'Missing transactionId or orderId in webhook payload.'
      });
    }

    const isSuccess = rawStatus === 'success' || rawStatus === 'paid' || rawStatus === 'confirmed' || rawStatus === 'completed';
    const now = new Date().toISOString();
    const bankRrn = body.bankRrn || body.rrn || body.referenceId || `RRN-${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

    const db = getDb();
    if (!db.paymentOrders) db.paymentOrders = {};

    // 1. Update in Local Database
    let order = db.paymentOrders[targetId];
    if (!order) {
      // Search by id or bankRrn
      order = Object.values(db.paymentOrders).find(o => o.id === targetId || o.orderId === targetId || o.bankRrn === targetId);
    }

    if (!order) {
      order = {
        id: targetId,
        orderId: targetId,
        amount: Number(body.amount || 1),
        currency: body.currency || 'INR',
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        payment_status: isSuccess ? 'success' : 'failed',
        bankRrn: bankRrn,
        createdAt: now,
        verifiedAt: now,
        verifiedBy: 'Automated Payment Gateway Webhook'
      };
      db.paymentOrders[targetId] = order;
      saveDb(db);
    } else {
      if (isSuccess) {
        order.status = 'SUCCESS';
        order.payment_status = 'success';
        order.bankRrn = order.bankRrn || bankRrn;
        order.verifiedAt = now;
        order.verifiedBy = 'Automated Payment Gateway Webhook';
      } else {
        order.status = 'FAILED';
        order.payment_status = 'failed';
        order.verifiedAt = now;
      }
      saveDb(db);
    }

    // 2. Update Supabase 'orders' and 'payment_orders' tables (The Push to Supabase)
    let supabaseUpdated = false;
    try {
      const { getSupabaseClient } = require('../supabase');
      const supabase = getSupabaseClient();
      if (supabase) {
        const supaStatus = isSuccess ? 'success' : 'failed';
        const generalStatus = isSuccess ? 'SUCCESS' : 'FAILED';

        // Update 'orders' table
        try {
          const { error: errOrders } = await supabase
            .from('orders')
            .update({
              payment_status: supaStatus,
              status: generalStatus,
              bank_rrn: bankRrn,
              verified_at: now,
              updated_at: now
            })
            .or(`order_id.eq.${targetId},id.eq.${targetId},transaction_id.eq.${targetId}`);

          if (!errOrders) supabaseUpdated = true;
        } catch (e) {}

        // Also update 'payment_orders' table if present in schema
        try {
          await supabase
            .from('payment_orders')
            .update({
              payment_status: supaStatus,
              status: generalStatus,
              bank_rrn: bankRrn,
              verified_at: now,
              updated_at: now
            })
            .or(`id.eq.${targetId},order_id.eq.${targetId}`);
        } catch (e) {}
      }
    } catch (e) {
      console.warn('⚠️ Webhook Supabase sync notice:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: isSuccess 
        ? 'Payment webhook processed successfully. Order updated to payment_status = success.' 
        : `Payment webhook received. Order updated to ${rawStatus}.`,
      orderId: targetId,
      status: isSuccess ? 'success' : rawStatus,
      payment_status: isSuccess ? 'success' : rawStatus,
      bankRrn: order?.bankRrn || bankRrn,
      supabaseUpdated
    });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process payment webhook: ' + err.message
    });
  }
};

/**
 * 2. STATUS ENQUIRY FALLBACK (The Pull System):
 * GET /api/payment/status/:orderId
 * Returns the current database status of that specific order.
 * If a webhook fails or drops due to network, frontend polls this route every 2 seconds.
 */
exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID parameter required.' });
    }

    const cleanId = orderId.trim();
    const db = getDb();
    let order = db.paymentOrders ? db.paymentOrders[cleanId] : null;

    if (!order && db.paymentOrders) {
      order = Object.values(db.paymentOrders).find(o => o.id === cleanId || o.orderId === cleanId);
    }

    // Check Supabase if local order is still pending or not found
    if (!order || (order && order.payment_status !== 'success' && order.status !== 'SUCCESS' && order.status !== 'CONFIRMED')) {
      try {
        const { getSupabaseClient } = require('../supabase');
        const supabase = getSupabaseClient();
        if (supabase) {
          // Check 'orders' table
          const { data: supaOrder } = await supabase
            .from('orders')
            .select('*')
            .or(`order_id.eq.${cleanId},id.eq.${cleanId},transaction_id.eq.${cleanId}`)
            .maybeSingle();

          if (supaOrder && (supaOrder.payment_status === 'success' || supaOrder.status === 'SUCCESS')) {
            if (order) {
              order.status = 'SUCCESS';
              order.payment_status = 'success';
              order.bankRrn = supaOrder.bank_rrn || order.bankRrn;
              order.verifiedAt = supaOrder.verified_at || new Date().toISOString();
              saveDb(db);
            } else {
              // Populate in local db cache
              order = {
                id: supaOrder.id || cleanId,
                orderId: cleanId,
                amount: Number(supaOrder.amount || 1),
                status: 'SUCCESS',
                payment_status: 'success',
                bankRrn: supaOrder.bank_rrn,
                verifiedAt: supaOrder.verified_at || new Date().toISOString()
              };
              if (!db.paymentOrders) db.paymentOrders = {};
              db.paymentOrders[cleanId] = order;
              saveDb(db);
            }
          }
        }
      } catch (e) {}
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        orderId: cleanId,
        status: 'not_found',
        payment_status: 'not_found',
        error: `Order with ID "${cleanId}" not found.`
      });
    }

    const isSuccess = (
      order.payment_status === 'success' ||
      order.status === 'SUCCESS' ||
      order.status === 'CONFIRMED' ||
      order.status === 'PAID'
    );

    const isFailed = (
      order.payment_status === 'failed' ||
      order.status === 'FAILED'
    );

    const isExpired = Boolean(order.expiresAt && new Date() > new Date(order.expiresAt));

    const finalStatus = isSuccess ? 'success' : (isFailed ? 'failed' : (isExpired ? 'expired' : 'pending'));

    return res.json({
      success: true,
      orderId: order.id || cleanId,
      status: finalStatus,
      payment_status: isSuccess ? 'success' : (isFailed ? 'failed' : 'pending'),
      amount: order.amount !== undefined ? order.amount : 1,
      currency: order.currency || 'INR',
      planId: order.planId || '',
      planName: order.planName || '',
      bankRrn: order.bankRrn || null,
      verifiedAt: order.verifiedAt || null,
      expiresAt: order.expiresAt || null,
      isExpired
    });
  } catch (err) {
    console.error('Status check error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal error checking payment status: ' + err.message
    });
  }
};
