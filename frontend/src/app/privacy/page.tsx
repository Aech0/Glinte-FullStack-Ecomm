import PolicyShell from '@/components/PolicyShell';

export const metadata = { title: 'Privacy Policy — Glinte' };

export default function PrivacyPolicy() {
  return (
    <PolicyShell title="Privacy Policy" lastUpdated="June 2026">
      <p>
        At Glinte we take your privacy seriously. This policy explains what we collect
        when you visit glinte.in, why we collect it, and how we keep it safe.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Glinte ("we," "our," or "us") is a small-batch lip gloss brand operated from
        India. You can reach us anytime at{' '}
        <a href="mailto:glintelipglaze@gmail.com" className="text-cherub-700 hover:underline">
          glintelipglaze@gmail.com
        </a>.
      </p>

      <h2>2. What we collect</h2>
      <p>When you create an account or place an order, we collect:</p>
      <ul>
        <li>Your name, email address, and phone number</li>
        <li>Your shipping and billing address</li>
        <li>An encrypted (hashed) version of your password — we never see the plaintext</li>
        <li>Your order history and cart contents</li>
        <li>Anonymous usage data (pages visited, device type) for site improvement</li>
      </ul>
      <p>
        We do <strong>not</strong> store your card number, UPI PIN, or any other
        payment instrument. All payment data is captured directly by Razorpay
        inside their secure checkout modal and never touches our servers.
      </p>

      <h2>3. Why we collect it</h2>
      <ul>
        <li>To process your orders and dispatch your parcels</li>
        <li>To send you order confirmations and shipping updates</li>
        <li>To let you sign in and see your order history</li>
        <li>To respond to customer-care questions</li>
        <li>To keep the site secure and fix bugs</li>
      </ul>

      <h2>4. Who we share it with</h2>
      <p>We share the minimum needed with two service providers:</p>
      <ul>
        <li>
          <strong>Razorpay</strong> — handles all payments. We pass them the order
          amount and your contact details for receipts. Their privacy policy lives at{' '}
          <a href="https://razorpay.com/privacy/" target="_blank" rel="noreferrer" className="text-cherub-700 hover:underline">
            razorpay.com/privacy
          </a>.
        </li>
        <li>
          <strong>Shiprocket</strong> — handles shipping. We pass them your name,
          address, phone, and order contents so they can dispatch and track your
          parcel. Their privacy policy is at{' '}
          <a href="https://www.shiprocket.in/privacy-policy/" target="_blank" rel="noreferrer" className="text-cherub-700 hover:underline">
            shiprocket.in/privacy-policy
          </a>.
        </li>
      </ul>
      <p>
        We do not sell, rent, or trade your personal information to anyone.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We use a small, anonymous cookie to remember your cart while you browse
        — this is what lets you add an item, close the tab, come back tomorrow,
        and still find your gloss waiting. When you sign in, we replace it with
        a secure session token. No advertising or third-party tracking cookies
        are set by us.
      </p>

      <h2>6. How long we keep it</h2>
      <p>
        We keep account and order records for as long as you have an account.
        If you'd like your account deleted, email us and we'll handle it within
        7 working days.
      </p>

      <h2>7. Your rights</h2>
      <ul>
        <li>You can sign in and update your details any time</li>
        <li>You can ask for a copy of the data we hold on you</li>
        <li>You can ask us to delete your data</li>
        <li>You can ask us to stop sending you marketing messages</li>
      </ul>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date at
        the top will reflect any change. Material changes that affect how we
        handle your data will be highlighted on the site.
      </p>
    </PolicyShell>
  );
}
