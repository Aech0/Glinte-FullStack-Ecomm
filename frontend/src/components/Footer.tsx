import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-cherub-100 bg-cherub-50/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2 md:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/homepage/glinte-logo.png"
            alt="Glinte"
            className="h-14 w-auto"
          />
          <p className="mt-3 text-ink-muted max-w-sm">
            High-shine, non-sticky lip glosses crafted in small batches. Vegan,
            cruelty-free, and made in India with love.
          </p>
        </div>
        <div>
          <div className="font-medium mb-3">Shop</div>
          <ul className="space-y-2 text-ink-muted">
            <li><Link href="/" className="hover:text-cherub-700">All glosses</Link></li>
            <li><Link href="/about" className="hover:text-cherub-700">About</Link></li>
            <li><Link href="/faq" className="hover:text-cherub-700">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-cherub-700">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Account</div>
          <ul className="space-y-2 text-ink-muted">
            <li><Link href="/login" className="hover:text-cherub-700">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-cherub-700">Create account</Link></li>
            <li><Link href="/account/orders" className="hover:text-cherub-700">My orders</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Legal</div>
          <ul className="space-y-2 text-ink-muted">
            <li><Link href="/privacy" className="hover:text-cherub-700">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-cherub-700">Terms & Conditions</Link></li>
            <li><Link href="/refund" className="hover:text-cherub-700">Refund Policy</Link></li>
            <li><Link href="/shipping" className="hover:text-cherub-700">Shipping Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cherub-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-muted">
          <div>© {new Date().getFullYear()} Glinte. All rights reserved.</div>
          <div>Made in India · Free shipping over ₹999</div>
        </div>
      </div>
    </footer>
  );
}
