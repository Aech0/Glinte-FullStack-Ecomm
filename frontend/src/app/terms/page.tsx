import PolicyShell from '@/components/PolicyShell';

export const metadata = { title: 'Terms & Conditions — Glinte' };

export default function TermsPage() {
  return (
    <PolicyShell title="Terms & Conditions" lastUpdated="June 2026">
      <p>
        These terms apply to everyone using glinte.in. By browsing or placing
        an order you agree to them.
      </p>

      <h2>1. About Glinte</h2>
      <p>
        Glinte is a small-batch Indian lip gloss brand. Orders, customer-care
        and dispatch are operated by Glinte from India. You can reach us at{' '}
        <a href="mailto:glintelipglaze@gmail.com" className="text-cherub-700 hover:underline">
          glintelipglaze@gmail.com
        </a>.
      </p>

      <h2>2. Account and password</h2>
      <ul>
        <li>You're responsible for keeping your account password private.</li>
        <li>You must give accurate contact and shipping details so we can deliver your order.</li>
        <li>You must be at least 18 years old to register, or have a parent or guardian's consent.</li>
      </ul>

      <h2>3. Placing an order</h2>
      <p>
        When you complete checkout and the payment succeeds, an order is created
        in our system. This is an offer to buy at the price shown. We confirm
        the order by dispatching it. If stock or pricing changes before
        dispatch, we'll reach out and refund any difference — see the Refund
        Policy.
      </p>

      <h2>4. Pricing</h2>
      <ul>
        <li>Prices are in Indian Rupees (₹) and include all applicable taxes.</li>
        <li>Shipping cost is shown clearly on the cart page before checkout.</li>
        <li>We reserve the right to correct any pricing errors before dispatch.</li>
      </ul>

      <h2>5. Payments</h2>
      <p>
        Payments are processed by Razorpay using UPI, debit and credit cards,
        netbanking, or wallets. All payment details are entered directly into
        Razorpay's secure checkout — we never see or store your card number,
        UPI PIN, or OTP. By paying, you agree to Razorpay's terms of use.
      </p>

      <h2>6. Use of the site</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site for any unlawful purpose</li>
        <li>Try to break the site's security, scrape data, or interfere with other shoppers</li>
        <li>Resell Glinte products without our written permission</li>
      </ul>

      <h2>7. Product information</h2>
      <p>
        We do our best to show shades and ingredients accurately. Colour can
        vary slightly based on your screen and skin tone. Ingredients are
        printed on every pack — please read them and patch-test if you have
        known sensitivities.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The Glinte name, logo, product names, photography, and copy are owned
        by Glinte. You may not use them without written permission.
      </p>

      <h2>9. Liability</h2>
      <p>
        We stand behind our formula and our shipping. If a product or order
        goes wrong, see the Refund and Shipping policies — we'll make it right.
        Beyond that, Glinte's liability is limited to the price you paid for
        the affected order.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes will be
        handled by the courts of Mumbai, Maharashtra.
      </p>
    </PolicyShell>
  );
}
