function SiteFooter() {
  return (
    <footer className="footer-shell mt-16 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px]">
      <div className="footer-newsletter grid gap-6 px-6 py-8 md:grid-cols-[1.1fr_1fr] md:items-center md:px-10">
        <div>
          <h3 className="font-display text-4xl leading-[1.05] text-white sm:text-5xl">
            Subscribe to our
            <br />
            <span className="text-white">newsletter</span>
          </h3>
          <p className="mt-4 max-w-md text-sm text-orange-100/85">
            Be the first to receive updates, market insights, and practical trading tips.
          </p>
        </div>

        <form className="footer-newsletter-form">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              className="footer-newsletter-input"
              placeholder="Enter your email"
            />
            <button type="button" className="footer-newsletter-button">
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs text-orange-100/80">
            By subscribing, you agree to our privacy policy and terms.
          </p>
        </form>
      </div>

      <div className="grid gap-8 px-6 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-display text-2xl text-white">OVERXBIT</p>
          <p className="mt-3 max-w-sm leading-7 text-slate-400">
            Your trusted destination for strategic trading execution, reliable market research,
            and long-term performance growth.
          </p>

          <div className="mt-6 flex gap-2">
            <a className="footer-social" href="#" aria-label="Instagram">
              IG
            </a>
            <a className="footer-social" href="#" aria-label="YouTube">
              YT
            </a>
            <a className="footer-social" href="#" aria-label="Facebook">
              FB
            </a>
            <a className="footer-social" href="#" aria-label="X">
              X
            </a>
            <a className="footer-social" href="#" aria-label="LinkedIn">
              IN
            </a>
          </div>
        </div>

        <div>
          <p className="footer-heading">Company</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">About</a></li>
            <li><a className="footer-link" href="#">Our Services</a></li>
            <li><a className="footer-link" href="#">Pricing</a></li>
            <li><a className="footer-link" href="#">Docs</a></li>
          </ul>
        </div>

        <div>
          <p className="footer-heading">Support</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">Account</a></li>
            <li><a className="footer-link" href="#faq">FAQ</a></li>
            <li><a className="footer-link" href="#contact">Contact</a></li>
            <li><a className="footer-link" href="#">Help Center</a></li>
          </ul>
        </div>

        <div>
          <p className="footer-heading">Legal</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li><a className="footer-link" href="#">Privacy Policy</a></li>
            <li><a className="footer-link" href="#">Terms of Service</a></li>
            <li><a className="footer-link" href="#">Cookies</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-sm text-slate-500 md:px-10">
        © 2026 OVERXBIT. All rights reserved. Developed by{' '}
        <a
          href="https://www.sawatech.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link text-orange-300 hover:text-orange-200"
        >
          SawaTech
        </a>
      </div>
      </div>
    </footer>
  )
}

export default SiteFooter
