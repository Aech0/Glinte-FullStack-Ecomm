import Razorpay from 'razorpay';
import crypto from 'node:crypto';

let _client = null;
export function rzp() {
  if (!_client) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        'Razorpay keys missing — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env'
      );
    }
    _client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _client;
}

// Verifies the signature returned by the Razorpay checkout modal.
// The expected signature is HMAC-SHA256(order_id + "|" + payment_id, key_secret).
export function verifySignature({ orderId, paymentId, signature }) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}
