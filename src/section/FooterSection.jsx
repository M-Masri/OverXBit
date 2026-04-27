function FooterSection() {
  return (
    <footer className="mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-white">OVER X BIT</p>
          <h4 className="mt-2 text-2xl font-semibold text-white">Smart strategies. Trusted results. Wealth that works.</h4>
          <p className="mt-3 text-sm text-slate-400">Dubai, UAE · Beirut, Lebanon · Yerevan, Armenia</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Main Pages</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Home</li>
            <li>Features</li>
            <li>Pricing</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>UAE: +971527030890</li>
            <li>LEB: +9613471472</li>
            <li>ARM: +3744999048</li>
            <li>info@overxbit.com</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-4 text-xs text-slate-500">© 2025 OVERXBIT. All rights reserved.</div>
    </footer>
  )
}

export default FooterSection
