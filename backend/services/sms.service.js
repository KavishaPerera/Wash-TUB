// backend/services/sms.service.js
// notify.lk SMS wrapper — never throws, failures are logged silently.

const https = require('https');

/**
 * Send an SMS via notify.lk.
 * @param {string} toNumber  Recipient phone (0771234567 or 94771234567)
 * @param {string} body      Message text
 * @returns {Promise<string|null>}  notify.lk message ID on success, null on failure
 */
async function sendSms(toNumber, body) {
  try {
    // Normalize Sri Lankan numbers: 0771234567 → 94771234567
    let phone = toNumber.replace(/\s+/g, '');
    if (/^0\d{9}$/.test(phone)) {
      phone = '94' + phone.slice(1);
    }

    const params = new URLSearchParams({
      user_id:   process.env.NOTIFY_LK_USER_ID,
      api_key:   process.env.NOTIFY_LK_API_KEY,
      sender_id: process.env.NOTIFY_LK_SENDER_ID,
      to:        phone,
      message:   body,
    });

    const url = `https://app.notify.lk/api/v1/send?${params.toString()}`;

    return await new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.status === 'success') {
              resolve(json.id ? String(json.id) : 'sent');
            } else {
              console.error('[SMS] notify.lk error:', json);
              resolve(null);
            }
          } catch (parseErr) {
            console.error('[SMS] Invalid response from notify.lk:', data);
            resolve(null);
          }
        });
      }).on('error', (err) => {
        console.error('[SMS] HTTP request failed:', err.message);
        resolve(null);
      });
    });
  } catch (err) {
    console.error('[SMS] sendSms failed:', err.message);
    return null;
  }
}

module.exports = { sendSms };
