// Online payments for VIP classes through Snippe (hosted checkout).
// Never trust the browser for payment status: a student is enrolled only after (a) a webhook whose HMAC
// signature verifies, or (b) the server itself re-reads the session from Snippe's API.
//
// Env: SNIPPE_API_KEY, SNIPPE_WEBHOOK_SECRET, SNIPPE_BASE_URL (default https://api.snippe.sh),
//      PUBLIC_URL (public https URL of this site, used for redirect + webhook URLs),
//      SNIPPE_MOCK=1 (local testing only: fake checkout, no money moves).
const crypto = require('crypto');
const { limiter, waitText } = require('./security');

module.exports = function init({ app, db, auth, need, audit, L, enroll }) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TZS',
    status TEXT NOT NULL DEFAULT 'pending',
    reference TEXT UNIQUE,
    checkout_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id, course_id);
  CREATE TABLE IF NOT EXISTS payment_events (event_id TEXT PRIMARY KEY, received_at TEXT NOT NULL);`);

  const cfg = () => ({
    key: process.env.SNIPPE_API_KEY || '',
    secret: process.env.SNIPPE_WEBHOOK_SECRET || '',
    base: (process.env.SNIPPE_BASE_URL || 'https://api.snippe.sh').replace(/\/+$/, ''),
    pub: (process.env.PUBLIC_URL || '').replace(/\/+$/, ''),
    mock: process.env.SNIPPE_MOCK === '1'
  });
  const enabled = () => { const c = cfg(); return c.mock || !!(c.key && c.secret && c.pub); };
  const payStart = limiter({ windowMs: 10 * 60e3, max: 10, blockMs: 10 * 60e3 });
  const now = () => new Date().toISOString();
  const DONE = ['completed', 'paid', 'success', 'succeeded'];

  function complete(p, req) {
    const done = db.transaction(() => {
      const r = db.prepare("UPDATE payments SET status='completed', completed_at=?, updated_at=? WHERE id=? AND status!='completed'").run(now(), now(), p.id);
      enroll(p.user_id, p.course_id);
      return r.changes === 1;
    })();
    if (done) audit(req || null, p.user_id, 'payment_completed', `course ${p.course_id}, TZS ${p.amount}, payment ${p.id}`);
    return done;
  }

  async function snippe(method, path, body) {
    const c = cfg();
    const r = await fetch(c.base + path, {
      method,
      headers: { Authorization: 'Bearer ' + c.key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(20000)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Snippe ${r.status}: ${(j && (j.message || j.error)) || 'request failed'}`);
    return j;
  }

  app.get('/api/payments/config', auth, (req, res) => res.json({ enabled: enabled(), mock: cfg().mock }));

  // Start a payment for a VIP class
  app.post('/api/courses/:id/pay', auth, need('student'), async (req, res) => {
    const key = 'u' + req.user.id;
    const w = payStart.wait(key);
    if (w) return res.status(429).json({ error: waitText(w, req.lang) });
    const c = db.prepare('SELECT id,title,access,price FROM courses WHERE id=?').get(+req.params.id);
    if (!c) return res.status(404).json({ error: L(req, 'Darasa halipo', 'Class not found') });
    if (c.access !== 'vip') return res.status(400).json({ error: L(req, 'Darasa hili ni la bure', 'This class is free') });
    if (db.prepare('SELECT 1 FROM enrollments WHERE user_id=? AND course_id=?').get(req.user.id, c.id))
      return res.json({ enrolled: true });
    if (!(c.price >= 500)) return res.status(400).json({ error: L(req, 'Darasa hili halina bei ya malipo mtandaoni. Tumia token au wasiliana na admin.', 'This class has no online price. Use a token or contact the admin.') });
    if (!enabled()) return res.status(503).json({ error: L(req, 'Malipo ya mtandaoni hayajawashwa bado. Tumia token au wasiliana na admin.', 'Online payments are not set up yet. Use a token or contact the admin.') });
    payStart.fail(key); // counts attempts (limit is on starts, not failures)
    const c0 = cfg();
    const ts = now();
    const r = db.prepare('INSERT INTO payments(user_id,course_id,amount,currency,created_at,updated_at) VALUES(?,?,?,?,?,?)')
      .run(req.user.id, c.id, c.price, 'TZS', ts, ts);
    const pid = r.lastInsertRowid;
    try {
      if (c0.mock) {
        const url = `${c0.pub || ''}/#/pay/${pid}?mock=1`;
        db.prepare('UPDATE payments SET checkout_url=?, reference=? WHERE id=?').run(url, 'mock_' + pid, pid);
        return res.json({ payment_id: pid, checkout_url: url, mock: true });
      }
      const j = await snippe('POST', '/api/v1/sessions', {
        amount: c.price, currency: 'TZS',
        customer: { name: req.user.name, email: req.user.email },
        description: c.title.slice(0, 100),
        redirect_url: `${c0.pub}/#/pay/${pid}`,
        webhook_url: `${c0.pub}/api/payments/webhook`,
        metadata: { payment_id: String(pid), user_id: String(req.user.id), course_id: String(c.id) },
        expires_in: 3600
      });
      const d = j.data || j;
      if (!d.checkout_url || !d.reference) throw new Error('Unexpected Snippe response');
      db.prepare('UPDATE payments SET checkout_url=?, reference=?, updated_at=? WHERE id=?').run(d.checkout_url, d.reference, now(), pid);
      audit(req, req.user.id, 'payment_started', `course ${c.id}, payment ${pid}`);
      res.json({ payment_id: pid, checkout_url: d.checkout_url });
    } catch (e) {
      db.prepare("UPDATE payments SET status='failed', updated_at=? WHERE id=?").run(now(), pid);
      console.error('Payment start failed:', e.message);
      res.status(502).json({ error: L(req, 'Imeshindwa kuanzisha malipo. Jaribu tena baadaye.', 'Could not start the payment. Please try again later.') });
    }
  });

  // Status for the return page. Re-checks Snippe itself if still pending.
  app.get('/api/payments/:id', auth, async (req, res) => {
    const p = db.prepare('SELECT * FROM payments WHERE id=?').get(+req.params.id);
    if (!p || (req.user.role !== 'admin' && p.user_id !== req.user.id)) return res.status(404).json({ error: L(req, 'Malipo hayapatikani', 'Payment not found') });
    if (p.status === 'pending' && p.reference && !cfg().mock && enabled()) {
      try {
        const j = await snippe('GET', '/api/v1/sessions/' + encodeURIComponent(p.reference));
        const d = j.data || j;
        const st = String(d.status || '').toLowerCase();
        const amt = d.amount && typeof d.amount === 'object' ? Number(d.amount.value) : Number(d.amount);
        if (DONE.includes(st) && (!amt || amt === p.amount)) complete(p, req);
        else if (['failed', 'expired', 'voided'].includes(st)) db.prepare('UPDATE payments SET status=?, updated_at=? WHERE id=?').run(st, now(), p.id);
      } catch (e) { console.error('Payment check failed:', e.message); }
    }
    const f = db.prepare('SELECT p.id,p.status,p.amount,p.currency,p.course_id,c.title FROM payments p JOIN courses c ON c.id=p.course_id WHERE p.id=?').get(p.id);
    res.json({ ...f, mock: cfg().mock && p.status === 'pending' });
  });

  // Mock mode only: lets you finish a fake payment locally
  app.post('/api/payments/:id/mock-complete', auth, need('student'), (req, res) => {
    if (!cfg().mock) return res.status(404).json({ error: 'Not found' });
    const p = db.prepare('SELECT * FROM payments WHERE id=? AND user_id=?').get(+req.params.id, req.user.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (req.body && req.body.fail) { db.prepare("UPDATE payments SET status='failed', updated_at=? WHERE id=? AND status='pending'").run(now(), p.id); return res.json({ ok: true, status: 'failed' }); }
    complete(p, req);
    res.json({ ok: true, status: 'completed' });
  });

  // Snippe webhook: signature = HMAC-SHA256 hex of `${timestamp}.${rawBody}` with the webhook secret
  app.post('/api/payments/webhook', (req, res) => {
    const secret = cfg().secret;
    const raw = req.rawBody;
    const ts = req.get('X-Webhook-Timestamp') || '';
    const sig = String(req.get('X-Webhook-Signature') || '').replace(/^sha256=/i, '').trim();
    if (!secret || !raw || !ts || !sig) return res.status(401).json({ error: 'unauthorized' });
    let tms = Number(ts); if (tms < 1e12) tms *= 1000; // seconds or ms
    if (!tms || Math.abs(Date.now() - tms) > 5 * 60e3) return res.status(401).json({ error: 'stale' });
    const want = crypto.createHmac('sha256', secret).update(`${ts}.${raw.toString('utf8')}`).digest('hex');
    const a = Buffer.from(want), b = Buffer.from(sig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'bad signature' });

    const ev = req.body || {};
    const d = ev.data || {};
    if (ev.id) {
      const seen = db.prepare('INSERT OR IGNORE INTO payment_events(event_id,received_at) VALUES(?,?)').run(String(ev.id), now());
      if (seen.changes === 0) return res.json({ ok: true, duplicate: true });
    }
    const p = d.reference ? db.prepare('SELECT * FROM payments WHERE reference=?').get(String(d.reference)) : null;
    if (!p) return res.json({ ok: true }); // unknown reference: acknowledge so Snippe stops retrying
    if (ev.type === 'payment.completed') {
      const amt = d.amount && typeof d.amount === 'object' ? Number(d.amount.value) : Number(d.amount);
      if (amt && amt !== p.amount) { console.error('Webhook amount mismatch for payment', p.id); return res.json({ ok: true, ignored: 'amount' }); }
      complete(p, req);
    } else if (['payment.failed', 'payment.voided', 'payment.expired'].includes(ev.type) && p.status === 'pending') {
      db.prepare('UPDATE payments SET status=?, updated_at=? WHERE id=?').run(ev.type.split('.')[1], now(), p.id);
    }
    res.json({ ok: true });
  });

  // Admin: all payments (below)
  app.get('/api/payments', auth, need('admin'), (req, res) => {
    const rows = db.prepare(`SELECT p.id,p.status,p.amount,p.currency,p.created_at,p.completed_at,u.name AS user_name,u.email AS user_email,c.title AS course_title
      FROM payments p JOIN users u ON u.id=p.user_id JOIN courses c ON c.id=p.course_id ORDER BY p.id DESC LIMIT 500`).all();
    const total = db.prepare("SELECT COALESCE(SUM(amount),0) s, COUNT(*) n FROM payments WHERE status='completed'").get();
    res.json({ enabled: enabled(), mock: cfg().mock, total: total.s, count: total.n, payments: rows });
  });
  return { enabled };
};
