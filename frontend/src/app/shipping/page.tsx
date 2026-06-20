import PolicyShell from '@/components/PolicyShell';

export const metadata = { title: 'Shipping Policy — Glinte' };

export default function ShippingPolicy() {
  return (
    <PolicyShell title="Shipping Policy" lastUpdated="June 2026">
      <p>
        We ship across India through Shiprocket-partnered couriers. Here's what
        to expect.
      </p>

      <h2>1. Where we ship</h2>
      <p>
        All over India. We don't currently ship internationally — drop us a
        line if you'd like that to change.
      </p>

      <h2>2. Shipping cost</h2>
      <ul>
        <li>Orders <strong>under ₹999</strong> — flat ₹49 shipping</li>
        <li>Orders <strong>₹999 and above</strong> — free shipping</li>
      </ul>
      <p>You'll see your shipping cost clearly on the cart page before paying.</p>

      <h2>3. Order processing</h2>
      <ul>
        <li>Orders placed before 2 PM (Mon–Fri) are usually dispatched the same day.</li>
        <li>Orders placed after 2 PM, on weekends, or on public holidays are dispatched the next working day.</li>
        <li>You'll receive a confirmation email from Razorpay the moment payment goes through, and a tracking link from Shiprocket once your parcel ships.</li>
      </ul>

      <h2>4. Delivery times</h2>
      <ul>
        <li><strong>Metro cities</strong> — typically 3–5 business days</li>
        <li><strong>Tier-2 cities and smaller towns</strong> — typically 5–8 business days</li>
        <li><strong>Remote pincodes</strong> — may take up to 10 business days</li>
      </ul>
      <p>
        These are best estimates — actual delivery times can shift based on
        courier load, weather, or regional disruptions.
      </p>

      <h2>5. Tracking your order</h2>
      <p>
        Once your parcel is dispatched, you'll get a tracking link via email
        and SMS. You can also check the status anytime by signing in and going
        to <strong>My account → Orders</strong>.
      </p>

      <h2>6. Failed delivery / incorrect address</h2>
      <ul>
        <li>If a delivery fails because no one was at the address, our courier partner will attempt redelivery once or twice before returning the parcel to us.</li>
        <li>If you spot a wrong address right after ordering, email us within 2 hours and we'll try to update it before dispatch.</li>
        <li>If a parcel returns to us due to an incorrect address, we'll reach out and reship after collecting a re-shipping fee, or refund the order minus original shipping.</li>
      </ul>

      <h2>7. Damaged or lost parcels</h2>
      <p>
        If your parcel arrives damaged, email us within 48 hours of delivery
        with a photo. For lost parcels, we'll wait the courier's official
        investigation window (usually 7 working days) and then either reship
        or refund. See our Refund Policy for more detail.
      </p>

      <h2>8. Questions</h2>
      <p>
        Email{' '}
        <a href="mailto:glintelipglaze@gmail.com" className="text-cherub-700 hover:underline">
          glintelipglaze@gmail.com
        </a>{' '}
        and we'll get back within 24 working hours.
      </p>
    </PolicyShell>
  );
}
