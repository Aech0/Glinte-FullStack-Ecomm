import PolicyShell from '@/components/PolicyShell';

export const metadata = { title: 'Refund & Cancellation Policy — Glinte' };

export default function RefundPolicy() {
  return (
    <PolicyShell title="Refund & Cancellation Policy" lastUpdated="June 2026">
      <p>
        We want you to love your Glinte. If something's wrong — a damaged
        parcel, a broken seal, the wrong shade — we'll make it right. Because
        of strict cosmetic-hygiene rules, we can't accept returns on opened
        products. Here are the specifics.
      </p>

      <h2>1. Cancellations</h2>
      <ul>
        <li>
          You can cancel within <strong>2 hours</strong> of placing the order
          by emailing{' '}
          <a href="mailto:glintelipglaze@gmail.com" className="text-cherub-700 hover:underline">
            glintelipglaze@gmail.com
          </a>{' '}
          with your order number.
        </li>
        <li>
          Once an order is dispatched (you'll see a tracking ID), we can't
          intercept it.
        </li>
        <li>
          Cancelled orders are refunded in full to the original payment method
          within 5–7 business days.
        </li>
      </ul>

      <h2>2. Returns on unopened products</h2>
      <ul>
        <li>
          Unopened products with intact seals can be returned within{' '}
          <strong>7 days of delivery</strong>.
        </li>
        <li>
          Email us with your order number and a clear photo of the unopened
          pack. We'll arrange a reverse pickup.
        </li>
        <li>
          On receipt and inspection, we'll refund the product cost (less
          original shipping if any) within 5–7 business days.
        </li>
      </ul>

      <h2>3. Damaged or wrong items</h2>
      <ul>
        <li>
          If your parcel arrives damaged, or if you receive the wrong shade,
          email us within <strong>48 hours of delivery</strong> with photos of
          the parcel and product.
        </li>
        <li>
          We'll send a free replacement, or a full refund if a replacement
          isn't possible.
        </li>
        <li>You don't need to ship the damaged item back unless we ask.</li>
      </ul>

      <h2>4. What we can't refund</h2>
      <ul>
        <li>Opened products (hygiene)</li>
        <li>Products without their original packaging or seal</li>
        <li>Items damaged after delivery through misuse</li>
        <li>Returns requested beyond the 7-day window</li>
      </ul>

      <h2>5. How refunds reach you</h2>
      <p>
        Refunds are processed back to the original payment method via Razorpay.
        Depending on your bank, they typically reflect in 5–7 working days
        after we confirm the refund. UPI is usually fastest; international
        cards can take a little longer.
      </p>

      <h2>6. How to start a return or cancellation</h2>
      <p>
        Email{' '}
        <a href="mailto:glintelipglaze@gmail.com" className="text-cherub-700 hover:underline">
          glintelipglaze@gmail.com
        </a>{' '}
        with:
      </p>
      <ul>
        <li>Your order number</li>
        <li>A short description of the issue</li>
        <li>One or two clear photos if the product or parcel is damaged</li>
      </ul>
      <p>
        We respond within 24 working hours (Mon–Fri). For anything urgent, DM
        us on Instagram and we'll prioritise it.
      </p>
    </PolicyShell>
  );
}
